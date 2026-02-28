# Autumn

AI-powered changelogs. Add a GitHub repo and get per-commit summaries generated via OpenRouter.

## Tech Stack

- **Backend**: [Convex](https://convex.dev/) (database, serverless functions)
- **Frontend**: [TanStack Start](https://tanstack.com/start) (React, file-based routing)
- **Auth**: [WorkOS AuthKit](https://authkit.com/)
- **AI**: [OpenRouter](https://openrouter.ai/) (model-agnostic)

## Get started

1. Clone and install dependencies:

   ```bash
   pnpm install
   ```

2. Copy environment variables:

   ```bash
   cp .env.local.example .env.local
   ```

3. Configure WorkOS AuthKit:
   - Create a [WorkOS account](https://workos.com/)
   - Get your Client ID and API Key from the WorkOS dashboard
   - Add `http://localhost:3000/callback` as a redirect URI
   - Generate a secure password for cookie encryption (min 32 characters)
   - Update `.env.local`

4. Configure Convex:

   ```bash
   npx convex dev
   ```

   Then set WorkOS Client ID in Convex:

   ```bash
   npx convex env set WORKOS_CLIENT_ID <your_client_id>
   ```

5. Configure OpenRouter (for AI changelog summaries):

   ```bash
   npx convex env set OPENROUTER_API_KEY sk-or-v1-your_key_here
   ```

   Optional: set a specific model (default: `openai/gpt-4o-mini`):

   ```bash
   npx convex env set OPENROUTER_MODEL openai/gpt-4o-mini
   ```

6. Run the dev server:

   ```bash
   pnpm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## How it works

- **Add repo**: Sign in, then add a GitHub repo (owner, repo, branch). Last 100 commits are synced.
- **Per-commit summaries**: Each commit gets an AI-generated changelog summary via OpenRouter.
- **Sync-on-visit**: Visiting a project triggers a sync if it hasn't been synced today.
