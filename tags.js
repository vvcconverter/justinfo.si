(function (global) {
  "use strict";

  const TAGS = [
    "водка казино",
    "водка бет",
    "зеркало водка бет",
    "vodka bet",
    "vodka casino",
    "водка бет официальный",
    "водка казино зеркало",
    "вход водка бет",
    "стрим водка бет",
    "vodka_bet",
    "twitch водка бет",
    "рабочее зеркало водка бет",
    "официальный водка бет",
    "vodka casino mirror",
    "vodka-bet-video",
    "vodka-bet-picture"
  ];

  const TAG_META = {
    "водка казино": {
      title: "Водка Казино — вход и зеркало | Vodka Bet",
      description: "Водка Казино: актуальный вход через Водка Бет и зеркало Водка Бет. Стримы на Twitch vodka_bet."
    },
    "водка бет": {
      title: "Водка Бет — официальный вход | Vodka Bet",
      description: "Водка Бет — бренд и точка входа в Водка Казино. Зеркало Водка Бет и Twitch."
    },
    "зеркало водка бет": {
      title: "Зеркало Водка Бет — рабочий вход в Водка Казино",
      description: "Рабочее зеркало Водка Бет для доступа к Водка Казино, если основной адрес недоступен."
    },
    "vodka bet": {
      title: "Vodka Bet — Водка Бет / Водка Казино",
      description: "Vodka Bet (Водка Бет): зеркало, казино и Twitch-канал vodka_bet."
    },
    "vodka casino": {
      title: "Vodka Casino — Водка Казино | Vodka Bet",
      description: "Vodka Casino / Водка Казино через Водка Бет. Зеркало и стримы."
    },
    "водка бет официальный": {
      title: "Водка Бет официальный — зеркало и Twitch",
      description: "Официальный Водка Бет: зеркало Водка Бет, Водка Казино и https://www.twitch.tv/vodka_bet/about"
    },
    "vodka-bet-video": {
      title: "Водка Бет видео | Vodka Bet",
      description: "Видео Водка Бет — Водка Казино, зеркало Водка Бет, vodka bet."
    },
    "vodka-bet-picture": {
      title: "Водка Бет картинка | Vodka Bet",
      description: "Превью Водка Бет — Водка Казино, зеркало Водка Бет, vodka bet."
    }
  };

  function normalize(value) {
    return String(value || "")
      .trim()
      .replace(/\+/g, " ")
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  function getIdFromUrl(search) {
    const q = new URLSearchParams(search || global.location.search);
    const raw = q.get("id");
    if (!raw) return "";
    try {
      return decodeURIComponent(raw.replace(/\+/g, " ")).trim();
    } catch (_) {
      return raw.trim();
    }
  }

  function tagHref(tag) {
    return "index.html?id=" + encodeURIComponent(tag);
  }

  function findTag(id) {
    const n = normalize(id);
    if (!n) return null;
    return TAGS.find((t) => normalize(t) === n) || null;
  }

  function setMeta(name, content) {
    if (!content) return;
    let m = document.querySelector('meta[name="' + name + '"]');
    if (!m) {
      m = document.createElement("meta");
      m.setAttribute("name", name);
      document.head.appendChild(m);
    }
    m.setAttribute("content", content);
  }

  function applyActiveTag(tag) {
    const active = findTag(tag) || (tag ? String(tag).trim() : "");
    const allKeywords = TAGS.join(", ");
    setMeta("keywords", allKeywords);

    if (!active) {
      document.body && document.body.removeAttribute("data-active-tag");
      return { active: "", tags: TAGS };
    }

    document.body && document.body.setAttribute("data-active-tag", active);
    const metaKey = Object.keys(TAG_META).find((k) => normalize(k) === normalize(active));
    const info = metaKey ? TAG_META[metaKey] : null;

    if (info) {
      document.title = info.title;
      setMeta("description", info.description);
    } else {
      document.title = active + " — Водка Бет | Водка Казино";
      setMeta(
        "description",
        active + " — Водка Бет, водка казино, зеркало водка бет, vodka bet, vodka casino."
      );
    }

    setMeta("keywords", active + ", " + allKeywords);
    return { active: active, tags: TAGS };
  }

  function renderTagsCloud(container) {
    if (!container) return;
    container.className = (container.className + " seo-tags").trim();
    container.setAttribute("aria-hidden", "true");
    container.innerHTML = "";
    TAGS.forEach((tag) => {
      const a = document.createElement("a");
      a.href = tagHref(tag);
      a.rel = "tag";
      a.textContent = tag;
      container.appendChild(a);
      container.appendChild(document.createTextNode(" "));
    });
  }

  function collectTagsFromPageData(data) {
    const out = TAGS.slice();
    const push = (v) => {
      const t = String(v || "").trim();
      if (!t) return;
      if (!out.some((x) => normalize(x) === normalize(t))) out.push(t);
    };
    (data && data.site && data.site.keywords || []).forEach(push);
    (data && data.sections || []).forEach((s) => {
      push(s.title);
    });
    return out;
  }

  function mergePageTags(data) {
    const extra = collectTagsFromPageData(data);
    extra.forEach((t) => {
      if (!TAGS.some((x) => normalize(x) === normalize(t))) TAGS.push(t);
    });
    return TAGS.slice();
  }

  global.PageTags = {
    TAGS: TAGS,
    getIdFromUrl: getIdFromUrl,
    tagHref: tagHref,
    findTag: findTag,
    applyActiveTag: applyActiveTag,
    renderTagsCloud: renderTagsCloud,
    mergePageTags: mergePageTags,
    normalize: normalize
  };
})(typeof window !== "undefined" ? window : globalThis);