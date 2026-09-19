/**
 * 2027 HKDSE countdown — all targets are 08:30 Asia/Hong_Kong (+08:00).
 */
(function () {
  const EXAM_HOUR = 8;
  const EXAM_MINUTE = 30;

  const TONES = [
    "tone-red", "tone-orange", "tone-amber", "tone-lime", "tone-green",
    "tone-teal", "tone-cyan", "tone-blue", "tone-indigo", "tone-violet",
    "tone-purple", "tone-fuchsia", "tone-pink", "tone-rose",
  ];

  /** @type {{id:string, zh:string, en:string, date:string, hero?:boolean, tipZh:string, tipEn:string}[]} */
  const SUBJECTS = [
    {
      id: "chi",
      zh: "中國語文（一）及（二）",
      en: "Chinese Language Papers 1 & 2",
      date: "2027-04-08",
      hero: true,
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

  const hero = SUBJECTS.find((s) => s.hero);
  const others = SUBJECTS.filter((s) => !s.hero).sort((a, b) => a.date.localeCompare(b.date));

  function renderHeroSkeleton() {
    heroEl.innerHTML = `
      <span class="hero-label">Main focus · 主科焦點</span>
      <h2>${hero.zh}</h2>
      <p class="en-name">${hero.en}</p>
      <p class="hero-date">${formatDisplayDate(hero.date)} · 08:30 HKT</p>
      <p class="hero-encourage">${hero.tipZh}<br /><span style="font-weight:500;opacity:.9">${hero.tipEn}</span></p>
      <div class="countdown" id="hero-count"></div>
      <div id="hero-done" hidden class="done-banner">已考 / Exam over — 為下一科繼續加油！You’ve cleared this one. Keep going.</div>
    `;
  }

  function renderListSkeleton() {
    listEl.innerHTML = others
      .map((s, i) => {
        const tone = TONES[i % TONES.length];
        return `
      <article class="card ${tone}" data-id="${s.id}" data-date="${s.date}">
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

    const heroParts = splitRemaining(targetMs(hero.date) - now);
    const heroCount = document.getElementById("hero-count");
    const heroDone = document.getElementById("hero-done");
    if (heroParts.done) {
      heroEl.classList.add("done");
      paintUnits(heroCount, heroParts, false);
      heroDone.hidden = false;
    } else {
      heroEl.classList.remove("done");
      paintUnits(heroCount, heroParts, false);
      heroDone.hidden = true;
    }

    for (const s of others) {
      const parts = splitRemaining(targetMs(s.date) - now);
      const card = listEl.querySelector(`[data-id="${s.id}"]`);
      const count = document.getElementById(`count-${s.id}`);
      const over = document.getElementById(`over-${s.id}`);
      if (parts.done) {
        card.classList.add("done");
        count.hidden = true;
        over.hidden = false;
      } else {
        card.classList.remove("done");
        count.hidden = false;
        over.hidden = true;
        paintUnits(count, parts, true);
      }
    }
  }

  renderHeroSkeleton();
  renderListSkeleton();
  tick();
  setInterval(tick, 1000);
})();
