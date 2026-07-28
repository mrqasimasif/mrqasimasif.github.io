/* ============================================================
   Muhammad Qasim — portfolio
   Vanilla JS. No dependencies.
   ============================================================ */

(function () {
  "use strict";

  /* ------------------------------------------------------------
     Gallery photos — add your own here.
     Drop files into assets/img/gallery/ and list them below.
     ------------------------------------------------------------ */
  var GALLERY = [
    // { src: "assets/img/gallery/kentucky.jpg", title: "Kentucky", text: "Autumn on campus" },
  ];

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme ---------- */

  var themeToggle = $("#themeToggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) { }
    });
  }

  /* ---------- Toast ---------- */

  var toast = $("#toast");
  var toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("active");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("active"); }, 2200);
  }

  /* ---------- Sidebar toggle (mobile / tablet) ---------- */

  var sidebar = $("[data-sidebar]");
  var sidebarBtn = $("[data-sidebar-btn]");

  if (sidebar && sidebarBtn) {
    // Above 1250px the sidebar is always expanded, so the inline height must come off.
    var collapsible = window.matchMedia("(max-width: 1249px)");

    /*
      Measure the real content height rather than trusting a fixed max-height —
      otherwise adding a contact row silently clips the panel. Cap it at 80% of
      the viewport so it stays usable in landscape on a short screen, and only
      then let the panel scroll internally.
    */
    function syncHeight() {
      var reset = !collapsible.matches || !sidebar.classList.contains("active");
      if (reset) {
        sidebar.style.maxHeight = "";
        sidebar.style.overflowY = "";
        return;
      }

      var needed = sidebar.scrollHeight;
      var cap = Math.round(window.innerHeight * 0.8);

      sidebar.style.maxHeight = Math.min(needed, cap) + "px";
      sidebar.style.overflowY = needed > cap ? "auto" : "";
    }

    sidebarBtn.addEventListener("click", function () {
      var open = sidebar.classList.toggle("active");
      sidebarBtn.setAttribute("aria-expanded", open ? "true" : "false");
      var label = $("span", sidebarBtn);
      if (label) label.textContent = open ? "Hide Contacts" : "Show Contacts";
      syncHeight();
    });

    var resizeTimer;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(syncHeight, 150);
    }, { passive: true });

    if (collapsible.addEventListener) collapsible.addEventListener("change", syncHeight);
    syncHeight();
  }

  /* ---------- Page tabs ---------- */

  var navLinks = $$("[data-nav-link]");
  var pages = $$("article[data-page]");

  function animateSkills() {
    $$(".skill-progress-fill").forEach(function (bar) {
      bar.style.width = bar.dataset.progress + "%";
    });
  }

  function openPage(name, pushHash) {
    var found = false;

    pages.forEach(function (page) {
      var on = page.dataset.page === name;
      page.classList.toggle("active", on);
      if (on) found = true;
    });

    navLinks.forEach(function (link) {
      link.classList.toggle("active", link.textContent.trim().toLowerCase() === name);
    });

    if (!found) return false;

    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    if (name === "resume") setTimeout(animateSkills, 150);
    if (pushHash) history.replaceState(null, "", "#" + name);
    return true;
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      openPage(link.textContent.trim().toLowerCase(), true);
    });
  });

  // deep links: /#resume, /#portfolio …
  var initial = (location.hash || "").replace("#", "").toLowerCase();
  if (initial) openPage(initial, false);
  if ($("article.resume.active")) animateSkills();

  window.addEventListener("hashchange", function () {
    openPage((location.hash || "#about").replace("#", "").toLowerCase(), false);
  });

  /* ---------- Portfolio filter ---------- */

  var select = $("[data-select]");
  var selectValue = $("[data-select-value]");
  var selectItems = $$("[data-select-item]");
  var filterBtns = $$("[data-filter-btn]");
  var filterItems = $$("[data-filter-item]");

  function applyFilter(value) {
    filterItems.forEach(function (item) {
      var on = value === "all" || value === item.dataset.category;
      item.classList.toggle("active", on);
    });
  }

  if (select && selectValue) {
    select.addEventListener("click", function () {
      var open = select.classList.toggle("active");
      select.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("click", function (event) {
      if (!select.contains(event.target) && !event.target.closest(".select-list")) {
        select.classList.remove("active");
        select.setAttribute("aria-expanded", "false");
      }
    });
  }

  selectItems.forEach(function (item) {
    item.addEventListener("click", function () {
      var label = item.textContent.trim();
      var value = label.toLowerCase();

      if (selectValue) selectValue.textContent = label;
      if (select) {
        select.classList.remove("active");
        select.setAttribute("aria-expanded", "false");
      }

      applyFilter(value);
      filterBtns.forEach(function (btn) {
        btn.classList.toggle("active", btn.textContent.trim().toLowerCase() === value);
      });
    });
  });

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var label = btn.textContent.trim();
      var value = label.toLowerCase();

      if (selectValue) selectValue.textContent = label;
      applyFilter(value);

      filterBtns.forEach(function (other) { other.classList.remove("active"); });
      btn.classList.add("active");
    });
  });

  /* ---------- Contact form ---------- */

  var form = $("[data-form]");
  var formInputs = $$("[data-form-input]");
  var formBtn = $("[data-form-btn]");

  if (form && formBtn) {
    formInputs.forEach(function (input) {
      input.addEventListener("input", function () {
        formBtn.disabled = !form.checkValidity();
      });
    });

    form.addEventListener("submit", function (event) {
      // No Formspree endpoint configured yet — fall back to the visitor's mail client
      if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
        event.preventDefault();
        var name = (form.elements.name.value || "").trim();
        var email = (form.elements.email.value || "").trim();
        var message = (form.elements.message.value || "").trim();

        window.location.href = "mailto:meqasimasif@gmail.com" +
          "?subject=" + encodeURIComponent("Portfolio enquiry from " + name) +
          "&body=" + encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");

        showToast("Opening your mail app…");
      }
    });
  }

  /* ---------- Copy email ---------- */

  var copyBtn = $("#copyEmail");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var el = $("#emailText");
      var email = el ? el.textContent.trim() : "";

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(
          function () { showToast("Email copied to clipboard"); },
          function () { showToast(email); }
        );
      } else {
        showToast(email);
      }
    });
  }

  /* ---------- Live GitHub stars ---------- */

  (function loadGitHubStats() {
    var cards = $$("[data-repo]");
    if (!cards.length) return;

    var CACHE_KEY = "gh-repos-v1";
    var TTL = 6 * 60 * 60 * 1000; // GitHub allows 60 unauthenticated requests/hour per IP

    function render(repos) {
      var byName = {};
      repos.forEach(function (repo) { byName[repo.name.toLowerCase()] = repo; });

      cards.forEach(function (card) {
        var repo = byName[(card.dataset.repo || "").toLowerCase()];
        var slot = $("[data-stats]", card);
        if (!repo || !slot) return;

        var bits = [];
        if (repo.stargazers_count > 0) {
          bits.push('<span><svg aria-hidden="true"><use href="#i-star" /></svg>' + repo.stargazers_count + "</span>");
        }
        if (repo.language) bits.push("<span>" + repo.language + "</span>");
        slot.innerHTML = bits.join("");
      });
    }

    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (cached && Date.now() - cached.at < TTL) { render(cached.data); return; }
    } catch (e) { }

    fetch("https://api.github.com/users/mrqasimasif/repos?per_page=100&sort=updated")
      .then(function (res) { return res.ok ? res.json() : Promise.reject(res.status); })
      .then(function (repos) {
        if (!Array.isArray(repos)) return;
        var slim = repos.map(function (r) {
          return { name: r.name, stargazers_count: r.stargazers_count, language: r.language };
        });
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: slim })); } catch (e) { }
        render(slim);
      })
      .catch(function () { /* rate limited or offline — the cards just stay bare */ });
  })();

  /* ---------- Cursor pet ---------- */

  (function cursorPet() {
    var pet = $("#pet");
    if (!pet) return;

    // CSS already hides it for these; bail out so we never run the loop either.
    if (reduceMotion) return;
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    var W = 46;
    var H = 40;
    var FOLLOW = 0.085;   // easing per frame
    var STOP_AT = 58;     // how close it settles behind the cursor
    var NAP_AFTER = 4000; // ms of stillness before it dozes off

    // start off-screen so it walks in rather than popping into place
    var x = -80;
    var y = -80;
    var targetX = -80;
    var targetY = -80;
    var facing = 1;
    var running = false;
    var awake = false;
    var napTimer;
    var eyes = $$(".pet-eye", pet);

    function loop() {
      var dx = targetX - x;
      var dy = targetY - y;
      var dist = Math.hypot(dx, dy);
      var walking = dist > STOP_AT;

      if (walking) {
        x += dx * FOLLOW;
        y += dy * FOLLOW;
        if (Math.abs(dx) > 6) facing = dx < 0 ? -1 : 1;
      }

      pet.classList.toggle("is-walking", walking);
      pet.style.transform =
        "translate3d(" + Math.round(x - W / 2) + "px," + Math.round(y - H / 2) + "px,0)" +
        " scaleX(" + facing + ")";

      // pupils drift toward the cursor
      var ex = Math.max(-1.6, Math.min(1.6, dx / 28));
      var ey = Math.max(-1.4, Math.min(1.4, dy / 28));
      eyes.forEach(function (eye) {
        eye.style.transform = "translate(" + (ex * facing).toFixed(2) + "px," + ey.toFixed(2) + "px)";
      });

      // idle out once it has caught up — no rAF burning while nothing moves
      if (!walking && dist < STOP_AT + 1) {
        running = false;
        return;
      }
      requestAnimationFrame(loop);
    }

    function start() {
      if (running) return;
      running = true;
      requestAnimationFrame(loop);
    }

    window.addEventListener("pointermove", function (event) {
      if (event.pointerType === "touch") return;

      targetX = event.clientX;
      targetY = event.clientY;

      if (!awake) {
        awake = true;
        // drop it in just off the pointer so the first walk is short
        x = event.clientX - 120;
        y = event.clientY + 60;
        pet.classList.add("is-awake");
      }

      pet.classList.remove("is-asleep");
      clearTimeout(napTimer);
      napTimer = setTimeout(function () { pet.classList.add("is-asleep"); }, NAP_AFTER);

      start();
    }, { passive: true });

    // keep it in frame if the window is resized while it is resting
    window.addEventListener("resize", function () {
      targetX = Math.min(targetX, window.innerWidth - 10);
      targetY = Math.min(targetY, window.innerHeight - 10);
      start();
    }, { passive: true });

    document.addEventListener("mouseleave", function () {
      pet.classList.remove("is-awake");
      awake = false;
    });
  })();

  /* ---------- Gallery carousel ---------- */

  (function gallery() {
    var root = $("#galleryRoot");
    if (!root) return;

    if (!GALLERY.length) {
      root.innerHTML =
        '<div class="content-card gallery-empty">' +
        '<div class="icon-box"><svg aria-hidden="true"><use href="#i-image" /></svg></div>' +
        "<p>No photos here yet.</p>" +
        "<p>Add images to <code>assets/img/gallery/</code> and list them in the " +
        "<code>GALLERY</code> array at the top of <code>assets/js/main.js</code>.</p>" +
        "</div>";
      return;
    }

    var index = 0;

    root.innerHTML =
      '<div class="gallery-viewport">' +
      '<div class="gallery-track" id="galleryTrack">' +
      GALLERY.map(function (photo) {
        return '<figure class="gallery-slide">' +
          '<img src="' + photo.src + '" alt="' + (photo.title || "") + '" loading="lazy" decoding="async">' +
          '<figcaption class="gallery-caption"><h3>' + (photo.title || "") + "</h3>" +
          "<p>" + (photo.text || "") + "</p></figcaption></figure>";
      }).join("") +
      "</div>" +
      '<button class="gallery-nav gallery-nav--prev" id="galleryPrev" type="button" aria-label="Previous photo">' +
      '<svg aria-hidden="true"><use href="#i-chevron-left" /></svg></button>' +
      '<button class="gallery-nav gallery-nav--next" id="galleryNext" type="button" aria-label="Next photo">' +
      '<svg aria-hidden="true"><use href="#i-chevron-right" /></svg></button>' +
      "</div>" +
      '<div class="gallery-dots" id="galleryDots">' +
      GALLERY.map(function (_, i) {
        return '<button class="gallery-dot' + (i === 0 ? " active" : "") + '" type="button" data-dot="' + i +
          '" aria-label="Go to photo ' + (i + 1) + '"></button>';
      }).join("") +
      "</div>" +
      '<p class="gallery-hint">' +
      '<span class="hint-keys"><kbd>&larr;</kbd> <kbd>&rarr;</kbd> to navigate</span>' +
      '<span class="hint-swipe">Swipe to browse</span>' +
      "</p>";

    var track = $("#galleryTrack");
    var dots = $$("[data-dot]", root);

    function go(next) {
      index = (next + GALLERY.length) % GALLERY.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (dot, i) { dot.classList.toggle("active", i === index); });
    }

    $("#galleryPrev").addEventListener("click", function () { go(index - 1); });
    $("#galleryNext").addEventListener("click", function () { go(index + 1); });
    dots.forEach(function (dot) {
      dot.addEventListener("click", function () { go(Number(dot.dataset.dot)); });
    });

    document.addEventListener("keydown", function (event) {
      if (!$("article.gallery.active")) return;
      if (event.key === "ArrowLeft") go(index - 1);
      if (event.key === "ArrowRight") go(index + 1);
    });

    // swipe — on a phone this is how people expect a carousel to work
    var startX = 0;
    var startY = 0;
    var swiping = false;
    var viewport = $(".gallery-viewport", root);

    viewport.addEventListener("touchstart", function (event) {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      swiping = true;
    }, { passive: true });

    viewport.addEventListener("touchend", function (event) {
      if (!swiping) return;
      swiping = false;

      var dx = event.changedTouches[0].clientX - startX;
      var dy = event.changedTouches[0].clientY - startY;

      // ignore mostly-vertical drags so page scrolling still works
      if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
      go(dx < 0 ? index + 1 : index - 1);
    }, { passive: true });
  })();
})();
