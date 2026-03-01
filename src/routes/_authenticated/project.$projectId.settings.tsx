import { Link, createFileRoute } from '@tanstack/react-router';
import { convexQuery } from '@convex-dev/react-query';
import { useSuspenseQuery } from '@tanstack/react-query';
import { api } from '../../../convex/_generated/api';
import { useMutation } from 'convex/react';
import { useEffect, useState } from 'react';
import type { Doc, Id } from '../../../convex/_generated/dataModel';

export const Route = createFileRoute('/_authenticated/project/$projectId/settings')({
  component: ProjectSettings,
});

const SYNC_FREQUENCIES = [
  { value: 'on_visit', label: 'On visit only' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
] as const;

function ProjectSettings() {
  const { projectId } = Route.useParams();
  const updateSettings = useMutation(api.projects.updateProjectSettings);

  const { data: project } = useSuspenseQuery(
    convexQuery(api.projects.getProject, { projectId: projectId as Id<'projects'> }),
  ) as { data: Doc<'projects'> | null };

  const [displayName, setDisplayName] = useState(project?.displayName ?? '');
  const [isPublic, setIsPublic] = useState(project?.isPublic ?? false);
  const [syncFrequency, setSyncFrequency] = useState<
    'on_visit' | 'daily' | 'weekly'
  >(project?.syncFrequency ?? 'daily');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!project) return;
    setDisplayName(project.displayName);
    setIsPublic(project.isPublic ?? false);
    setSyncFrequency(project.syncFrequency ?? 'daily');
  }, [project]);

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

  const handleSave = async (opts?: { clearApiKey?: boolean }) => {
    setSaving(true);
    try {
      await updateSettings({
        projectId: project._id,
        displayName: displayName.trim() || project.repo,
        isPublic,
        syncFrequency,
        ...(opts?.clearApiKey
          ? { openRouterApiKey: null }
          : apiKeyInput !== ''
            ? { openRouterApiKey: apiKeyInput }
            : {}),
      });
      if (opts?.clearApiKey || apiKeyInput !== '') setApiKeyInput('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-8 p-8">
      <div className="flex items-center gap-4">
        <Link
          to="/project/$projectId"
          params={{ projectId }}
          className="text-slate-600 hover:underline dark:text-slate-400"
        >
          ← Back to project
        </Link>
      </div>

      <h1 className="text-2xl font-bold">Project settings</h1>
      <p className="text-slate-600 dark:text-slate-400">
        {project.owner}/{project.repo} ({project.branch})
      </p>

      <section className="space-y-6 rounded-lg border border-slate-200 p-6 dark:border-slate-700">
        <div>
          <label htmlFor="displayName" className="mb-1 block text-sm font-medium">
            Display name
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            onBlur={() => void handleSave()}
            className="w-full rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-600"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            id="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => {
              setIsPublic(e.target.checked);
              void updateSettings({
                projectId: project._id,
                isPublic: e.target.checked,
              });
            }}
            className="h-4 w-4 rounded border-slate-300"
          />
          <label htmlFor="isPublic" className="text-sm font-medium">
            Make project public (read-only changelog without login)
          </label>
        </div>
        {isPublic && (
          <p className="text-xs text-slate-500">
            Anyone with the link can view the changelog at /p/{projectId}.
          </p>
        )}

        <div>
          <label htmlFor="syncFrequency" className="mb-1 block text-sm font-medium">
            Sync frequency
          </label>
          <select
            id="syncFrequency"
            value={syncFrequency}
            onChange={(e) => {
              const v = e.target.value as 'on_visit' | 'daily' | 'weekly';
              setSyncFrequency(v);
              void updateSettings({ projectId: project._id, syncFrequency: v });
            }}
            className="w-full rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-600"
          >
            {SYNC_FREQUENCIES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-500">
            On visit: sync when you open the project. Daily/weekly: also synced by a scheduled job.
          </p>
        </div>

        <div>
          <label htmlFor="openRouterKey" className="mb-1 block text-sm font-medium">
            OpenRouter API key (optional)
          </label>
          <input
            id="openRouterKey"
            type="password"
            placeholder="Leave blank to use global key"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            onBlur={() => { if (apiKeyInput !== '') void handleSave(); }}
            className="w-full rounded border border-slate-300 bg-transparent px-3 py-2 dark:border-slate-600"
          />
          <p className="mt-1 text-xs text-slate-500">
            When set, this project uses its own key for AI summaries instead of the global one.
          </p>
          <button
            type="button"
            onClick={() => void handleSave({ clearApiKey: true })}
            disabled={saving}
            className="mt-2 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-400"
          >
            Clear project key
          </button>
        </div>

        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </section>
    </div>
  );
}
