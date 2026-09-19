/**
 * 2027 HKDSE countdown — all targets are 08:30 Asia/Hong_Kong (+08:00).
 */
(function () {
  const EXAM_HOUR = 8;
  const EXAM_MINUTE = 30;

  /** @type {{id:string, zh:string, en:string, date:string, hero?:boolean}[]} */
  const SUBJECTS = [
    { id: "chi", zh: "中國語文（一）及（二）", en: "Chinese Language Papers 1 & 2", date: "2027-04-08", hero: true },
    { id: "va", zh: "視覺藝術", en: "Visual Arts", date: "2027-04-06" },
    { id: "chilit", zh: "中國文學", en: "Chinese Literature", date: "2027-04-07" },
    { id: "eng12", zh: "英國語文（一）及（二）", en: "English Language Papers 1 & 2", date: "2027-04-09" },
    { id: "eng3", zh: "英國語文（三）聆聽及綜合", en: "English Language Paper 3", date: "2027-04-10" },
    { id: "math", zh: "數學必修部分", en: "Mathematics Compulsory Part", date: "2027-04-12" },
    { id: "csd", zh: "公民與社會發展", en: "Citizenship and Social Development", date: "2027-04-13" },
    { id: "hmsc", zh: "健康管理與社會關懷", en: "Health Management & Social Care", date: "2027-04-14" },
    { id: "chem", zh: "化學", en: "Chemistry", date: "2027-04-15" },
    { id: "geo", zh: "地理", en: "Geography", date: "2027-04-16" },
    { id: "ict", zh: "資訊及通訊科技", en: "Information & Communication Technology", date: "2027-04-17" },
    { id: "bio", zh: "生物", en: "Biology", date: "2027-04-19" },
    { id: "dat", zh: "設計與應用科技", en: "Design & Applied Technology", date: "2027-04-20" },
    { id: "phy", zh: "物理", en: "Physics", date: "2027-04-21" },
    { id: "econ", zh: "經濟", en: "Economics", date: "2027-04-22" },
    { id: "m1m2", zh: "數學延伸部分", en: "Mathematics Extended Part", date: "2027-04-23" },
    { id: "chist", zh: "中國歷史", en: "Chinese History", date: "2027-04-24" },
    { id: "bafs", zh: "企業、會計與財務概論", en: "Business, Accounting & Financial Studies", date: "2027-04-26" },
    { id: "hist", zh: "歷史", en: "History", date: "2027-04-27" },
    { id: "ths", zh: "旅遊與款待", en: "Tourism & Hospitality Studies", date: "2027-04-28" },
    { id: "ers", zh: "倫理與宗教", en: "Ethics & Religious Studies", date: "2027-04-30" },
  ];

  function targetMs(isoDate) {
    // Explicit +08:00 so student device timezone cannot shift the exam start.
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
      <div class="countdown" id="hero-count"></div>
      <div id="hero-done" hidden class="done-banner">已考 / Exam over — 繼續為下一科努力！</div>
    `;
  }

  function renderListSkeleton() {
    listEl.innerHTML = others
      .map(
        (s) => `
      <article class="card" data-id="${s.id}" data-date="${s.date}">
        <h3 class="card-title">${s.zh}</h3>
        <p class="card-en">${s.en}</p>
        <p class="card-date">${formatDisplayDate(s.date)} · 08:30 HKT</p>
        <div class="card-count" id="count-${s.id}"></div>
        <p class="card-over" id="over-${s.id}" hidden>已考 / Exam over</p>
      </article>`
      )
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
          (u) => `<div class="mini"><strong>${u.label === "Days" || u.label === "Days · 日" ? u.value : pad(u.value)}</strong><span>${u.label}</span></div>`
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
