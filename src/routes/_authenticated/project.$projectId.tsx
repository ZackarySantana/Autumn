import { Link, Outlet, createFileRoute } from '@tanstack/react-router';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../../../convex/_generated/api';
import type { Id } from '../../../convex/_generated/dataModel';

export const Route = createFileRoute('/_authenticated/project/$projectId')({
  component: ProjectLayout,
});

function ProjectLayout() {
  const { projectId } = Route.useParams();
  const { data: project } = useSuspenseQuery(
    convexQuery(api.projects.getProject, { projectId: projectId as Id<'projects'> }),
  );

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
        <nav className="mt-4 flex gap-4 border-b border-slate-200 dark:border-slate-700">
          <Link
            to="/project/$projectId"
            params={{ projectId }}
            className="border-b-2 border-transparent px-1 py-2 text-sm font-medium text-slate-600 hover:text-foreground dark:text-slate-400 [&.active]:border-foreground [&.active]:text-foreground"
            activeProps={{ className: 'border-foreground text-foreground' }}
          >
            Changelog
          </Link>
          <Link
            to="/project/$projectId/settings"
            params={{ projectId }}
            className="border-b-2 border-transparent px-1 py-2 text-sm font-medium text-slate-600 hover:text-foreground dark:text-slate-400 [&.active]:border-foreground [&.active]:text-foreground"
            activeProps={{ className: 'border-foreground text-foreground' }}
          >
            Settings
          </Link>
        </nav>
      </header>

      <Outlet />
    </div>
  );
}
