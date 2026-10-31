# Jeenama · 37 years, 37 memories

A complete mobile birthday website with personal photos, sketches, background music, floating elements, a welcome screen and the candle countdown.

## Publish on GitHub Pages

1. Extract this ZIP on your computer.
2. Create a GitHub repository or open the repository you want to use.
3. Upload the extracted contents, including the `assets` folder, keeping the folder structure. `index.html` should appear directly at the repository's top level.
4. Commit the uploaded files to your `main` branch.
5. Open the repository's **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select **main** and **/(root)**, then **Save**.
8. Wait for GitHub to finish deployment, then open the website link displayed on the Pages settings screen.

Official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

No installation, build command, API keys, or server are required. All website paths are relative, so the website works under a GitHub repository URL.

## Files

- `index.html`: homepage and birthday finale
- `memory-content.js`: all 37 personal titles, messages and photo captions
- `app.js`: memory order, music, photo viewer, welcome screen and countdown
- `journey-transition.js`: fixed hero and photo transition into the first memory
- `motion-story.js`: floating and entrance animations
- `style.css`, `motion-story.css`, `rose.css`: layout and styling
- `assets/`: photographs, sketches, generated cake and raspberry, the MP3, and the bundled Motion library and license
- `.nojekyll`: tells GitHub Pages to serve the static files directly

The music begins when **Start journey** is tapped. The music control lets the visitor pause or resume it. Display fonts load from Google Fonts; fallback fonts are included in the CSS.

To change a memory, edit its number in `memory-content.js`. Keep the `assets` folder beside `index.html` when moving the website.
