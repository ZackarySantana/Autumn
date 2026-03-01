import { Link, createFileRoute } from '@tanstack/react-router';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../../convex/_generated/api';
import type { Id } from '../../convex/_generated/dataModel';

export const Route = createFileRoute('/project/$projectId/public')({
  component: PublicChangelog,
});

function PublicChangelog() {
  const { projectId } = Route.useParams();

  const { data: project } = useSuspenseQuery(
    convexQuery(api.projects.getProjectPublic, { projectId: projectId as Id<'projects'> }),
  );
  const { data: commits } = useSuspenseQuery(
    convexQuery(api.projects.listCommitsPublic, { projectId: projectId as Id<'projects'> }),
  );

  if (!project) {
    return (
      <div className="mx-auto max-w-3xl p-8">
        <p className="text-slate-600 dark:text-slate-400">Project not found or not public.</p>
        <Link to="/" className="mt-4 inline-block text-slate-600 underline hover:text-foreground dark:text-slate-400">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-8">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-slate-600 hover:underline dark:text-slate-400">
          ← Home
        </Link>
      </div>

      <header>
        <h1 className="text-2xl font-bold">{project.displayName}</h1>
        <p className="text-slate-600 dark:text-slate-400">
          {project.owner}/{project.repo} ({project.branch})
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">Public changelog (read-only)</p>
      </header>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Changelog</h2>
        {commits.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">No commits yet.</p>
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
    </div>
  );
}
