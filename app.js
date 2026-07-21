/* StudioBook explainer — tiny interactions, no dependencies.
   1) Sticky-nav active-link highlight on scroll.
   2) Smooth scroll for in-page anchors (with reduced-motion respect).
   3) Signature touch: the hero booking card runs its own tail end —
      the album-delivery milestone moves balance-due -> reminder ->
      paid & delivered, and the "album due in" countdown ticks over.
      A live demo of the promise: nothing slips after the shoot. */

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. Active nav link on scroll ---------- */
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav__links a[href^="#"]')
  );
  var sections = links
    .map(function (a) {
      return document.getElementById(a.getAttribute("href").slice(1));
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var byId = {};
    links.forEach(function (a) {
      byId[a.getAttribute("href").slice(1)] = a;
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          var a = byId[e.target.id];
          if (!a) return;
          if (e.isIntersecting) {
            links.forEach(function (l) {
              l.style.color = "";
            });
            a.style.color = "var(--accent)";
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  /* ---------- 2. Smooth scroll for anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (ev) {
      var id = a.getAttribute("href");
      if (id === "#" || id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      ev.preventDefault();
      el.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
      history.replaceState(null, "", id);
    });
  });

  /* ---------- 3. Signature: the booking closes itself ---------- */
  var rows = document.getElementById("reg-rows");
  var liveTag = document.getElementById("reg-live-tag");
  var caption = document.getElementById("reg-caption");
  var collectedEl = document.getElementById("reg-collected");
  var pendingEl = document.getElementById("reg-pending");

  if (!rows || !liveTag || !collectedEl || !pendingEl) return;

  // The album-delivery milestone is the one that "closes itself".
  var albumRow = rows.querySelector('[data-state="due"]');

  var ALBUM_BALANCE = 85000; // final album-delivery balance
  var BASE_COLLECTED = 255000; // advance + shoot-day already in

  function rupee(n) {
    return "Rs " + n.toLocaleString("en-IN");
  }

  // Cycle: album balance due -> reminder staged -> paid & delivered -> reset.
  var stages = [
    {
      tag: "Balance due",
      tagClass: "tag--due",
      caption: "Album deadline approaching → StudioBook stages a WhatsApp nudge.",
      collected: BASE_COLLECTED,
      pending: "6 days",
      state: "due",
      flash: false
    },
    {
      tag: "Reminder sent",
      tagClass: "tag--due",
      caption: "Nudge sent to Sameer on WhatsApp — balance and album deadline, in one line.",
      collected: BASE_COLLECTED,
      pending: "3 days",
      state: "due",
      flash: false
    },
    {
      tag: "Paid ✓",
      tagClass: "tag--paid",
      caption: "Rs 85,000 balance received — album handed over, booking closed.",
      collected: BASE_COLLECTED + ALBUM_BALANCE,
      pending: "Delivered",
      state: "paid",
      flash: true
    }
  ];

  var i = 0;

  function applyStage(s) {
    liveTag.textContent = s.tag;
    liveTag.className = "reg-row__tag " + s.tagClass;
    if (albumRow) albumRow.setAttribute("data-state", s.state);
    caption.textContent = s.caption;
    collectedEl.textContent = rupee(s.collected);
    pendingEl.textContent = s.pending;
    if (albumRow && s.flash) {
      albumRow.classList.add("flash");
      setTimeout(function () {
        albumRow.classList.remove("flash");
      }, 900);
    }
  }

  // If the user prefers reduced motion, show the closed end-state once
  // (the promise fulfilled) and don't loop.
  if (reduceMotion) {
    applyStage(stages[2]);
    liveTag.textContent = "Paid ✓";
    caption.textContent =
      "Balance due → reminder → paid & delivered — the whole tail end, hands-free.";
    return;
  }

  // Only animate while the widget is on screen (saves work, feels intentional).
  var running = false;
  var timer = null;

  function loop() {
    timer = setTimeout(function () {
      i = (i + 1) % stages.length;
      applyStage(stages[i]);
      loop();
    }, i === 0 ? 2600 : 2200);
  }

  var vis = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && !running) {
          running = true;
          loop();
        } else if (!e.isIntersecting && running) {
          running = false;
          clearTimeout(timer);
        }
      });
    },
    { threshold: 0.35 }
  );
  vis.observe(rows.closest(".register"));
})();
