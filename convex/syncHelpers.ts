import { v } from 'convex/values';
import { internalMutation, internalQuery } from './_generated/server';

export const getProjectInternal = internalQuery({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.projectId);
  },
});

export const upsertCommit = internalMutation({
  args: {
    projectId: v.id('projects'),
    sha: v.string(),
    message: v.string(),
    authorLogin: v.string(),
    committedAt: v.number(),
    summary: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('commits')
      .withIndex('by_projectId_sha', (q) => q.eq('projectId', args.projectId).eq('sha', args.sha))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        message: args.message,
        authorLogin: args.authorLogin,
        committedAt: args.committedAt,
        summary: args.summary,
      });
    } else {
      await ctx.db.insert('commits', {
        projectId: args.projectId,
        sha: args.sha,
        message: args.message,
        authorLogin: args.authorLogin,
        committedAt: args.committedAt,
        summary: args.summary,
      });
    }
  },
});

export const setLastSyncedAt = internalMutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      lastSyncedAt: Date.now(),
      syncInProgress: false,
      syncProcessedCount: undefined,
      syncTotalCount: undefined,
    });
  },
});

export const clearSyncProgress = internalMutation({
  args: { projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      syncInProgress: false,
      syncProcessedCount: undefined,
      syncTotalCount: undefined,
    });
  },
});

export const setSyncProgress = internalMutation({
  args: {
    projectId: v.id('projects'),
    inProgress: v.boolean(),
    processedCount: v.optional(v.number()),
    totalCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.projectId, {
      syncInProgress: args.inProgress,
      syncProcessedCount: args.processedCount,
      syncTotalCount: args.totalCount,
    });
  },
});

export const listProjectsForScheduledSync = internalQuery({
  args: {},
  handler: async (ctx) => {
    const daily = await ctx.db
      .query('projects')
      .withIndex('by_syncFrequency', (q) => q.eq('syncFrequency', 'daily'))
      .collect();
    const weekly = await ctx.db
      .query('projects')
      .withIndex('by_syncFrequency', (q) => q.eq('syncFrequency', 'weekly'))
      .collect();
    return [...daily, ...weekly];
  },
});
