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

## Architecture

- Keep the portfolio as one semantic page with anchored sections because smooth narrative scrolling is a core content requirement.
- Keep the requested department exploration at `/itm` with its curriculum in a browser-safe data module, so the portfolio remains a single narrative page while department details are independently shareable and searchable.
- Restrict blog storage SELECT to the authenticated admin uploader; publish attachment signed URLs with posts so public reading does not grant bucket listing or unrestricted URL creation.
