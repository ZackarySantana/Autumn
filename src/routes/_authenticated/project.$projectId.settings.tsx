import { Link, createFileRoute } from '@tanstack/react-router';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../../../convex/_generated/api';
import { useMutation } from 'convex/react';
import { useEffect, useState } from 'react';
import type { Id } from '../../../convex/_generated/dataModel';

export const Route = createFileRoute('/_authenticated/project/$projectId/settings')({
  component: ProjectSettings,
});

const SYNC_FREQUENCIES = [
  { value: 'on_visit' as const, label: 'On visit only' },
  { value: 'daily' as const, label: 'Daily' },
  { value: 'weekly' as const, label: 'Weekly' },
] as const;

function ProjectSettings() {
  const { projectId } = Route.useParams();
  const updateSettings = useMutation(api.projects.updateProjectSettings);

  const { data: project } = useSuspenseQuery(
    convexQuery(api.projects.getProject, { projectId: projectId as Id<'projects'> }),
  );

  const [displayName, setDisplayName] = useState(project?.displayName ?? '');
  const [isPublic, setIsPublic] = useState(project?.isPublic ?? false);
  const [syncFrequency, setSyncFrequency] = useState<(typeof SYNC_FREQUENCIES)[number]['value']>(
    (project?.syncFrequency as (typeof SYNC_FREQUENCIES)[number]['value']) ?? 'on_visit',
  );
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (project) {
      setDisplayName(project.displayName);
      setIsPublic(project.isPublic ?? false);
      setSyncFrequency((project.syncFrequency as (typeof SYNC_FREQUENCIES)[number]['value']) ?? 'on_visit');
    }
  }, [project]);

  if (!project) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        projectId: project._id,
        displayName: displayName.trim() || project.repo,
        isPublic,
        syncFrequency,
        openRouterApiKey: apiKey || undefined,
      });
      if (apiKey) setApiKey('');
    } finally {
      setSaving(false);
    }
  };

  const handleClearApiKey = async () => {
    setSaving(true);
    try {
      await updateSettings({
        projectId: project._id,
        openRouterApiKey: null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <h2 className="mb-6 text-lg font-semibold">Settings</h2>

      <div className="space-y-6">
        <div>
          <label htmlFor="displayName" className="mb-1 block text-sm font-medium">
            Display name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full max-w-md rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300"
          />
          <label htmlFor="isPublic" className="text-sm font-medium">
            Make project public
          </label>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          When enabled, anyone can view the changelog at the public URL without signing in.
        </p>
        {isPublic && (
          <p className="mt-1 text-sm">
            <Link
              to="/project/$projectId/public"
              params={{ projectId }}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline hover:text-blue-500 dark:text-blue-400"
            >
              View public changelog →
            </Link>
          </p>
        )}

        <div>
          <label htmlFor="syncFrequency" className="mb-1 block text-sm font-medium">
            Sync frequency
          </label>
          <select
            id="syncFrequency"
            value={syncFrequency}
            onChange={(e) => setSyncFrequency(e.target.value as (typeof SYNC_FREQUENCIES)[number]['value'])}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
          >
            {SYNC_FREQUENCIES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            How often to sync commits from GitHub. Daily and weekly syncs run automatically via cron.
          </p>
        </div>

        <div>
          <label htmlFor="apiKey" className="mb-1 block text-sm font-medium">
            OpenRouter API key (optional)
          </label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Leave empty to use global key"
            className="w-full max-w-md rounded-md border border-slate-300 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800"
          />
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Use a project-specific OpenRouter key for sync. When empty, the global env key is used.
          </p>
          <button
            type="button"
            onClick={handleClearApiKey}
            disabled={saving}
            className="mt-2 text-sm text-red-600 hover:underline disabled:opacity-50 dark:text-red-400"
          >
            Clear stored API key
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          {saving ? 'Saving…' : 'Save settings'}
        </button>
      </div>
    </section>
  );
}
