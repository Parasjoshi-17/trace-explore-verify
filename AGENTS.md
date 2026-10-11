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

## Architecture rules
- All data is mock data in `src/lib/mock-data.ts`, shared state in `src/lib/store.tsx` (React context) — keeps a single seam to swap in the future FastAPI/MySQL backend.
- No Supabase/Firebase/SQLite — user's spec targets a Python FastAPI + MySQL backend later.
- App shell (sidebar + top bar) lives in `src/components/app-shell.tsx`, mounted once in `__root.tsx`.
