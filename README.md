# 2027 HKDSE Exam Countdown

Light, sunny, Pixar-style 3D bilingual countdown for the **2027 HKDSE**.

- **Hero:** 中國語文 / Chinese Language — **8 April 2027, 08:30 HKT**
- Other confirmed subjects listed below; Note 2 subjects are hidden.

## Google Sites embed (correct way)

Google Sites **cannot** run a full pasted HTML/JS page (scripts are blocked).  
You must embed the **hosted public URL** with an iframe.

1. Publish this site (GitHub Pages URL below, once enabled).
2. In Google Sites: **Insert → Embed → Embed code**
3. Paste:

```html
<iframe
  src="https://rwc902.github.io/hkdse-2027-countdown/"
  title="2027 HKDSE Countdown"
  style="width:100%;height:900px;border:0;border-radius:16px;overflow:hidden;"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  allowfullscreen>
</iframe>
```

4. Resize the embed block taller if the subject list is cut off.

### Alternative: Embed by URL
Insert → Embed → **By URL** → paste  
`https://rwc902.github.io/hkdse-2027-countdown/`

## Local preview
```bash
python3 -m http.server 3456
```
Open `http://127.0.0.1:3456`

## Timezone
All targets are **08:30 Asia/Hong_Kong** (`+08:00`).
