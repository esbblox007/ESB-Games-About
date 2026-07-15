# ESB Games home page update

This version replaces the home page with a fully coded recreation of the supplied design screenshots.

## Files changed

- `app/page.tsx`
- `app/globals.css`
- `components/Footer.tsx`
- `package.json` (Next.js updated to `15.2.6`)

The project intentionally does not include `package-lock.json`, because the previous lock file contained an inaccessible internal package registry URL.

## Uploading through GitHub

1. Extract `esb-games-homepage-update.zip`.
2. Open your `ESB-Games-About` repository.
3. Choose **Add file → Upload files**.
4. Drag the `app` and `components` folders and `package.json` into the upload area.
5. Allow GitHub to replace the existing files.
6. Commit directly to `main` with the message `Rebuild ESB Games home page`.
7. Vercel should deploy the new commit automatically.

The page is responsive and all buttons link to coded routes rather than screenshots.
