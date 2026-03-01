import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();
crons.interval(
  'sync daily and weekly projects',
  { hours: 24 },
  internal.sync.runScheduledSyncs,
  {},
);

export default crons;
