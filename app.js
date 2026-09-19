/**
 * 2027 HKDSE countdown — 08:30 HKT (Asia/Hong_Kong).
 * Build: 20260919g
 *
 * - Default Main focus: 中國語文
 * - Completed ONLY when exam time has passed (hard safety: never before 2027-04-01)
 * - All countdowns tick every 1s by updating text only (no full re-render)
 */
(function () {
  "use strict";

  const BUILD = "20260919g";
  const STORAGE_KEY = "hkdse2027-focus-id-v3";
  const VERSE_KEY = "hkdse2027-verse-i";
  // Nothing can be Completed before HKT midnight 1 Apr 2027 (= 2027-03-31 16:00 UTC)
  const NOT_BEFORE = Date.UTC(2027, 2, 31, 16, 0, 0);

  const TONES = [
    "tone-red", "tone-orange", "tone-amber", "tone-lime", "tone-green",
    "tone-teal", "tone-cyan", "tone-blue", "tone-indigo", "tone-violet",
    "tone-purple", "tone-fuchsia", "tone-pink", "tone-rose",
  ];

  const VERSES = [
    { zh: "我靠著那加給我力量的，凡事都能做。", en: "I can do all this through him who gives me strength.", ref: "腓立比書 4:13 · Philippians 4:13" },
    { zh: "你不要害怕，因為我與你同在；不要驚惶，因為我是你的神。我必堅固你，我必幫助你。", en: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.", ref: "以賽亞書 41:10 · Isaiah 41:10" },
    { zh: "你當剛強壯膽！不要懼怕，也不要驚惶；因為你無論往哪裡去，耶和華你的神必與你同在。", en: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", ref: "約書亞記 1:9 · Joshua 1:9" },
    { zh: "神是我們的避難所，是我們的力量，是我們在患難中隨時的幫助。", en: "God is our refuge and strength, an ever-present help in trouble.", ref: "詩篇 46:1 · Psalm 46:1" },
    { zh: "你要專心仰賴耶和華，不可倚靠自己的聰明，在你一切所行的事上都要認定他，他必指引你的路。", en: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.", ref: "箴言 3:5–6 · Proverbs 3:5–6" },
    { zh: "耶穌看著他們，說：在人這是不能的，在神凡事都能。", en: "Jesus looked at them and said, “With man this is impossible, but with God all things are possible.”", ref: "馬太福音 19:26 · Matthew 19:26" },
    { zh: "因為神賜給我們，不是膽怯的心，乃是剛強、仁愛、謹守的心。", en: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.", ref: "提摩太後書 1:7 · 2 Timothy 1:7" },
    { zh: "你的話是我腳前的燈，是我路上的光。", en: "Your word is a lamp for my feet, a light on my path.", ref: "詩篇 119:105 · Psalm 119:105" },
    { zh: "耶和華說：我知道我向你們所懷的意念是賜平安的意念，不是降災禍的意念，要叫你們末後有指望。", en: "“For I know the plans I have for you,” declares the Lord, “plans to prosper you and not to harm you, plans to give you hope and a future.”", ref: "耶利米書 29:11 · Jeremiah 29:11" },
    { zh: "我們曉得萬事都互相效力，叫愛神的人得益處。", en: "And we know that in all things God works for the good of those who love him.", ref: "羅馬書 8:28 · Romans 8:28" },
    { zh: "凡勞苦擔重擔的人可以到我這裡來，我就使你們得安息。", en: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "馬太福音 11:28 · Matthew 11:28" },
    { zh: "應當一無掛慮，只要凡事藉著禱告、祈求，和感謝，將你們所要的告訴神。", en: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", ref: "腓立比書 4:6 · Philippians 4:6" },
  ];

  const SUBJECTS = [
    { id: "chi", zh: "中國語文（一）及（二）", en: "Chinese Language Papers 1 & 2", date: "2027-04-08", tipZh: "讀多一篇、寫多一段。語感係練出嚟嘅——你做得到。", tipEn: "One more passage, one more paragraph. You’ve got this." },
    { id: "va", zh: "視覺藝術", en: "Visual Arts", date: "2027-04-06", tipZh: "把構思畫清楚，大膽表達你嘅觀察。", tipEn: "Make your ideas visible. Trust your eye." },
    { id: "chilit", zh: "中國文學", en: "Chinese Literature", date: "2027-04-07", tipZh: "文本要細讀，感受同分析一齊走。", tipEn: "Read closely — feeling and analysis travel together." },
    { id: "eng12", zh: "英國語文（一）及（二）", en: "English Language Papers 1 & 2", date: "2027-04-09", tipZh: "每日讀寫一點，流暢度會慢慢返嚟。", tipEn: "A little reading and writing daily rebuilds fluency." },
    { id: "eng3", zh: "英國語文（三）聆聽及綜合", en: "English Language Paper 3", date: "2027-04-10", tipZh: "練習抓重點同組織答案，冷靜就贏一半。", tipEn: "Calm focus wins half the battle." },
    { id: "math", zh: "數學必修部分", en: "Mathematics Compulsory Part", date: "2027-04-12", tipZh: "計錯唔緊要，懂改同懂檢查就係進步。", tipEn: "Fixing and checking is real progress." },
    { id: "csd", zh: "公民與社會發展", en: "Citizenship and Social Development", date: "2027-04-13", tipZh: "用事實同清晰結構表達觀點。", tipEn: "Use facts and a clear structure." },
    { id: "hmsc", zh: "健康管理與社會關懷", en: "Health Management & Social Care", date: "2027-04-14", tipZh: "個案要有同理心同專業分析。", tipEn: "Blend empathy with analysis." },
    { id: "chem", zh: "化學", en: "Chemistry", date: "2027-04-15", tipZh: "方程式同概念連起來記，會穩陣好多。", tipEn: "Link equations to concepts." },
    { id: "geo", zh: "地理", en: "Geography", date: "2027-04-16", tipZh: "地圖、數據、解釋：三角齊就強。", tipEn: "Maps, data, explanation." },
    { id: "ict", zh: "資訊及通訊科技", en: "Information & Communication Technology", date: "2027-04-17", tipZh: "理解原理再寫步驟，debug 會快啲。", tipEn: "Understand the idea, then the steps." },
    { id: "bio", zh: "生物", en: "Biology", date: "2027-04-19", tipZh: "用圖同流程記系統，唔好死背。", tipEn: "Use diagrams and processes." },
    { id: "dat", zh: "設計與應用科技", en: "Design & Applied Technology", date: "2027-04-20", tipZh: "設計要解決問題，過程同成品一樣重要。", tipEn: "Process matters as much as product." },
    { id: "phy", zh: "物理", en: "Physics", date: "2027-04-21", tipZh: "公式背後嘅故事搞清楚，應用先唔亂。", tipEn: "Know the story behind each formula." },
    { id: "econ", zh: "經濟", en: "Economics", date: "2027-04-22", tipZh: "用圖表同例子解釋，答題會更有力。", tipEn: "Explain with graphs and examples." },
    { id: "m1m2", zh: "數學延伸部分", en: "Mathematics Extended Part", date: "2027-04-23", tipZh: "難題拆細步，一步清就離答案近一步。", tipEn: "Break hard questions into steps." },
    { id: "chist", zh: "中國歷史", en: "Chinese History", date: "2027-04-24", tipZh: "時間線同因果記清楚，論述有骨幹。", tipEn: "Timeline and cause-effect." },
    { id: "bafs", zh: "企業、會計與財務概論", en: "Business, Accounting & Financial Studies", date: "2027-04-26", tipZh: "數字要準，解釋要清楚——兩邊一齊練。", tipEn: "Accurate numbers and clear explanations." },
    { id: "hist", zh: "歷史", en: "History", date: "2027-04-27", tipZh: "史料要用嚟支持論點，唔係堆砌。", tipEn: "Use sources to support arguments." },
    { id: "ths", zh: "旅遊與款待", en: "Tourism & Hospitality Studies", date: "2027-04-28", tipZh: "設身處地諗旅客同營運，答案更貼地。", tipEn: "Think like guest and operator." },
    { id: "ers", zh: "倫理與宗教", en: "Ethics & Religious Studies", date: "2027-04-30", tipZh: "立場要清晰，尊重唔同觀點。", tipEn: "Be clear and respectful." },
  ];

  function targetMs(isoDate) {
    var p = isoDate.split("-");
    return Date.UTC(+p[0], +p[1] - 1, +p[2], 0, 30, 0); // 08:30 HKT
  }

  var byDate = SUBJECTS.slice().sort(function (a, b) { return a.date.localeCompare(b.date); });
  var toneById = {}, subjectById = {}, targetById = {};
  for (var i = 0; i < byDate.length; i++) toneById[byDate[i].id] = TONES[i % TONES.length];
  for (var j = 0; j < SUBJECTS.length; j++) {
    subjectById[SUBJECTS[j].id] = SUBJECTS[j];
    targetById[SUBJECTS[j].id] = targetMs(SUBJECTS[j].date);
  }

  function formatDisplayDate(isoDate) {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Hong_Kong",
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(targetMs(isoDate)));
  }

  function pad2(n) { return n < 10 ? "0" + n : String(n); }

  function remainingOf(id, now) {
    var ms = targetById[id] - now;
    var completed = now >= NOT_BEFORE && ms <= 0;
    if (completed) return { completed: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    if (ms < 0) ms = 0;
    var totalSec = Math.floor(ms / 1000);
    return {
      completed: false,
      days: Math.floor(totalSec / 86400),
      hours: Math.floor((totalSec % 86400) / 3600),
      minutes: Math.floor((totalSec % 3600) / 60),
      seconds: totalSec % 60,
    };
  }

  function nextUpcoming(now) {
    for (var i = 0; i < byDate.length; i++) {
      if (!remainingOf(byDate[i].id, now).completed) return byDate[i];
    }
    return null;
  }

  function resolveFocusId(now) {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!remainingOf("chi", now).completed) {
      if (stored && subjectById[stored] && !remainingOf(stored, now).completed) return stored;
      return "chi";
    }
    if (stored && subjectById[stored] && !remainingOf(stored, now).completed) return stored;
    var n = nextUpcoming(now);
    return n ? n.id : "chi";
  }

  var heroEl = document.getElementById("hero");
  var listEl = document.getElementById("subject-list");
  var verseTextEl = document.getElementById("verse-text");
  var verseRefEl = document.getElementById("verse-ref");
  var verseNextBtn = document.getElementById("verse-next");
  var verseListEl = document.getElementById("verse-list");

  var focusId = resolveFocusId(Date.now());
  try {
    localStorage.setItem(STORAGE_KEY, focusId);
    localStorage.removeItem("hkdse2027-focus-id");
    localStorage.removeItem("hkdse2027-focus-id-v2");
  } catch (e) {}

  var verseIndex = Number(localStorage.getItem(VERSE_KEY));
  if (!isFinite(verseIndex) || verseIndex < 0 || verseIndex >= VERSES.length) verseIndex = 0;

  var heroVals = null, heroCountWrap = null, heroStatusEl = null, cardRefs = {};

  function setText(el, v) { if (el && el.textContent !== v) el.textContent = v; }

  function buildUnits(compact) {
    var labels = compact ? ["Days", "Hrs", "Min", "Sec"] : ["Days · 日", "Hours · 時", "Minutes · 分", "Seconds · 秒"];
    var wrap = document.createElement("div");
    wrap.className = compact ? "card-count" : "countdown";
    var refs = {}, keys = ["days", "hours", "minutes", "seconds"];
    for (var i = 0; i < 4; i++) {
      var box = document.createElement("div");
      box.className = compact ? "mini" : "unit";
      var val = document.createElement(compact ? "strong" : "span");
      if (!compact) val.className = "value";
      val.textContent = "0";
      var lab = document.createElement("span");
      if (!compact) lab.className = "label";
      lab.textContent = labels[i];
      box.appendChild(val); box.appendChild(lab); wrap.appendChild(box);
      refs[keys[i]] = val;
    }
    return { wrap: wrap, refs: refs };
  }

  function paint(refs, r) {
    setText(refs.days, String(r.days));
    setText(refs.hours, pad2(r.hours));
    setText(refs.minutes, pad2(r.minutes));
    setText(refs.seconds, pad2(r.seconds));
  }

  function renderVerse() {
    var v = VERSES[verseIndex];
    verseTextEl.textContent = v.zh;
    verseTextEl.appendChild(document.createElement("br"));
    var en = document.createElement("span");
    en.className = "verse-en";
    en.textContent = v.en;
    verseTextEl.appendChild(en);
    verseRefEl.textContent = v.ref;
    try { localStorage.setItem(VERSE_KEY, String(verseIndex)); } catch (e) {}
  }

  function renderVerseList() {
    var html = "";
    for (var i = 0; i < VERSES.length; i++) {
      var v = VERSES[i];
      html += "<li><strong>" + v.ref + "</strong><br />" + v.zh + "<br /><em>" + v.en + "</em></li>";
    }
    verseListEl.innerHTML = html;
  }

  function renderHero() {
    var focus = subjectById[focusId];
    heroEl.textContent = "";
    var label = document.createElement("span");
    label.className = "hero-label";
    label.textContent = "Main focus · 主科焦點";
    var h2 = document.createElement("h2");
    h2.textContent = focus.zh;
    var en = document.createElement("p");
    en.className = "en-name";
    en.textContent = focus.en;
    var date = document.createElement("p");
    date.className = "hero-date";
    date.textContent = formatDisplayDate(focus.date) + " · 08:30 HKT";
    var tip = document.createElement("p");
    tip.className = "hero-encourage";
    tip.textContent = focus.tipZh + " " + focus.tipEn;
    var units = buildUnits(false);
    heroCountWrap = units.wrap;
    heroVals = units.refs;
    heroStatusEl = document.createElement("div");
    heroStatusEl.className = "completed-badge";
    heroStatusEl.style.display = "none";
    heroStatusEl.textContent = "✓ Completed · 已完成";
    var hint = document.createElement("p");
    hint.className = "hero-hint";
    hint.textContent = "撳下面科目可更換主科焦點 · Click a subject to change focus · Build " + BUILD;
    heroEl.appendChild(label); heroEl.appendChild(h2); heroEl.appendChild(en);
    heroEl.appendChild(date); heroEl.appendChild(tip); heroEl.appendChild(heroCountWrap);
    heroEl.appendChild(heroStatusEl); heroEl.appendChild(hint);
  }

  function renderList() {
    listEl.textContent = "";
    cardRefs = {};
    for (var i = 0; i < byDate.length; i++) {
      var s = byDate[i];
      var selected = s.id === focusId;
      var card = document.createElement("article");
      card.className = "card " + toneById[s.id] + (selected ? " is-focus" : "");
      card.dataset.id = s.id;
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      var pick = document.createElement("p");
      pick.className = "card-pick";
      pick.textContent = selected ? "✓ Current focus · 而家主科" : "Set as Main focus · 設為主科";
      var title = document.createElement("h3");
      title.className = "card-title";
      title.textContent = s.zh;
      var en = document.createElement("p");
      en.className = "card-en";
      en.textContent = s.en;
      var date = document.createElement("p");
      date.className = "card-date";
      date.textContent = formatDisplayDate(s.date) + " · 08:30 HKT";
      var tip = document.createElement("p");
      tip.className = "card-encourage";
      tip.textContent = s.tipZh;
      var units = buildUnits(true);
      var over = document.createElement("p");
      over.className = "card-over";
      over.style.display = "none";
      over.textContent = "✓ Completed · 已完成";
      card.appendChild(pick); card.appendChild(title); card.appendChild(en);
      card.appendChild(date); card.appendChild(tip); card.appendChild(units.wrap); card.appendChild(over);
      listEl.appendChild(card);
      cardRefs[s.id] = { days: units.refs.days, hours: units.refs.hours, minutes: units.refs.minutes, seconds: units.refs.seconds, count: units.wrap, over: over, card: card, pick: pick };
    }
  }

  function markListFocus() {
    for (var i = 0; i < byDate.length; i++) {
      var s = byDate[i];
      var ref = cardRefs[s.id];
      if (!ref) continue;
      var selected = s.id === focusId;
      if (selected) ref.card.classList.add("is-focus"); else ref.card.classList.remove("is-focus");
      setText(ref.pick, selected ? "✓ Current focus · 而家主科" : "Set as Main focus · 設為主科");
    }
  }

  function updateAll() {
    var now = Date.now();
    var focusRem = remainingOf(focusId, now);
    if (focusRem.completed) {
      var nxt = nextUpcoming(now);
      if (nxt && nxt.id !== focusId) {
        focusId = nxt.id;
        try { localStorage.setItem(STORAGE_KEY, focusId); } catch (e) {}
        renderHero();
        markListFocus();
        focusRem = remainingOf(focusId, now);
      }
    }

    if (focusRem.completed) {
      heroEl.classList.add("done");
      if (heroCountWrap) heroCountWrap.style.display = "none";
      if (heroStatusEl) heroStatusEl.style.display = "block";
    } else {
      heroEl.classList.remove("done");
      if (heroCountWrap) heroCountWrap.style.display = "";
      if (heroStatusEl) heroStatusEl.style.display = "none";
      if (heroVals) paint(heroVals, focusRem);
    }

    for (var i = 0; i < byDate.length; i++) {
      var s = byDate[i];
      var ref = cardRefs[s.id];
      if (!ref) continue;
      var r = remainingOf(s.id, now);
      if (r.completed) {
        ref.count.style.display = "none";
        ref.over.style.display = "block";
        ref.card.classList.add("done");
      } else {
        ref.count.style.display = "";
        ref.over.style.display = "none";
        ref.card.classList.remove("done");
        paint(ref, r);
      }
    }
  }

  function setFocus(id) {
    if (!subjectById[id] || id === focusId) return;
    focusId = id;
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
    renderHero();
    markListFocus();
    updateAll();
  }

  listEl.addEventListener("click", function (e) {
    var card = e.target.closest(".card");
    if (card) setFocus(card.dataset.id);
  });
  listEl.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var card = e.target.closest(".card");
    if (!card) return;
    e.preventDefault();
    setFocus(card.dataset.id);
  });
  verseNextBtn.addEventListener("click", function () {
    verseIndex = (verseIndex + 1) % VERSES.length;
    renderVerse();
  });

  renderVerse();
  renderVerseList();
  renderHero();
  renderList();
  updateAll();
  setInterval(updateAll, 1000);
})();
