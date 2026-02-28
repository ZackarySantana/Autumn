import { Link, createFileRoute } from '@tanstack/react-router';
import { Authenticated, Unauthenticated } from 'convex/react';
import { getAuth, getSignInUrl, getSignUpUrl } from '@workos/authkit-tanstack-react-start';
import { useAuth } from '@workos/authkit-tanstack-react-start/client';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import type { Doc } from '../../convex/_generated/dataModel';
import { useState } from 'react';

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    const { user } = await getAuth();
    const signInUrl = await getSignInUrl();
    const signUpUrl = await getSignUpUrl();

    return { user, signInUrl, signUpUrl };
  },
});

function Home() {
  const { user, signInUrl, signUpUrl } = Route.useLoaderData();
  return <HomeContent user={user} signInUrl={signInUrl} signUpUrl={signUpUrl} />;
}

function HomeContent({
  user,
  signInUrl,
  signUpUrl,
}: {
  user: { id: string; email?: string } | null;
  signInUrl: string;
  signUpUrl: string;
}) {
  return (
    <>
      <header className="sticky top-0 z-10 flex flex-row items-center justify-between border-b-2 border-slate-200 bg-background p-4 dark:border-slate-800">
        Autumn
        {user && <UserMenu />}
      </header>
      <main className="flex flex-col gap-8 p-8">
        <h1 className="text-center text-4xl font-bold">Autumn</h1>
        <p className="mx-auto max-w-xl text-center text-slate-600 dark:text-slate-400">
          AI-powered changelogs. Add a GitHub repo and get per-commit summaries.
        </p>
        <Authenticated>
          <ProjectsSection />
        </Authenticated>
        <Unauthenticated>
          <SignInForm signInUrl={signInUrl} signUpUrl={signUpUrl} />
        </Unauthenticated>
      </main>
    </>
  );
}

function ProjectsSection() {
  const { data: projectsWithLatest } = useSuspenseQuery(
    convexQuery(api.projects.listProjectsWithLatestCommits, {}),
  ) as {
    data: Array<Doc<'projects'> & { latestCommits: Doc<'commits'>[] }>;
  };
  const createProject = useMutation(api.projects.createProject);
  const [displayName, setDisplayName] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [branch, setBranch] = useState('main');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await createProject({
        displayName: displayName || repo,
        owner: owner.trim(),
        repo: repo.trim(),
        branch: branch.trim() || 'main',
      });
      setDisplayName('');
      setOwner('');
      setRepo('');
      setBranch('main');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add repo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <section>
        <h2 className="mb-4 text-lg font-semibold">Add a repo</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-sm">Display name (optional)</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="My Project"
              className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Owner</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="facebook"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Repo</label>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="react"
              required
              className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm">Branch</label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              placeholder="main"
              className="w-full rounded-md border border-slate-300 px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-foreground px-4 py-2 text-background disabled:opacity-50"
          >
            {isSubmitting ? 'Adding…' : 'Add repo'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Your projects</h2>
        {projectsWithLatest.length === 0 ? (
          <p className="text-slate-600 dark:text-slate-400">No projects yet. Add a repo above.</p>
        ) : (
          <ul className="space-y-4">
            {projectsWithLatest.map((p) => (
              <li key={p._id}>
                <Link
                  to="/project/$projectId"
                  params={{ projectId: p._id }}
                  className="block rounded-md border border-slate-200 p-4 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="font-medium">{p.displayName}</span>
                    <span className="text-sm text-slate-500">
                      {p.owner}/{p.repo} ({p.branch})
                    </span>
                  </div>
                  {p.latestCommits.length > 0 ? (
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-slate-500">Latest changes:</p>
                      {p.latestCommits.map((c) => (
                        <p key={c._id} className="text-sm text-slate-600 dark:text-slate-400">
                          {c.summary}
                        </p>
                      ))}
                    </div>
                  ) : p.syncInProgress ? (
                    <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">
                      Syncing… {p.syncProcessedCount ?? 0}/{p.syncTotalCount ?? 100}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">Click to sync and view changelog</p>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function SignInForm({ signInUrl, signUpUrl }: { signInUrl: string; signUpUrl: string }) {
  return (
    <div className="mx-auto flex w-96 flex-col gap-8">
      <p>Sign in to add repos and generate changelogs</p>
      <div className="flex gap-4">
        <a href={signInUrl}>
          <button className="rounded-md bg-foreground px-4 py-2 text-background">Sign in</button>
        </a>
        <a href={signUpUrl}>
          <button className="rounded-md bg-foreground px-4 py-2 text-background">Sign up</button>
        </a>
      </div>
    </div>
  );
}

function UserMenu() {
  const { user, signOut } = useAuth();

  return (
    <div className="flex items-center gap-2">
      {user?.email && <span className="text-sm">{user.email}</span>}
      <button onClick={() => signOut()} className="rounded-md bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">
        Sign out
      </button>
    </div>
  );
}
