# 2027 HKDSE Exam Countdown

Static bilingual (中文 / English) countdown page for the **2027 Hong Kong Diploma of Secondary Education** written exams.

- **Hero subject:** 中國語文 / Chinese Language — **8 April 2027, 08:30 HKT**
- Other subjects with confirmed dates from the official timetable are listed below the hero.
- Subjects without a confirmed single date (Note 2: Literature in English, Technology & Living, PE, Music, etc.) are hidden.

## Preview in a browser

### Option A — open the file
1. Download or open this folder.
2. Double-click `index.html` (or right-click → Open with your browser).

### Option B — local server (recommended)
In this folder, run:

```bash
npx --yes serve .
```

Then open the URL it prints (usually `http://localhost:3000`).

### Option C — in Cursor
1. Open this repository in Cursor.
2. Open `index.html`.
3. Use **Simple Browser** / preview: Command Palette → “Simple Browser: Show” → paste `http://localhost:3000` after starting Option B,  
   **or** right-click `index.html` → **Open with Live Preview** if that extension is installed.

> Looking at the HTML source alone is not a preview. You need to open the page in a browser (or Simple Browser) so JavaScript can run the ticking countdown.

## Deploy later
This is a static site (`index.html` + `styles.css` + `app.js`). Any static host (GitHub Pages, Netlify, school server, etc.) works. Deployment is left for a follow-up.

## Timezone
Countdowns target **08:30 Asia/Hong_Kong** on each exam date (`+08:00`), independent of the viewer’s device timezone.
