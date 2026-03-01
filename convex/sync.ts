'use node';

import { v } from 'convex/values';
import { action, internalAction } from './_generated/server';
import { api, internal } from './_generated/api';

type GitHubCommit = {
  sha: string;
  commit: {
    message: string;
    author: { date: string };
  };
  author: { login: string } | null;
};

async function generateSummary(message: string, authorLogin: string, apiKey: string, model: string): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are a product manager writing a professional changelog. Given a commit message and author, write a 0-3 line high-level summary suitable for a changelog. Be concise and user-facing. Respond with only the summary text, no JSON.',
        },
        {
          role: 'user',
          content: `Commit by ${authorLogin}: "${message}"`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content?.trim();
  return content ?? message;
}

export const syncProject = internalAction({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const project = await ctx.runQuery(internal.syncHelpers.getProjectInternal, {
      projectId: args.projectId,
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const apiKey = project.openRouterApiKey ?? process.env.OPENROUTER_API_KEY;
    const model = process.env.OPENROUTER_MODEL ?? 'openai/gpt-4o-mini';

    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY is not set (neither project-level nor env)');
    }

    const url = `https://api.github.com/repos/${project.owner}/${project.repo}/commits?sha=${encodeURIComponent(project.branch)}&per_page=100`;
    const res = await fetch(url, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status} ${await res.text()}`);
    }

    const commits = (await res.json()) as GitHubCommit[];
    const totalCount = commits.length;

    await ctx.runMutation(internal.syncHelpers.setSyncProgress, {
      projectId: args.projectId,
      inProgress: true,
      processedCount: 0,
      totalCount,
    });

    try {
      for (let i = 0; i < commits.length; i++) {
        const c = commits[i];
        const commitDate = new Date(c.commit.author.date).getTime();
        const authorLogin = c.author?.login ?? 'unknown';
        const summary = await generateSummary(c.commit.message, authorLogin, apiKey, model);

        await ctx.runMutation(internal.syncHelpers.upsertCommit, {
          projectId: args.projectId,
          sha: c.sha,
          message: c.commit.message,
          authorLogin,
          committedAt: commitDate,
          summary,
        });

        await ctx.runMutation(internal.syncHelpers.setSyncProgress, {
          projectId: args.projectId,
          inProgress: true,
          processedCount: i + 1,
          totalCount,
        });
      }

      await ctx.runMutation(internal.syncHelpers.setLastSyncedAt, {
        projectId: args.projectId,
      });
    } catch (err) {
      await ctx.runMutation(internal.syncHelpers.clearSyncProgress, {
        projectId: args.projectId,
      });
      throw err;
    }
  },
});

function startOfTodayUtc(): number {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

function startOfThisWeekUtc(): number {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday as start of week
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  return Date.UTC(monday.getUTCFullYear(), monday.getUTCMonth(), monday.getUTCDate());
}

export const triggerSyncIfNeeded = action({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error('Must be authenticated');
    }

    const project = await ctx.runQuery(api.projects.getProject, {
      projectId: args.projectId,
    });

    if (!project) {
      throw new Error('Project not found');
    }

    const frequency = project.syncFrequency ?? 'on_visit';
    const lastSynced = project.lastSyncedAt ?? 0;

    let shouldSync = false;
    if (frequency === 'on_visit') {
      const todayStart = startOfTodayUtc();
      shouldSync = lastSynced < todayStart;
    } else if (frequency === 'daily') {
      const todayStart = startOfTodayUtc();
      shouldSync = lastSynced < todayStart;
    } else if (frequency === 'weekly') {
      const weekStart = startOfThisWeekUtc();
      shouldSync = lastSynced < weekStart;
    }

    if (!shouldSync) {
      return;
    }

    await ctx.scheduler.runAfter(0, internal.sync.syncProject, {
      projectId: args.projectId,
    });
  },
});

export const runScheduledSync = internalAction({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.runQuery(internal.syncHelpers.listProjectsForScheduledSync, {});

    const todayStart = startOfTodayUtc();
    const weekStart = startOfThisWeekUtc();

    for (const project of projects) {
      const lastSynced = project.lastSyncedAt ?? 0;
      const frequency = project.syncFrequency ?? 'on_visit';
      const shouldSync =
        frequency === 'daily' ? lastSynced < todayStart : frequency === 'weekly' ? lastSynced < weekStart : false;

      if (shouldSync) {
        await ctx.scheduler.runAfter(0, internal.sync.syncProject, {
          projectId: project._id,
        });
      }
    }
  },
});
