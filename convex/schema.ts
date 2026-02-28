import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  projects: defineTable({
    displayName: v.string(),
    owner: v.string(),
    repo: v.string(),
    branch: v.string(),
    userId: v.string(),
    lastSyncedAt: v.optional(v.number()),
    syncInProgress: v.optional(v.boolean()),
    syncProcessedCount: v.optional(v.number()),
    syncTotalCount: v.optional(v.number()),
    isPublic: v.optional(v.boolean()),
    syncFrequency: v.optional(v.union(v.literal('on_visit'), v.literal('daily'), v.literal('weekly'))),
    openRouterApiKey: v.optional(v.string()),
  })
    .index('by_userId', ['userId'])
    .index('by_owner_repo_branch', ['owner', 'repo', 'branch']),

  commits: defineTable({
    projectId: v.id('projects'),
    sha: v.string(),
    message: v.string(),
    authorLogin: v.string(),
    committedAt: v.number(),
    summary: v.string(),
  })
    .index('by_projectId', ['projectId'])
    .index('by_projectId_sha', ['projectId', 'sha'])
    .index('by_projectId_committedAt', ['projectId', 'committedAt']),
});
