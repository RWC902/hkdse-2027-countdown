/**
 * 2027 HKDSE countdown — all targets are 08:30 Asia/Hong_Kong (+08:00).
 */
(function () {
  const EXAM_HOUR = 8;
  const EXAM_MINUTE = 30;
  const STORAGE_KEY = "hkdse2027-focus-id";
  const VERSE_KEY = "hkdse2027-verse-i";

  const TONES = [
    "tone-red", "tone-orange", "tone-amber", "tone-lime", "tone-green",
    "tone-teal", "tone-cyan", "tone-blue", "tone-indigo", "tone-violet",
    "tone-purple", "tone-fuchsia", "tone-pink", "tone-rose",
  ];

  const VERSES = [
    {
      zh: "我靠着那加给我力量的，凡事都能做。",
      en: "I can do all this through him who gives me strength.",
      ref: "腓立比書 4:13 · Philippians 4:13",
    },
    {
      zh: "你不要害怕，因为我与你同在；不要惊惶，因为我是你的神。我必坚固你，我必帮助你。",
      en: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.",
      ref: "以賽亞書 41:10 · Isaiah 41:10",
    },
    {
      zh: "你当刚强壮胆！不要惧怕，也不要惊惶；因为你无论往哪里去，耶和华你的神必与你同在。",
      en: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.",
      ref: "約書亞記 1:9 · Joshua 1:9",
    },
    {
      zh: "神是我们的避难所，是我们的力量，是我们在患难中随时的帮助。",
      en: "God is our refuge and strength, an ever-present help in trouble.",
      ref: "詩篇 46:1 · Psalm 46:1",
    },
    {
      zh: "你要专心仰赖耶和华，不可倚靠自己的聪明，在你一切所行的事上都要认定他，他必指引你的路。",
      en: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
      ref: "箴言 3:5–6 · Proverbs 3:5–6",
    },
    {
      zh: "耶稣看着他们，说：在人这是不能的，在神凡事都能。",
      en: "Jesus looked at them and said, “With man this is impossible, but with God all things are possible.”",
      ref: "馬太福音 19:26 · Matthew 19:26",
    },
    {
      zh: "因为神赐给我们，不是胆怯的心，乃是刚强、仁爱、谨守的心。",
      en: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.",
      ref: "提摩太後書 1:7 · 2 Timothy 1:7",
    },
    {
      zh: "你的话是我脚前的灯，是我路上的光。",
      en: "Your word is a lamp for my feet, a light on my path.",
      ref: "詩篇 119:105 · Psalm 119:105",
    },
    {
      zh: "耶和华说：我知道我向你们所怀的意念是赐平安的意念，不是降灾祸的意念，要叫你们末后有指望。",
      en: "“For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.”",
      ref: "耶利米書 29:11 · Jeremiah 29:11",
    },
    {
      zh: "我们晓得万事都互相效力，叫爱神的人得益处。",
      en: "And we know that in all things God works for the good of those who love him.",
      ref: "羅馬書 8:28 · Romans 8:28",
    },
    {
      zh: "凡劳苦担重担的人可以到我这里来，我就使你们得安息。",
      en: "Come to me, all you who are weary and burdened, and I will give you rest.",
      ref: "馬太福音 11:28 · Matthew 11:28",
    },
    {
      zh: "应当一无挂虑，只要凡事借着祷告、祈求，和感谢，将你们所要的告诉神。",
      en: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
      ref: "腓立比書 4:6 · Philippians 4:6",
    },
  ];

  /** @type {{id:string, zh:string, en:string, date:string, defaultHero?:boolean, tipZh:string, tipEn:string}[]} */
  const SUBJECTS = [
    {
      id: "chi",
      zh: "中國語文（一）及（二）",
      en: "Chinese Language Papers 1 & 2",
      date: "2027-04-08",
      defaultHero: true,
      tipZh: "讀多一篇、寫多一段。語感係練出嚟嘅——你做得到。",
      tipEn: "One more passage, one more paragraph. Language sense grows with practice — you’ve got this.",
    },
    { id: "va", zh: "視覺藝術", en: "Visual Arts", date: "2027-04-06", tipZh: "把構思畫清楚，大膽表達你嘅觀察。", tipEn: "Make your ideas visible. Trust your eye." },
    { id: "chilit", zh: "中國文學", en: "Chinese Literature", date: "2027-04-07", tipZh: "文本要細讀，感受同分析一齊走。", tipEn: "Read closely — feeling and analysis travel together." },
    { id: "eng12", zh: "英國語文（一）及（二）", en: "English Language Papers 1 & 2", date: "2027-04-09", tipZh: "每日讀寫一點，流暢度會慢慢返嚟。", tipEn: "A little reading and writing daily rebuilds fluency." },
    { id: "eng3", zh: "英國語文（三）聆聽及綜合", en: "English Language Paper 3", date: "2027-04-10", tipZh: "練習抓重點同組織答案，冷靜就贏一半。", tipEn: "Practise picking key points. Calm focus wins half the battle." },
    { id: "math", zh: "數學必修部分", en: "Mathematics Compulsory Part", date: "2027-04-12", tipZh: "計錯唔緊要，懂改同懂檢查就係進步。", tipEn: "Errors are fine — fixing and checking is real progress." },
    { id: "csd", zh: "公民與社會發展", en: "Citizenship and Social Development", date: "2027-04-13", tipZh: "用事實同清晰結構表達觀點。", tipEn: "Use facts and a clear structure for your views." },
    { id: "hmsc", zh: "健康管理與社會關懷", en: "Health Management & Social Care", date: "2027-04-14", tipZh: "個案要有同理心同專業分析。", tipEn: "Blend empathy with professional analysis in case work." },
    { id: "chem", zh: "化學", en: "Chemistry", date: "2027-04-15", tipZh: "方程式同概念連起來記，會穩陣好多。", tipEn: "Link equations to concepts — it sticks better." },
    { id: "geo", zh: "地理", en: "Geography", date: "2027-04-16", tipZh: "地圖、數據、解釋：三角齊就強。", tipEn: "Maps, data, explanation — all three make you strong." },
    { id: "ict", zh: "資訊及通訊科技", en: "Information & Communication Technology", date: "2027-04-17", tipZh: "理解原理再寫步驟，debug 會快啲。", tipEn: "Understand the idea, then the steps — debugging gets faster." },
    { id: "bio", zh: "生物", en: "Biology", date: "2027-04-19", tipZh: "用圖同流程記系統，唔好死背。", tipEn: "Use diagrams and processes — don’t only memorise words." },
    { id: "dat", zh: "設計與應用科技", en: "Design & Applied Technology", date: "2027-04-20", tipZh: "設計要解決問題，過程同成品一樣重要。", tipEn: "Design solves problems — process matters as much as product." },
    { id: "phy", zh: "物理", en: "Physics", date: "2027-04-21", tipZh: "公式背後嘅故事搞清楚，應用先唔亂。", tipEn: "Know the story behind each formula before you apply it." },
    { id: "econ", zh: "經濟", en: "Economics", date: "2027-04-22", tipZh: "用圖表同例子解釋，答題會更有力。", tipEn: "Explain with graphs and examples — stronger answers." },
    { id: "m1m2", zh: "數學延伸部分", en: "Mathematics Extended Part", date: "2027-04-23", tipZh: "難題拆細步，一步清就離答案近一步。", tipEn: "Break hard questions into steps — each clear step counts." },
    { id: "chist", zh: "中國歷史", en: "Chinese History", date: "2027-04-24", tipZh: "時間線同因果記清楚，論述有骨幹。", tipEn: "Timeline and cause-effect give your writing a backbone." },
    { id: "bafs", zh: "企業、會計與財務概論", en: "Business, Accounting & Financial Studies", date: "2027-04-26", tipZh: "數字要準，解釋要清楚——兩邊一齊練。", tipEn: "Accurate numbers and clear explanations — practise both." },
    { id: "hist", zh: "歷史", en: "History", date: "2027-04-27", tipZh: "史料要用嚟支持論點，唔係堆砌。", tipEn: "Use sources to support arguments — not as decoration." },
    { id: "ths", zh: "旅遊與款待", en: "Tourism & Hospitality Studies", date: "2027-04-28", tipZh: "設身處地諗旅客同營運，答案更貼地。", tipEn: "Think like both guest and operator — answers feel real." },
    { id: "ers", zh: "倫理與宗教", en: "Ethics & Religious Studies", date: "2027-04-30", tipZh: "立場要清晰，尊重唔同觀點。", tipEn: "Be clear in your stance, and respectful of other views." },
  ];

  const byDate = SUBJECTS.slice().sort((a, b) => a.date.localeCompare(b.date));
  const toneById = Object.fromEntries(byDate.map((s, i) => [s.id, TONES[i % TONES.length]]));

  function targetMs(isoDate) {
    return new Date(
      `${isoDate}T${String(EXAM_HOUR).padStart(2, "0")}:${String(EXAM_MINUTE).padStart(2, "0")}:00+08:00`
    ).getTime();
  }

  function formatDisplayDate(isoDate) {
    const d = new Date(`${isoDate}T12:00:00+08:00`);
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Hong_Kong",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
  }

  function splitRemaining(ms) {
    if (ms <= 0) {
      return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const totalSec = Math.floor(ms / 1000);
    const days = Math.floor(totalSec / 86400);
    const hours = Math.floor((totalSec % 86400) / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    return { done: false, days, hours, minutes, seconds };
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  const heroEl = document.getElementById("hero");
  const listEl = document.getElementById("subject-list");
  const verseTextEl = document.getElementById("verse-text");
  const verseRefEl = document.getElementById("verse-ref");
  const verseNextBtn = document.getElementById("verse-next");
  const verseListEl = document.getElementById("verse-list");

  let focusId =
    localStorage.getItem(STORAGE_KEY) ||
    (SUBJECTS.find((s) => s.defaultHero) || SUBJECTS[0]).id;
  if (!SUBJECTS.some((s) => s.id === focusId)) {
    focusId = (SUBJECTS.find((s) => s.defaultHero) || SUBJECTS[0]).id;
  }

  let verseIndex = Number(localStorage.getItem(VERSE_KEY));
  if (!Number.isFinite(verseIndex) || verseIndex < 0 || verseIndex >= VERSES.length) {
    verseIndex = 0;
  }

  function getFocus() {
    return SUBJECTS.find((s) => s.id === focusId) || SUBJECTS[0];
  }

  function renderVerse() {
    const v = VERSES[verseIndex];
    verseTextEl.innerHTML = `${v.zh}<br /><span style="font-weight:600;opacity:.92">${v.en}</span>`;
    verseRefEl.textContent = v.ref;
    localStorage.setItem(VERSE_KEY, String(verseIndex));
  }

  function renderVerseList() {
    verseListEl.innerHTML = VERSES.map(
      (v) => `<li><strong>${v.ref}</strong><br />${v.zh}<br /><em>${v.en}</em></li>`
    ).join("");
  }

  function renderHero() {
    const focus = getFocus();
    heroEl.innerHTML = `
      <span class="hero-label">Main focus · 主科焦點</span>
      <h2>${focus.zh}</h2>
      <p class="en-name">${focus.en}</p>
      <p class="hero-date">${formatDisplayDate(focus.date)} · 08:30 HKT</p>
      <p class="hero-encourage">${focus.tipZh}<br /><span style="font-weight:500;opacity:.9">${focus.tipEn}</span></p>
      <div class="countdown" id="hero-count"></div>
      <div id="hero-done" hidden class="done-banner">已考 / Exam over — 為下一科繼續加油！You’ve cleared this one. Keep going.</div>
      <p class="hero-hint">撳下面科目可更換主科焦點 · Click a subject card below to change focus</p>
    `;
  }

  function renderList() {
    listEl.innerHTML = byDate
      .map((s) => {
        const tone = toneById[s.id];
        const selected = s.id === focusId;
        return `
      <article class="card ${tone}${selected ? " is-focus" : ""}" data-id="${s.id}" data-date="${s.date}" role="button" tabindex="0" aria-pressed="${selected ? "true" : "false"}">
        <p class="card-pick">${selected ? "✓ 而家係 Main focus · Current focus" : "撳呢度設為 Main focus · Set as Main focus"}</p>
        <h3 class="card-title">${s.zh}</h3>
        <p class="card-en">${s.en}</p>
        <p class="card-date">${formatDisplayDate(s.date)} · 08:30 HKT</p>
        <p class="card-encourage">${s.tipZh}<br /><span style="font-weight:500;opacity:.85">${s.tipEn}</span></p>
        <div class="card-count" id="count-${s.id}"></div>
        <p class="card-over" id="over-${s.id}" hidden>已考 / Exam over — 做得好！Well done.</p>
      </article>`;
      })
      .join("");
  }

  function paintUnits(container, parts, compact) {
    if (!container) return;
    const units = [
      { value: parts.days, label: compact ? "Days" : "Days · 日" },
      { value: parts.hours, label: compact ? "Hrs" : "Hours · 時" },
      { value: parts.minutes, label: compact ? "Min" : "Minutes · 分" },
      { value: parts.seconds, label: compact ? "Sec" : "Seconds · 秒" },
    ];
    if (compact) {
      container.innerHTML = units
        .map(
          (u) => `<div class="mini"><strong>${u.label === "Days" ? u.value : pad(u.value)}</strong><span>${u.label}</span></div>`
        )
        .join("");
    } else {
      container.innerHTML = units
        .map(
          (u) => `
        <div class="unit">
          <span class="value">${u.label.startsWith("Days") ? u.value : pad(u.value)}</span>
          <span class="label">${u.label}</span>
        </div>`
        )
        .join("");
    }
  }

  function tick() {
    const now = Date.now();
    const focus = getFocus();
    const heroParts = splitRemaining(targetMs(focus.date) - now);
    const heroCount = document.getElementById("hero-count");
    const heroDone = document.getElementById("hero-done");
    if (heroParts.done) {
      heroEl.classList.add("done");
      paintUnits(heroCount, heroParts, false);
      if (heroDone) heroDone.hidden = false;
    } else {
      heroEl.classList.remove("done");
      paintUnits(heroCount, heroParts, false);
      if (heroDone) heroDone.hidden = true;
    }

    for (const s of byDate) {
      const parts = splitRemaining(targetMs(s.date) - now);
      const count = document.getElementById(`count-${s.id}`);
      const over = document.getElementById(`over-${s.id}`);
      if (!count || !over) continue;
      if (parts.done) {
        count.hidden = true;
        over.hidden = false;
      } else {
        count.hidden = false;
        over.hidden = true;
        paintUnits(count, parts, true);
      }
    }
  }

  function setFocus(id) {
    if (!SUBJECTS.some((s) => s.id === id)) return;
    focusId = id;
    localStorage.setItem(STORAGE_KEY, id);
    renderHero();
    renderList();
    tick();
    heroEl.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  listEl.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    setFocus(card.dataset.id);
  });

  listEl.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".card");
    if (!card) return;
    e.preventDefault();
    setFocus(card.dataset.id);
  });

  verseNextBtn.addEventListener("click", () => {
    verseIndex = (verseIndex + 1) % VERSES.length;
    renderVerse();
  });

  renderVerse();
  renderVerseList();
  renderHero();
  renderList();
  tick();
  setInterval(tick, 1000);
})();
