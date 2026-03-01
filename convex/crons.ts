import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.daily(
  'sync daily and weekly projects',
  { hourUTC: 6, minuteUTC: 0 },
  internal.sync.runScheduledSync,
  {},
);

export default crons;
