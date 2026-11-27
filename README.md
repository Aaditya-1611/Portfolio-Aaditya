# Aaditya Pasi – 3D Portfolio

An interactive 3D portfolio: a three.js core with orbiting skills, a background video that plays as you scroll, project demos, an "Ask about me" bot, a terminal and more.

## Project structure

```
aaditya-3d-portfolio/
├── index.html            page content (edit your text here)
├── css/style.css         all styles (colours are CSS variables at the top)
├── js/main.js            3D scene, demos, chat bot, terminal, effects
├── js/scroll-video.js    scroll-controlled background video
├── assets/
│   ├── bg-scrub.mp4      background video (every frame is a keyframe, so scrubbing is smooth)
│   └── poster.jpg        first frame shown while the video loads
└── .vscode/              recommended extensions and settings
```

## 1. Install

- **VS Code:** https://code.visualstudio.com
- **Node.js (optional, only for the `npx` option):** https://nodejs.org
- An **internet connection** is needed when you view the page, because three.js and the Google Fonts load from a CDN.

## 2. Extensions

When you open the folder, VS Code offers to install the recommended extensions. Or install them from the terminal:

```bash
code --install-extension ritwickdey.LiveServer
code --install-extension esbenp.prettier-vscode
code --install-extension ecmel.vscode-html-css
code --install-extension formulahendry.auto-rename-tag
```

| Extension | ID | Why |
|---|---|---|
| Live Server | `ritwickdey.LiveServer` | runs the site locally and reloads on save |
| Prettier | `esbenp.prettier-vscode` | formats your code |
| HTML CSS Support | `ecmel.vscode-html-css` | CSS class suggestions in HTML |
| Auto Rename Tag | `formulahendry.auto-rename-tag` | renames matching HTML tags together |

## 3. Run it

1. Unzip the folder.
2. Open a terminal in it and run:
   ```bash
   cd aaditya-3d-portfolio
   code .
   ```
3. In VS Code, right-click `index.html` and choose **Open with Live Server** (or click **Go Live** in the bottom-right status bar).
4. Your browser opens `http://127.0.0.1:5500`. Scroll to play the video.

**Without Live Server** (pick one, then open the address it prints):

```bash
npx serve .
# or
python -m http.server 8000      # then open http://localhost:8000
```

Please use a local server. Opening `index.html` by double-clicking can stop the video from scrubbing in some browsers.

## 4. Customise

- **Text, links, email, phone:** `index.html`
- **Colours:** the `:root` block at the top of `css/style.css` (`--c` is the cyan, `--m` the purple)
- **Orbiting skill labels:** the `skills` array in `js/main.js`
- **Ask-me answers and terminal text:** the `KB` array in `js/main.js`
- **GitHub buttons:** in `index.html`, search for `View on GitHub` and replace each profile link with the repository link
- **Background video:** replace `assets/bg-scrub.mp4`. For smooth scrubbing, encode it with every frame as a keyframe:
  ```bash
  ffmpeg -i input.mp4 -an -vf "scale=1280:-2,format=yuv420p" -c:v libx264 -g 1 -crf 30 -movflags +faststart assets/bg-scrub.mp4
  ffmpeg -i assets/bg-scrub.mp4 -frames:v 1 assets/poster.jpg
  ```

## 5. Secret features

- Konami code (↑ ↑ ↓ ↓ ← → ← → B A) or tap your name 5 times: rainbow mode
- Backtick key (`) opens the terminal; try `help`
- Click to burst particles, hold the mouse for hyperdrive

## 6. Host it for free (GitHub Pages)

```bash
git init
git add .
git commit -m "Portfolio"
git branch -M main
git remote add origin https://github.com/Aaditya-1611/Aaditya-1611.github.io.git
git push -u origin main
```

Create the repository `Aaditya-1611.github.io` on GitHub first. Then go to **Settings → Pages**, choose the `main` branch and save. The site goes live at `https://aaditya-1611.github.io`. You can also drag the whole folder onto https://app.netlify.com/drop.

## Notes

- The AutoFixer and Latrova demos are simulations, not the real models.
- The "Ask about me" bot is keyword matching over the CV, not an AI model.
