(() => {
  const params = new URLSearchParams(location.search);
  const rawId = params.get("id") || "";

  function clearActive() {
    document.querySelectorAll(".is-active").forEach((el) => el.classList.remove("is-active"));
  }

  function initPicMore() {
    const grid = document.querySelector(".pic-grid");
    const btn = document.getElementById("pic-more");
    if (!grid || !btn) return;
    const pics = Array.prototype.slice.call(grid.querySelectorAll(".pic"));
    const step = 4;
    let shown = 0;

    function apply() {
      pics.forEach((pic, i) => {
        if (i < shown) pic.classList.remove("is-hidden");
        else pic.classList.add("is-hidden");
      });
      if (shown >= pics.length) btn.hidden = true;
      else {
        btn.hidden = false;
        const left = pics.length - shown;
        btn.textContent = left > step ? "Ещё" : "Ещё (" + left + ")";
      }
    }

    function revealMore() {
      shown = Math.min(shown + step, pics.length);
      apply();
    }

    function revealUntil(index) {
      if (index < 0) return;
      while (shown <= index && shown < pics.length) {
        shown = Math.min(shown + step, pics.length);
      }
      apply();
    }

    shown = Math.min(step, pics.length);
    apply();
    btn.addEventListener("click", revealMore);

    window.__picRevealUntil = revealUntil;
    window.__picRevealId = function (id) {
      const idx = pics.findIndex((p) => p.id === id);
      if (idx >= 0) revealUntil(idx);
    };
  }

  initPicMore();

  function initLightbox() {
    const box = document.getElementById("lightbox");
    const img = document.getElementById("lightbox-img");
    const cap = document.getElementById("lightbox-cap");
    const tagsEl = document.getElementById("lightbox-tags");
    const closeBtn = document.getElementById("lightbox-close");
    const prevBtn = document.getElementById("lightbox-prev");
    const nextBtn = document.getElementById("lightbox-next");
    const grid = document.querySelector(".pic-grid");
    if (!box || !img || !grid) return;

    const pics = Array.prototype.slice.call(grid.querySelectorAll(".pic"));
    let index = 0;

    function renderTags(pic) {
      if (!tagsEl) return;
      const raw = (pic.getAttribute("data-tags") || "").split(",");
      const tags = raw.map((t) => t.trim()).filter(Boolean);
      tagsEl.innerHTML = tags
        .map((t) => {
          const href = "index.html?id=" + encodeURIComponent(t);
          return '<a href="' + href + '">#' + t.replace(/</g, "") + "</a>";
        })
        .join("");
    }

    function showAt(i) {
      if (!pics.length) return;
      index = (i + pics.length) % pics.length;
      const pic = pics[index];
      if (window.__picRevealUntil) window.__picRevealUntil(index);
      const photo = pic.querySelector("img");
      if (!photo) return;
      img.src = photo.currentSrc || photo.src;
      img.alt = photo.alt || "";
      if (cap) cap.textContent = photo.title || photo.alt || "";
      renderTags(pic);
      box.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function openFromPic(pic) {
      const i = pics.indexOf(pic);
      if (i < 0) return;
      showAt(i);
    }

    function close() {
      box.hidden = true;
      img.removeAttribute("src");
      if (tagsEl) tagsEl.innerHTML = "";
      document.body.style.overflow = "";
    }

    function prev() {
      showAt(index - 1);
    }

    function next() {
      showAt(index + 1);
    }

    window.__openPicLightbox = openFromPic;
    window.__closePicLightbox = close;

    grid.addEventListener("click", (e) => {
      const pic = e.target.closest(".pic");
      if (!pic || !grid.contains(pic)) return;
      e.preventDefault();
      openFromPic(pic);
    });

    if (closeBtn) closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      close();
    });
    if (prevBtn) prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      prev();
    });
    if (nextBtn) nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      next();
    });
    if (tagsEl) tagsEl.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    box.addEventListener("click", (e) => {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", (e) => {
      if (box.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    });
  }

  initLightbox();

  function focusId(id) {
    if (!id) return;
    if (window.__picRevealId) window.__picRevealId(id);
    clearActive();
    let target =
      document.getElementById(id) ||
      document.querySelector('[data-tags*="' + id + '"]');
    if (!target && id === "oh-barbara-pictures") {
      target = document.getElementById("oh-barbara-pictures");
    }
    if (!target && id === "oh-barbara-news") {
      target = document.getElementById("oh-barbara-news");
    }
    if (!target) return;
    target.classList.add("is-active");
    const isPic = target.classList && target.classList.contains("pic");
    if (isPic) {
      target.classList.add("is-active");
      if (window.__openPicLightbox) window.__openPicLightbox(target);
      return;
    }
    const pic = target.querySelector(".pic");
    if (pic) pic.classList.add("is-active");
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderTags(list) {
    const cloud = document.getElementById("tag-cloud");
    const btn = document.getElementById("tag-more");
    if (!cloud || !Array.isArray(list)) return;
    const preferred = [
      "oh-barbara-news",
      "oh-barbara-news-reviews-clips",
      "oh-barbara-expect",
      "oh-barbara-site",
      "oh-barbara_clips",
      "oh-barbara-faq",
      "oh-barbara-recommend",
      "oh-barbara-pictures",
      "tiktok-oh-barbara",
      "rising-star-oh-barbara",
      "восходящая-звезда-ох-барбара",
      "oh-barbara",
      "ох-барбара",
      "twitch-oh-barbara",
      "instagram-oh-barbara",
      "just-chatting-oh-barbara",
      "irl-oh-barbara",
      "phuket-oh-barbara",
    ];
    const bySlug = {};
    list.forEach((t) => {
      if (t && t.slug) bySlug[t.slug] = t;
    });
    const shownList = [];
    preferred.forEach((s) => {
      if (bySlug[s]) shownList.push(bySlug[s]);
    });
    list.forEach((t) => {
      if (!t || !t.slug) return;
      if (/^oh-barbara-picture-\d+$/.test(t.slug)) shownList.push(t);
    });
    cloud.innerHTML = shownList
      .map((t) => {
        const href = "index.html?id=" + encodeURIComponent(t.slug);
        return '<a href="' + href + '" class="tag-link is-hidden">#' + String(t.name || t.slug).replace(/</g, "") + "</a>";
      })
      .join("");

    if (!btn) return;
    const tags = Array.prototype.slice.call(cloud.querySelectorAll(".tag-link"));
    const step = 4;
    let shown = 0;

    function apply() {
      tags.forEach((el, i) => {
        if (i < shown) el.classList.remove("is-hidden");
        else el.classList.add("is-hidden");
      });
      if (shown >= tags.length) btn.hidden = true;
      else {
        btn.hidden = false;
        btn.textContent = "Ещё";
      }
    }

    shown = Math.min(step, tags.length);
    apply();
    btn.onclick = function () {
      shown = Math.min(shown + step, tags.length);
      apply();
    };
  }

  fetch("data/tags.json")
    .then((r) => (r.ok ? r.json() : []))
    .then(renderTags)
    .catch(() => {});

  function pad2(n) {
    return n < 10 ? "0" + n : String(n);
  }

  var monthsRu = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  function tickUtcClock() {
    const now = new Date();
    const day = now.getUTCDate();
    const month = now.getUTCMonth();
    const y = now.getUTCFullYear();
    const d = pad2(day);
    const m = pad2(month + 1);
    const h = pad2(now.getUTCHours());
    const min = pad2(now.getUTCMinutes());
    const s = pad2(now.getUTCSeconds());
    const isoDay = y + "-" + m + "-" + d;
    const dateEl = document.getElementById("live-date");
    const clockEl = document.getElementById("live-clock");
    const newsDay = document.getElementById("news-day-ru");
    if (dateEl) {
      dateEl.textContent = d + "." + m + "." + y;
      dateEl.setAttribute("datetime", isoDay + "T" + h + ":" + min + ":" + s + "Z");
    }
    if (clockEl) {
      clockEl.textContent = h + ":" + min + ":" + s + " UTC";
    }
    if (newsDay) {
      newsDay.textContent = day + " " + monthsRu[month] + " " + y;
      newsDay.setAttribute("datetime", isoDay);
    }
  }

  tickUtcClock();
  setInterval(tickUtcClock, 1000);

  if (rawId) {
    window.addEventListener("load", () => focusId(rawId));
  }

  window.addEventListener("popstate", () => {
    focusId(new URLSearchParams(location.search).get("id") || "");
  });
})();
