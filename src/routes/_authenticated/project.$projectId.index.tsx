import { Link, createFileRoute } from '@tanstack/react-router';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../../../convex/_generated/api';
import { useAction } from 'convex/react';
import { useEffect } from 'react';
import type { Doc, Id } from '../../../convex/_generated/dataModel';

export const Route = createFileRoute('/_authenticated/project/$projectId/')({
  component: ProjectChangelog,
});

function ProjectChangelog() {
  const { projectId } = Route.useParams();
  const triggerSync = useAction(api.sync.triggerSyncIfNeeded);

  const { data: project } = useSuspenseQuery(
    convexQuery(api.projects.getProject, { projectId: projectId as Id<'projects'> }),
  ) as { data: Doc<'projects'> | null };
  const { data: commits } = useSuspenseQuery(
    convexQuery(api.projects.listCommits, { projectId: projectId as Id<'projects'> }),
  ) as { data: Doc<'commits'>[] };

  useEffect(() => {
    void triggerSync({ projectId: projectId as Id<'projects'> });
  }, [projectId, triggerSync]);

  if (!project) {
    return (
      <div className="p-8">
        <p>Project not found.</p>
        <Link to="/" className="underline">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">Changelog</h2>
      {project.syncInProgress && (
        <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <p className="font-medium text-amber-800 dark:text-amber-200">Syncing commits…</p>
          <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
            {project.syncProcessedCount ?? 0} of {project.syncTotalCount ?? 100} processed
            {project.syncTotalCount != null &&
              ` (${(project.syncTotalCount ?? 0) - (project.syncProcessedCount ?? 0)} remaining)`}
          </p>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
            Syncing up to 100 commits. This will finish soon.
          </p>
        </div>
      )}
      {commits.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">
          {project.syncInProgress ? 'Processing first commits…' : 'No commits yet. Visit again to trigger a sync.'}
        </p>
      ) : (
        <ul className="space-y-6">
          {commits.map((c) => (
            <li key={c._id} className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
                <a
                  href={`https://github.com/${project.owner}/${project.repo}/commit/${c.sha}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono hover:underline"
                >
                  {c.sha.slice(0, 7)}
                </a>
                <span>{c.authorLogin}</span>
                <span>{new Date(c.committedAt).toLocaleDateString()}</span>
              </div>
              <p className="font-medium text-foreground">{c.summary}</p>
              {c.message !== c.summary && (
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{c.message}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
