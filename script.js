

document.addEventListener("DOMContentLoaded", () => {
  initNavbarActiveLink();
  initScrollReveal();
  initSpotlightSlider();
  initEventListingPage();
  initEventDetailsPage();
  initContactFormValidation();
  initRegisterButtons();
  initSmoothScrollOffset();
  initYear();
});


function showToast(message, icon = "bi-check-circle") {
  let toast = document.querySelector(".uni-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "uni-toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="bi ${icon} icon"></i><span>${message}</span>`;
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 3200);
}


function initNavbarActiveLink() {
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".navbar-uni .nav-link[data-page]").forEach((link) => {
    if (link.dataset.page === path) link.classList.add("active");
  });
}


function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal, .ticket-card");
  if (!("IntersectionObserver" in window) || !targets.length) {
    targets.forEach((t) => t.classList.add("revealed"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((t) => io.observe(t));
}


function initSpotlightSlider() {
  const root = document.querySelector("[data-spotlight]");
  if (!root) return;

  const track = root.querySelector(".spotlight-track");
  const slides = Array.from(root.querySelectorAll(".spotlight-slide"));
  const dotsWrap = root.querySelector(".spotlight-dots");
  const progress = root.querySelector(".spotlight-progress");
  let index = 0;
  let timer;
  const DURATION = 5000;

  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    if (i === 0) dot.classList.add("active");
    dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function goTo(i) {
    index = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${index * 100}%)`;
    dotsWrap.querySelectorAll("button").forEach((d, di) => d.classList.toggle("active", di === index));
    restartProgress();
  }

  function restartProgress() {
    if (!progress) return;
    progress.style.transition = "none";
    progress.style.width = "0%";
    requestAnimationFrame(() => {
      progress.style.transition = `width ${DURATION}ms linear`;
      progress.style.width = "100%";
    });
  }

  function startAutoplay() {
    clearInterval(timer);
    timer = setInterval(() => goTo(index + 1), DURATION);
    restartProgress();
  }

  root.querySelector(".spotlight-nav.next")?.addEventListener("click", () => {
    goTo(index + 1);
    startAutoplay();
  });
  root.querySelector(".spotlight-nav.prev")?.addEventListener("click", () => {
    goTo(index - 1);
    startAutoplay();
  });

  root.addEventListener("mouseenter", () => clearInterval(timer));
  root.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
}


function eventCardMarkup(ev) {
  return `
    <div class="col-md-6 col-lg-4">
      <div class="ticket-card">
        <div class="ticket-banner ${ev.bannerClass}">
          <i class="bi ${ev.icon}"></i>
          <span class="ticket-no">NO. ${ev.no}</span>
        </div>
        <div class="ticket-body">
          <span class="eyebrow">${ev.category}</span>
          <h5 class="mt-1 mb-2">${ev.title}</h5>
          <div class="ticket-meta"><i class="bi bi-calendar3"></i> ${ev.date}</div>
          <div class="ticket-meta"><i class="bi bi-clock"></i> ${ev.time}</div>
          <div class="ticket-meta"><i class="bi bi-geo-alt"></i> ${ev.venue}</div>
        </div>
        <div class="ticket-perf"></div>
        <div class="ticket-footer">
          <a href="event-details.html?id=${ev.id}" class="btn btn-outline-brand btn-sm">View Details</a>
          <button class="btn btn-gold btn-sm register-btn" data-title="${ev.title}" data-hint="Instant QR ticket">Register</button>
        </div>
      </div>
    </div>`;
}

function initEventListingPage() {
  const grid = document.getElementById("eventsGrid");
  if (!grid || typeof EVENTS === "undefined") return;

  const searchInput = document.getElementById("eventSearch");
  const chips = document.querySelectorAll(".chip[data-category]");
  const emptyState = document.getElementById("eventsEmpty");
  const countLabel = document.getElementById("resultsCount");

  let activeCategory = "All";

  function render() {
    const q = (searchInput?.value || "").trim().toLowerCase();
    const filtered = EVENTS.filter((ev) => {
      const matchesCategory = activeCategory === "All" || ev.category === activeCategory;
      const matchesQuery =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        ev.organizer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });

    grid.innerHTML = filtered.map(eventCardMarkup).join("");
    if (countLabel) countLabel.textContent = `${filtered.length} event${filtered.length === 1 ? "" : "s"} found`;
    if (emptyState) emptyState.classList.toggle("d-none", filtered.length !== 0);

    initScrollReveal();
    initRegisterButtons();
    // stagger the reveal slightly for a nicer feel
    grid.querySelectorAll(".ticket-card").forEach((card, i) => {
      setTimeout(() => card.classList.add("revealed"), i * 60);
    });
  }

  searchInput?.addEventListener("input", render);
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      activeCategory = chip.dataset.category;
      render();
    });
  });

  render();
}


function initEventDetailsPage() {
  const container = document.getElementById("eventDetailsRoot");
  if (!container || typeof EVENTS === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const ev = getEventById(params.get("id")) || EVENTS[0];

  document.title = `${ev.title} — UniEvent Hub`;
  document.getElementById("evBreadcrumbTitle").textContent = ev.title;
  document.getElementById("evTitle").textContent = ev.title;
  document.getElementById("evDate").textContent = ev.date;
  document.getElementById("evTime").textContent = ev.time;
  document.getElementById("evVenue").textContent = ev.venue;
  document.getElementById("evOrganizer").textContent = ev.organizer;
  document.getElementById("evDescription").textContent = ev.description;
  document.getElementById("evBanner").className = `ev-banner-lg ${ev.bannerClass}`;
  document.getElementById("evBannerIcon").className = `bi ${ev.icon}`;
  document.getElementById("evTicketNo").textContent = `NO. ${ev.no}`;
  document.getElementById("evCategory").textContent = ev.category;

  const pct = Math.round((ev.remaining / ev.capacity) * 100);
  document.getElementById("evRemainingText").textContent = `${ev.remaining} / ${ev.capacity}`;
  const bar = document.getElementById("evProgressBar");
  bar.style.width = "0%";
  requestAnimationFrame(() => (bar.style.width = pct + "%"));

  document.getElementById("evRating").textContent = ev.rating.toFixed(1);
  document.getElementById("evRatingCount").textContent = `(${ev.ratingCount} ratings)`;

  const highlightsList = document.getElementById("evHighlights");
  highlightsList.innerHTML = ev.highlights.map((h) => `<li><i class="bi bi-check2-circle me-2 text-success"></i>${h}</li>`).join("");

  document.querySelectorAll(".register-btn-lg").forEach((btn) => (btn.dataset.title = ev.title));

  const moreWrap = document.getElementById("moreEvents");
  if (moreWrap) {
    const others = EVENTS.filter((e) => e.id !== ev.id).slice(0, 3);
    moreWrap.innerHTML = others.map(eventCardMarkup).join("");
    initScrollReveal();
    initRegisterButtons();
  }
}


function initRegisterButtons() {
  document.querySelectorAll(".register-btn, .register-btn-lg").forEach((btn) => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "true";
    btn.addEventListener("click", () => {
      const title = btn.dataset.title || "this event";
      const modalTitle = document.getElementById("registerModalTitle");
      const modalEl = document.getElementById("registerModal");
      if (modalTitle) modalTitle.textContent = title;
      if (modalEl && window.bootstrap) {
        const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
        modal.show();
      } else {
        showToast(`Registered for ${title}`, "bi-ticket-perforated");
      }
    });
  });

  document.getElementById("confirmRegisterBtn")?.addEventListener("click", () => {
    const modalEl = document.getElementById("registerModal");
    const title = document.getElementById("registerModalTitle")?.textContent || "the event";
    if (modalEl && window.bootstrap) {
      window.bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    }
    setTimeout(() => showToast(`Ticket confirmed for ${title} — check your dashboard`, "bi-qr-code"), 350);
  });
}


function initContactFormValidation() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const fields = {
    name: { el: form.querySelector("#cfName"), validate: (v) => v.trim().length >= 2, msg: "Please enter your full name (min 2 characters)." },
    email: {
      el: form.querySelector("#cfEmail"),
      validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      msg: "Please enter a valid email address.",
    },
    subject: { el: form.querySelector("#cfSubject"), validate: (v) => v.trim().length >= 3, msg: "Subject must be at least 3 characters." },
    message: { el: form.querySelector("#cfMessage"), validate: (v) => v.trim().length >= 10, msg: "Message should be at least 10 characters." },
  };

  function validateField(key) {
    const { el, validate } = fields[key];
    if (!el) return true;
    const ok = validate(el.value);
    el.classList.toggle("is-invalid", !ok);
    el.classList.toggle("is-valid", ok);
    return ok;
  }

  Object.keys(fields).forEach((key) => {
    const el = fields[key].el;
    el?.addEventListener("input", () => validateField(key));
    el?.addEventListener("blur", () => validateField(key));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const results = Object.keys(fields).map(validateField);
    const allValid = results.every(Boolean);
    const successBox = document.getElementById("contactSuccess");

    if (allValid) {
      form.reset();
      Object.values(fields).forEach(({ el }) => el?.classList.remove("is-valid", "is-invalid"));
      successBox?.classList.remove("d-none");
      showToast("Message sent — we'll get back to you soon", "bi-envelope-check");
      setTimeout(() => successBox?.classList.add("d-none"), 4000);
    } else {
      successBox?.classList.add("d-none");
      form.querySelector(".is-invalid")?.focus();
    }
  });
}

function initSmoothScrollOffset() {
  const navHeight = document.querySelector(".navbar-uni")?.offsetHeight || 0;
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      e.preventDefault();
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

function initYear() {
  document.querySelectorAll(".current-year").forEach((el) => (el.textContent = new Date().getFullYear()));
}
