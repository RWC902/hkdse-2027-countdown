/**
 * 2027 HKDSE countdown — lightweight build 20260919i
 * Hero: 4 blocks / 1s. Cards: ONE text node each / 1s. No full re-render.
 */
(function () {
  "use strict";
  var BUILD = "20260919i";
  var STORAGE_KEY = "hkdse2027-focus-id-v3";
  var VERSE_KEY = "hkdse2027-verse-i";
  var NOT_BEFORE = Date.UTC(2027, 2, 31, 16, 0, 0);

  var TONES = ["tone-red","tone-orange","tone-amber","tone-lime","tone-green","tone-teal","tone-cyan","tone-blue","tone-indigo","tone-violet","tone-purple","tone-fuchsia","tone-pink","tone-rose"];

  var VERSES = [
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
    { zh: "應當一無掛慮，只要凡事藉著禱告、祈求，和感謝，將你們所要的告訴神。", en: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.", ref: "腓立比書 4:6 · Philippians 4:6" }
  ];

  var SUBJECTS = [
    { id:"chi", zh:"中國語文（一）及（二）", en:"Chinese Language Papers 1 & 2", date:"2027-04-08", tip:"讀多一篇、寫多一段——你做得到。" },
    { id:"va", zh:"視覺藝術", en:"Visual Arts", date:"2027-04-06", tip:"把構思畫清楚，大膽表達。" },
    { id:"chilit", zh:"中國文學", en:"Chinese Literature", date:"2027-04-07", tip:"文本要細讀，感受同分析一齊走。" },
    { id:"eng12", zh:"英國語文（一）及（二）", en:"English Language Papers 1 & 2", date:"2027-04-09", tip:"每日讀寫一點，流暢度會返嚟。" },
    { id:"eng3", zh:"英國語文（三）聆聽及綜合", en:"English Language Paper 3", date:"2027-04-10", tip:"抓重點、保持冷靜。" },
    { id:"math", zh:"數學必修部分", en:"Mathematics Compulsory Part", date:"2027-04-12", tip:"計錯唔緊要，懂改就係進步。" },
    { id:"csd", zh:"公民與社會發展", en:"Citizenship and Social Development", date:"2027-04-13", tip:"用事實同清晰結構表達。" },
    { id:"hmsc", zh:"健康管理與社會關懷", en:"Health Management & Social Care", date:"2027-04-14", tip:"同理心同分析並重。" },
    { id:"chem", zh:"化學", en:"Chemistry", date:"2027-04-15", tip:"方程式同概念連起來記。" },
    { id:"geo", zh:"地理", en:"Geography", date:"2027-04-16", tip:"地圖、數據、解釋三角齊。" },
    { id:"ict", zh:"資訊及通訊科技", en:"Information & Communication Technology", date:"2027-04-17", tip:"先理解原理再寫步驟。" },
    { id:"bio", zh:"生物", en:"Biology", date:"2027-04-19", tip:"用圖同流程記系統。" },
    { id:"dat", zh:"設計與應用科技", en:"Design & Applied Technology", date:"2027-04-20", tip:"設計要解決問題。" },
    { id:"phy", zh:"物理", en:"Physics", date:"2027-04-21", tip:"搞清公式背後嘅意思。" },
    { id:"econ", zh:"經濟", en:"Economics", date:"2027-04-22", tip:"用圖表同例子解釋。" },
    { id:"m1m2", zh:"數學延伸部分", en:"Mathematics Extended Part", date:"2027-04-23", tip:"難題拆細步。" },
    { id:"chist", zh:"中國歷史", en:"Chinese History", date:"2027-04-24", tip:"時間線同因果要清楚。" },
    { id:"bafs", zh:"企業、會計與財務概論", en:"Business, Accounting & Financial Studies", date:"2027-04-26", tip:"數字要準，解釋要清。" },
    { id:"hist", zh:"歷史", en:"History", date:"2027-04-27", tip:"史料用來支持論點。" },
    { id:"ths", zh:"旅遊與款待", en:"Tourism & Hospitality Studies", date:"2027-04-28", tip:"設身處地諗旅客同營運。" },
    { id:"ers", zh:"倫理與宗教", en:"Ethics & Religious Studies", date:"2027-04-30", tip:"立場清晰，尊重觀點。" }
  ];

  function targetMs(iso) {
    var p = iso.split("-");
    return Date.UTC(+p[0], +p[1] - 1, +p[2], 0, 30, 0);
  }

  var byDate = SUBJECTS.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  var toneById = {}, subjectById = {}, targetById = {};
  for (var i = 0; i < byDate.length; i++) toneById[byDate[i].id] = TONES[i % TONES.length];
  for (var j = 0; j < SUBJECTS.length; j++) {
    subjectById[SUBJECTS[j].id] = SUBJECTS[j];
    targetById[SUBJECTS[j].id] = targetMs(SUBJECTS[j].date);
  }

  function fmtDate(iso) {
    return new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Hong_Kong", weekday: "short", year: "numeric", month: "short", day: "numeric" }).format(new Date(targetMs(iso)));
  }
  function pad2(n) { return n < 10 ? "0" + n : "" + n; }

  function rem(id, now) {
    var ms = targetById[id] - now;
    if (now >= NOT_BEFORE && ms <= 0) return { done: true, days: 0, hours: 0, minutes: 0, seconds: 0, line: "Completed · 已完成" };
    if (ms < 0) ms = 0;
    var s = Math.floor(ms / 1000);
    var days = Math.floor(s / 86400);
    var hours = Math.floor((s % 86400) / 3600);
    var minutes = Math.floor((s % 3600) / 60);
    var seconds = s % 60;
    return {
      done: false, days: days, hours: hours, minutes: minutes, seconds: seconds,
      line: days + "d " + pad2(hours) + ":" + pad2(minutes) + ":" + pad2(seconds)
    };
  }

  function nextUp(now) {
    for (var i = 0; i < byDate.length; i++) if (!rem(byDate[i].id, now).done) return byDate[i];
    return null;
  }

  function resolveFocus(now) {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (!rem("chi", now).done) {
      if (stored && subjectById[stored] && !rem(stored, now).done) return stored;
      return "chi";
    }
    if (stored && subjectById[stored] && !rem(stored, now).done) return stored;
    var n = nextUp(now);
    return n ? n.id : "chi";
  }

  var heroEl = document.getElementById("hero");
  var listEl = document.getElementById("subject-list");
  var verseTextEl = document.getElementById("verse-text");
  var verseRefEl = document.getElementById("verse-ref");
  var verseNextBtn = document.getElementById("verse-next");
  var verseListEl = document.getElementById("verse-list");

  var focusId = resolveFocus(Date.now());
  try {
    localStorage.setItem(STORAGE_KEY, focusId);
    localStorage.removeItem("hkdse2027-focus-id");
    localStorage.removeItem("hkdse2027-focus-id-v2");
  } catch (e) {}

  var verseIndex = +localStorage.getItem(VERSE_KEY) || 0;
  if (verseIndex < 0 || verseIndex >= VERSES.length) verseIndex = 0;

  var heroVals = null, heroCount = null, heroStatus = null;
  var cardRefs = {}; // id -> {clock, over, card, pick, done}

  function setTxt(el, v) { if (el && el.firstChild ? el.textContent !== v : true) { if (el && el.textContent !== v) el.textContent = v; } }

  function buildHeroUnits() {
    var wrap = document.createElement("div");
    wrap.className = "countdown";
    var labels = ["Days · 日", "Hours · 時", "Minutes · 分", "Seconds · 秒"];
    var keys = ["days", "hours", "minutes", "seconds"];
    var refs = {};
    for (var i = 0; i < 4; i++) {
      var box = document.createElement("div");
      box.className = "unit";
      var val = document.createElement("span");
      val.className = "value";
      val.textContent = "0";
      var lab = document.createElement("span");
      lab.className = "label";
      lab.textContent = labels[i];
      box.appendChild(val); box.appendChild(lab); wrap.appendChild(box);
      refs[keys[i]] = val;
    }
    return { wrap: wrap, refs: refs };
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
      html += "<li><strong>" + v.ref + "</strong><br>" + v.zh + "<br><em>" + v.en + "</em></li>";
    }
    verseListEl.innerHTML = html;
  }

  function renderHero() {
    var f = subjectById[focusId];
    heroEl.textContent = "";
    var label = document.createElement("span");
    label.className = "hero-label";
    label.textContent = "Main focus · 主科焦點";
    var h2 = document.createElement("h2");
    h2.textContent = f.zh;
    var en = document.createElement("p");
    en.className = "en-name";
    en.textContent = f.en;
    var date = document.createElement("p");
    date.className = "hero-date";
    date.textContent = fmtDate(f.date) + " · 08:30 HKT";
    var tip = document.createElement("p");
    tip.className = "hero-encourage";
    tip.textContent = f.tip;
    var units = buildHeroUnits();
    heroCount = units.wrap;
    heroVals = units.refs;
    heroStatus = document.createElement("div");
    heroStatus.className = "completed-badge";
    heroStatus.textContent = "✓ Completed · 已完成";
    var hint = document.createElement("p");
    hint.className = "hero-hint";
    hint.textContent = "撳下面科目可更換主科 · Build " + BUILD;
    heroEl.appendChild(label); heroEl.appendChild(h2); heroEl.appendChild(en);
    heroEl.appendChild(date); heroEl.appendChild(tip); heroEl.appendChild(heroCount);
    heroEl.appendChild(heroStatus); heroEl.appendChild(hint);
  }

  function renderList() {
    listEl.textContent = "";
    cardRefs = {};
    var frag = document.createDocumentFragment();
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
      date.textContent = fmtDate(s.date) + " · 08:30 HKT";
      var tip = document.createElement("p");
      tip.className = "card-encourage";
      tip.textContent = s.tip;
      var clock = document.createElement("div");
      clock.className = "card-clock";
      clock.textContent = "—";
      var over = document.createElement("div");
      over.className = "card-over";
      over.textContent = "✓ Completed · 已完成";

      card.appendChild(pick); card.appendChild(title); card.appendChild(en);
      card.appendChild(date); card.appendChild(tip); card.appendChild(clock); card.appendChild(over);
      frag.appendChild(card);
      cardRefs[s.id] = { clock: clock, over: over, card: card, pick: pick, done: false };
    }
    listEl.appendChild(frag);
  }

  function markFocus() {
    for (var i = 0; i < byDate.length; i++) {
      var id = byDate[i].id;
      var ref = cardRefs[id];
      if (!ref) continue;
      var on = id === focusId;
      ref.card.classList.toggle("is-focus", on);
      var t = on ? "✓ Current focus · 而家主科" : "Set as Main focus · 設為主科";
      if (ref.pick.textContent !== t) ref.pick.textContent = t;
    }
  }

  function tick() {
    var now = Date.now();
    var fr = rem(focusId, now);
    if (fr.done) {
      var n = nextUp(now);
      if (n && n.id !== focusId) {
        focusId = n.id;
        try { localStorage.setItem(STORAGE_KEY, focusId); } catch (e) {}
        renderHero();
        markFocus();
        fr = rem(focusId, now);
      }
    }

    if (fr.done) {
      if (heroCount.style.display !== "none") heroCount.style.display = "none";
      if (heroStatus.style.display !== "block") heroStatus.style.display = "block";
    } else {
      if (heroCount.style.display === "none") heroCount.style.display = "";
      if (heroStatus.style.display !== "none") heroStatus.style.display = "none";
      if (heroVals.days.textContent !== String(fr.days)) heroVals.days.textContent = String(fr.days);
      var hh = pad2(fr.hours), mm = pad2(fr.minutes), ss = pad2(fr.seconds);
      if (heroVals.hours.textContent !== hh) heroVals.hours.textContent = hh;
      if (heroVals.minutes.textContent !== mm) heroVals.minutes.textContent = mm;
      if (heroVals.seconds.textContent !== ss) heroVals.seconds.textContent = ss;
    }

    for (var i = 0; i < byDate.length; i++) {
      var s = byDate[i];
      var ref = cardRefs[s.id];
      if (!ref) continue;
      var r = rem(s.id, now);
      if (r.done) {
        if (!ref.done) {
          ref.done = true;
          ref.clock.style.display = "none";
          ref.over.style.display = "block";
          ref.card.classList.add("done");
        }
      } else {
        if (ref.done) {
          ref.done = false;
          ref.clock.style.display = "";
          ref.over.style.display = "none";
          ref.card.classList.remove("done");
        }
        if (ref.clock.textContent !== r.line) ref.clock.textContent = r.line;
      }
    }
  }

  function setFocus(id) {
    if (!subjectById[id] || id === focusId) return;
    focusId = id;
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
    renderHero();
    markFocus();
    tick();
  }

  listEl.addEventListener("click", function (e) {
    var c = e.target.closest(".card");
    if (c) setFocus(c.dataset.id);
  });
  listEl.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var c = e.target.closest(".card");
    if (!c) return;
    e.preventDefault();
    setFocus(c.dataset.id);
  });
  verseNextBtn.addEventListener("click", function () {
    verseIndex = (verseIndex + 1) % VERSES.length;
    renderVerse();
  });

  renderVerse();
  renderVerseList();
  renderHero();
  renderList();
  tick();

  // Align to whole seconds to reduce timer drift / double work
  var lastSec = -1;
  function loop(ts) {
    var sec = Math.floor(Date.now() / 1000);
    if (sec !== lastSec) {
      lastSec = sec;
      tick();
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
