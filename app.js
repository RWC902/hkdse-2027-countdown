/**
 * 2027 HKDSE countdown — all targets are 08:30 Asia/Hong_Kong (+08:00).
 * Performance: build DOM once; each second only updates number text (no innerHTML thrash).
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
  const subjectById = Object.fromEntries(SUBJECTS.map((s) => [s.id, s]));

  function targetMs(isoDate) {
    return new Date(
      `${isoDate}T${String(EXAM_HOUR).padStart(2, "0")}:${String(EXAM_MINUTE).padStart(2, "0")}:00+08:00`
    ).getTime();
  }

  // Precompute timestamps once
  const targetById = Object.fromEntries(SUBJECTS.map((s) => [s.id, targetMs(s.date)]));

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
    const totalSec = (ms / 1000) | 0;
    const days = (totalSec / 86400) | 0;
    const hours = ((totalSec % 86400) / 3600) | 0;
    const minutes = ((totalSec % 3600) / 60) | 0;
    const seconds = totalSec % 60;
    return { done: false, days, hours, minutes, seconds };
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
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
  if (!subjectById[focusId]) {
    focusId = (SUBJECTS.find((s) => s.defaultHero) || SUBJECTS[0]).id;
  }

  let verseIndex = Number(localStorage.getItem(VERSE_KEY));
  if (!Number.isFinite(verseIndex) || verseIndex < 0 || verseIndex >= VERSES.length) {
    verseIndex = 0;
  }

  /** @type {{days:HTMLElement,hours:HTMLElement,minutes:HTMLElement,seconds:HTMLElement}|null} */
  let heroVals = null;
  /** @type {HTMLElement|null} */
  let heroDoneEl = null;
  /** @type {Record<string,{days:HTMLElement,hours:HTMLElement,minutes:HTMLElement,seconds:HTMLElement,count:HTMLElement,over:HTMLElement,card:HTMLElement}>} */
  const cardRefs = {};

  function getFocus() {
    return subjectById[focusId];
  }

  function renderVerse() {
    const v = VERSES[verseIndex];
    verseTextEl.textContent = "";
    verseTextEl.appendChild(document.createTextNode(v.zh));
    verseTextEl.appendChild(document.createElement("br"));
    const en = document.createElement("span");
    en.style.fontWeight = "600";
    en.style.opacity = "0.92";
    en.textContent = v.en;
    verseTextEl.appendChild(en);
    verseRefEl.textContent = v.ref;
    localStorage.setItem(VERSE_KEY, String(verseIndex));
  }

  function renderVerseList() {
    const frag = document.createDocumentFragment();
    for (const v of VERSES) {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${v.ref}</strong><br />${v.zh}<br /><em>${v.en}</em>`;
      frag.appendChild(li);
    }
    verseListEl.replaceChildren(frag);
  }

  function buildUnitRow(compact) {
    const labels = compact
      ? ["Days", "Hrs", "Min", "Sec"]
      : ["Days · 日", "Hours · 時", "Minutes · 分", "Seconds · 秒"];
    const wrap = document.createElement("div");
    wrap.className = compact ? "card-count" : "countdown";
    const refs = {};
    const keys = ["days", "hours", "minutes", "seconds"];
    for (let i = 0; i < 4; i++) {
      const box = document.createElement("div");
      box.className = compact ? "mini" : "unit";
      const strong = document.createElement(compact ? "strong" : "span");
      if (!compact) strong.className = "value";
      strong.textContent = "0";
      const lab = document.createElement("span");
      if (!compact) lab.className = "label";
      lab.textContent = labels[i];
      box.appendChild(strong);
      box.appendChild(lab);
      wrap.appendChild(box);
      refs[keys[i]] = strong;
    }
    return { wrap, refs };
  }

  function renderHero() {
    const focus = getFocus();
    heroEl.replaceChildren();

    const label = document.createElement("span");
    label.className = "hero-label";
    label.textContent = "Main focus · 主科焦點";

    const h2 = document.createElement("h2");
    h2.textContent = focus.zh;

    const en = document.createElement("p");
    en.className = "en-name";
    en.textContent = focus.en;

    const date = document.createElement("p");
    date.className = "hero-date";
    date.textContent = `${formatDisplayDate(focus.date)} · 08:30 HKT`;

    const tip = document.createElement("p");
    tip.className = "hero-encourage";
    tip.appendChild(document.createTextNode(focus.tipZh));
    tip.appendChild(document.createElement("br"));
    const tipEn = document.createElement("span");
    tipEn.style.fontWeight = "500";
    tipEn.style.opacity = "0.9";
    tipEn.textContent = focus.tipEn;
    tip.appendChild(tipEn);

    const units = buildUnitRow(false);
    units.wrap.id = "hero-count";
    heroVals = units.refs;

    heroDoneEl = document.createElement("div");
    heroDoneEl.id = "hero-done";
    heroDoneEl.className = "done-banner";
    heroDoneEl.hidden = true;
    heroDoneEl.textContent =
      "已考 / Exam over — 為下一科繼續加油！You’ve cleared this one. Keep going.";

    const hint = document.createElement("p");
    hint.className = "hero-hint";
    hint.textContent =
      "撳下面科目可更換主科焦點 · Click a subject card below to change focus";

    heroEl.append(label, h2, en, date, tip, units.wrap, heroDoneEl, hint);
  }

  function renderList() {
    listEl.replaceChildren();
    Object.keys(cardRefs).forEach((k) => delete cardRefs[k]);

    const frag = document.createDocumentFragment();
    for (const s of byDate) {
      const tone = toneById[s.id];
      const selected = s.id === focusId;
      const card = document.createElement("article");
      card.className = `card ${tone}${selected ? " is-focus" : ""}`;
      card.dataset.id = s.id;
      card.dataset.date = s.date;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-pressed", selected ? "true" : "false");

      const pick = document.createElement("p");
      pick.className = "card-pick";
      pick.textContent = selected
        ? "✓ 而家係 Main focus · Current focus"
        : "撳呢度設為 Main focus · Set as Main focus";

      const title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = s.zh;

      const en = document.createElement("p");
      en.className = "card-en";
      en.textContent = s.en;

      const date = document.createElement("p");
      date.className = "card-date";
      date.textContent = `${formatDisplayDate(s.date)} · 08:30 HKT`;

      const tip = document.createElement("p");
      tip.className = "card-encourage";
      tip.appendChild(document.createTextNode(s.tipZh));
      tip.appendChild(document.createElement("br"));
      const tipEn = document.createElement("span");
      tipEn.style.fontWeight = "500";
      tipEn.style.opacity = "0.85";
      tipEn.textContent = s.tipEn;
      tip.appendChild(tipEn);

      const units = buildUnitRow(true);
      units.wrap.id = `count-${s.id}`;

      const over = document.createElement("p");
      over.className = "card-over";
      over.id = `over-${s.id}`;
      over.hidden = true;
      over.textContent = "已考 / Exam over — 做得好！Well done.";

      card.append(pick, title, en, date, tip, units.wrap, over);
      frag.appendChild(card);

      cardRefs[s.id] = {
        days: units.refs.days,
        hours: units.refs.hours,
        minutes: units.refs.minutes,
        seconds: units.refs.seconds,
        count: units.wrap,
        over,
        card,
        pick,
      };
    }
    listEl.appendChild(frag);
  }

  function setText(el, value) {
    if (el.textContent !== value) el.textContent = value;
  }

  function tick() {
    const now = Date.now();
    const focus = getFocus();
    const heroParts = splitRemaining(targetById[focus.id] - now);

    if (heroVals) {
      setText(heroVals.days, String(heroParts.days));
      setText(heroVals.hours, pad(heroParts.hours));
      setText(heroVals.minutes, pad(heroParts.minutes));
      setText(heroVals.seconds, pad(heroParts.seconds));
    }
    if (heroDoneEl) {
      const showDone = heroParts.done;
      if (heroDoneEl.hidden === showDone) heroDoneEl.hidden = !showDone;
      heroEl.classList.toggle("done", showDone);
    }

    for (let i = 0; i < byDate.length; i++) {
      const s = byDate[i];
      const ref = cardRefs[s.id];
      if (!ref) continue;
      const parts = splitRemaining(targetById[s.id] - now);
      if (parts.done) {
        if (!ref.count.hidden) ref.count.hidden = true;
        if (ref.over.hidden) ref.over.hidden = false;
        ref.card.classList.add("done");
      } else {
        if (ref.count.hidden) ref.count.hidden = false;
        if (!ref.over.hidden) ref.over.hidden = true;
        ref.card.classList.remove("done");
        setText(ref.days, String(parts.days));
        setText(ref.hours, pad(parts.hours));
        setText(ref.minutes, pad(parts.minutes));
        setText(ref.seconds, pad(parts.seconds));
      }
    }
  }

  function setFocus(id) {
    if (!subjectById[id] || id === focusId) return;
    const prev = cardRefs[focusId];
    if (prev) {
      prev.card.classList.remove("is-focus");
      prev.card.setAttribute("aria-pressed", "false");
      prev.pick.textContent = "撳呢度設為 Main focus · Set as Main focus";
    }
    focusId = id;
    localStorage.setItem(STORAGE_KEY, id);
    renderHero();
    const next = cardRefs[id];
    if (next) {
      next.card.classList.add("is-focus");
      next.card.setAttribute("aria-pressed", "true");
      next.pick.textContent = "✓ 而家係 Main focus · Current focus";
    }
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
