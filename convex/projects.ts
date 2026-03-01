import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import type { Id } from './_generated/dataModel';

export const createProject = mutation({
  args: {
    displayName: v.string(),
    owner: v.string(),
    repo: v.string(),
    branch: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Must be authenticated to add a repo');
    }

    const existing = await ctx.db
      .query('projects')
      .withIndex('by_owner_repo_branch', (q) =>
        q.eq('owner', args.owner).eq('repo', args.repo).eq('branch', args.branch),
      )
      .first();

    if (existing) {
      if (existing.userId !== user.subject) {
        throw new Error('This repo is already tracked by another user');
      }
      return existing._id;
    }

    return await ctx.db.insert('projects', {
      displayName: args.displayName,
      owner: args.owner,
      repo: args.repo,
      branch: args.branch,
      userId: user.subject,
    });
  },
});

export const listProjects = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      return [];
    }
    return await ctx.db
      .query('projects')
      .withIndex('by_userId', (q) => q.eq('userId', user.subject))
      .order('desc')
      .collect();
  },
});

export const updateProject = mutation({
  args: {
    projectId: v.id('projects'),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Must be authenticated to edit a project');
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    if (project.userId !== user.subject) {
      throw new Error('You do not have access to this project');
    }

    await ctx.db.patch(args.projectId, {
      displayName: args.displayName.trim() || project.repo,
    });
  },
});

export const updateProjectSettings = mutation({
  args: {
    projectId: v.id('projects'),
    displayName: v.optional(v.string()),
    isPublic: v.optional(v.boolean()),
    syncFrequency: v.optional(v.union(v.literal('on_visit'), v.literal('daily'), v.literal('weekly'))),
    openRouterApiKey: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Must be authenticated to edit a project');
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error('Project not found');
    }
    if (project.userId !== user.subject) {
      throw new Error('You do not have access to this project');
    }

    const updates: Record<string, unknown> = {};
    if (args.displayName !== undefined) {
      updates.displayName = args.displayName.trim() || project.repo;
    }
    if (args.isPublic !== undefined) {
      updates.isPublic = args.isPublic;
    }
    if (args.syncFrequency !== undefined) {
      updates.syncFrequency = args.syncFrequency;
    }
    if (args.openRouterApiKey !== undefined) {
      updates.openRouterApiKey = args.openRouterApiKey === null ? undefined : args.openRouterApiKey;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.db.patch(args.projectId, updates);
    }
  },
});

function stripSecrets<T extends { openRouterApiKey?: string }>(doc: T): Omit<T, 'openRouterApiKey'> {
  const { openRouterApiKey: _, ...rest } = doc;
  return rest as Omit<T, 'openRouterApiKey'>;
}

export const getProject = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return null;

    const user = await ctx.auth.getUserIdentity();
    if (!user || project.userId !== user.subject) {
      return null;
    }
    return stripSecrets(project);
  },
});

export const getProjectPublic = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project || !project.isPublic) return null;
    return stripSecrets(project);
  },
});

export const listProjectsWithLatestCommits = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) return [];

    const projects = await ctx.db
      .query('projects')
      .withIndex('by_userId', (q) => q.eq('userId', user.subject))
      .order('desc')
      .collect();

    return await Promise.all(
      projects.map(async (p) => {
        const latestCommits = await ctx.db
          .query('commits')
          .withIndex('by_projectId_committedAt', (q) => q.eq('projectId', p._id))
          .order('desc')
          .take(3);
        return { ...stripSecrets(p), latestCommits };
      }),
    );
  },
});

export const listCommits = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project) return [];

    const user = await ctx.auth.getUserIdentity();
    if (!user || project.userId !== user.subject) {
      return [];
    }

    return await ctx.db
      .query('commits')
      .withIndex('by_projectId_committedAt', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .collect();
  },
});

export const listCommitsPublic = query({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    const project = await ctx.db.get(args.projectId);
    if (!project || !project.isPublic) return [];

    return await ctx.db
      .query('commits')
      .withIndex('by_projectId_committedAt', (q) => q.eq('projectId', args.projectId))
      .order('desc')
      .collect();
  },
});
