# Deploy Pulse to Vercel

The project selects Nitro's `vercel` preset when Vercel sets `VERCEL=1`. Lovable preview and publishing retain their existing target. This deploys the complete TanStack Start application, including server functions, rather than only static files.

## Deploy from GitHub

1. Ensure these changes are in your GitHub repository.
2. Open [Vercel New Project](https://vercel.com/new), connect GitHub, and import `MANMOHAN14/fitwise-health` (or the repository you connected to this project).
3. Keep the project root as the root directory. Use **TanStack Start** when offered; otherwise choose **Other**. Set the build command to `bun run build` and install command to `bun install --frozen-lockfile`. Do not set a static `dist` output directory: Nitro generates `.vercel/output` for Vercel.
4. Add the environment variables below before deploying. Enable Vercel's system environment variables so `VERCEL=1` is available at build time.
5. Click **Deploy**. Changing browser variables requires a new deployment because Vite embeds them at build time.

## Existing Lovable Cloud backend

Hosting on Vercel does not copy or migrate accounts, health data, or the database. Keep the existing Lovable Cloud backend and obtain its public connection settings through Lovable's backend settings or your local project configuration. Never commit environment files.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Public backend address for browser requests. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public browser connection key. |
| `SUPABASE_URL` | Publicly reachable address of the same backend for server requests; do not use a sandbox-local address. |
| `SUPABASE_PUBLISHABLE_KEY` | Same public connection key for authenticated server functions. |

These are the variable identifiers used by the code; public connection keys are not privileged database keys. The current health features use the signed-in user's permissions and do not require a service-role key or database password. Those privileged credentials are not available on Lovable Cloud.

## AI and Google sign-in limitations

The existing coach and weekly-plan generator call Lovable's AI Gateway with the managed `LOVABLE_API_KEY`. That key is provisioned for Lovable hosting and is not automatically transferred to Vercel. Do not extract it or put it in GitHub. Until a supported external AI connection is configured, do not treat AI chat or new plan generation as verified on Vercel. An external provider setup is a separate change; existing saved plans remain in the backend.

Add the final Vercel origin to the backend's allowed authentication redirect URLs where available. Google sign-in also uses Lovable's authentication broker; verify that it accepts the external origin before relying on it. Do not disable authentication checks to bypass deployment problems.

## Verify after deployment

- Open the home page and refresh `/auth` directly.
- Sign in with an existing email account and confirm dashboard data reads back.
- Sync the simulated Google Fit data and confirm the dashboard updates.
- Save a goal and reload to confirm it persists.
- Open an existing weekly plan, check a meal or workout, and reload. Checkmarks are stored only on that device and origin, so Lovable checkmarks do not transfer to the Vercel address.
- Verify Google sign-in and AI chat/new plan generation only after the external service configuration is complete.

No Vercel deployment is created merely by adding this configuration. A Vercel account must import the repository and complete deployment. A running Lovable preview is not evidence of a successful Vercel deployment.