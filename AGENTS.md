<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Google Fit data is simulated server-side (`src/lib/simulate.ts` via `syncGoogleFit`) because the real Google Fit API is being retired; keep the sync behind one server function so a real source can replace it.
- AI calls go through `src/lib/ai.server.ts` (Lovable AI Gateway, Responses API), imported dynamically inside authenticated server functions so keys never reach the browser.
- Weekly plans retain their generated markdown and derive checkable day items in presentation code; completion is stored per user and plan on the current device to avoid altering plan generation or database behavior for UI enhancements.
- Select Nitro's Vercel preset only when VERCEL=1, preserving the Lovable configuration wrapper and server entry so external hosting does not change Lovable's preview or publish target.
