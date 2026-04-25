// header ki java 

const btn = document.getElementById('mobile-menu-button');
        const menu = document.getElementById('mobile-menu');

        btn.addEventListener('click', () => {
            menu.classList.toggle('hidden');
        });

//end work header


        // landing page ka work

       
(function() {

  /* ── Custom Cursor ── */
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform  = `translate(${mx - 4}px, ${my - 4}px)`;
    ring.style.transform = `translate(${mx - 18}px, ${my - 18}px)`;
  });
  document.querySelectorAll('a, button, .fabric-card, .why-card').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  /* ── Thread Canvas Animation ── */
  const canvas = document.getElementById('thread-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, threads = [];
    function resize() {
      w = canvas.width  = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function makeThread() {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        len: 60 + Math.random() * 120,
        opacity: 0.2 + Math.random() * 0.4,
        hue: Math.random() < 0.7 ? '#c8962a' : '#fff'
      };
    }
    for (let i = 0; i < 80; i++) threads.push(makeThread());

    function drawThreads() {
      ctx.clearRect(0, 0, w, h);
      threads.forEach(t => {
        ctx.beginPath();
        ctx.strokeStyle = t.hue;
        ctx.globalAlpha = t.opacity;
        ctx.lineWidth = 0.7;
        const angle = Math.atan2(t.vy, t.vx);
        ctx.moveTo(t.x - Math.cos(angle) * t.len/2, t.y - Math.sin(angle) * t.len/2);
        ctx.lineTo(t.x + Math.cos(angle) * t.len/2, t.y + Math.sin(angle) * t.len/2);
        ctx.stroke();
        t.x += t.vx; t.y += t.vy;
        if (t.x < -t.len || t.x > w + t.len || t.y < -t.len || t.y > h + t.len) {
          Object.assign(t, makeThread());
          t.x = Math.random() * w; t.y = Math.random() * h;
        }
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(drawThreads);
    }
    drawThreads();
  }

  /* ── Floating Textile Icons ── */
  const icons = ['🧵','🪡','✂️','🧶','📐','🪢'];
  const container = document.getElementById('floatingIcons');
  if (container) {
    for (let i = 0; i < 18; i++) {
      const el = document.createElement('div');
      el.className = 'float-icon';
      el.textContent = icons[Math.floor(Math.random() * icons.length)];
      el.style.cssText = `
        left: ${Math.random() * 100}vw;
        bottom: ${-5 + Math.random() * 10}vh;
        animation-delay: ${Math.random() * 8}s;
        animation-duration: ${7 + Math.random() * 8}s;
        font-size: ${0.8 + Math.random() * 1.2}rem;
      `;
      container.appendChild(el);
    }
  }

  /* ── Scroll Reveal with IntersectionObserver ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  const observer  = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));

  /* ── Counter Animation ── */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '+';
      let start    = 0;
      const step   = target / 60;
      const timer  = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = Math.floor(start) + suffix;
        if (start >= target) clearInterval(timer);
      }, 25);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => {
    el.dataset.suffix = el.closest('.stat-item') ? '+' : '+';
    counterObserver.observe(el);
  });

  /* ── Parallax on Hero Image ── */
  document.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroImg  = document.querySelector('.hero-img-frame img');
    if (heroImg && scrollY < window.innerHeight) {
      heroImg.style.transform = `scale(1.04) translateY(${scrollY * 0.08}px)`;
    }
  });

})();


////////// fabric ka work 

(function () {
  "use strict";

  /* ─────────── Helpers ─────────── */
  const $ = (sel, parent = document) => parent.querySelector(sel);
  const $$ = (sel, parent = document) => parent.querySelectorAll(sel);

  /* ─────────── Custom Cursor ─────────── */
  const dot = $("#cursorDot");
  const ring = $("#cursorRing");

  if (dot && ring) {
    let x = 0, y = 0;

    document.addEventListener("mousemove", (e) => {
      x = e.clientX;
      y = e.clientY;
    });

    function animateCursor() {
      dot.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
      ring.style.transform = `translate(${x - 18}px, ${y - 18}px)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    $$("a, button, .fabric-card").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("hovered"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hovered"));
    });
  }

  /* ─────────── Floating Icons ─────────── */
  const fc = $("#floatingIcons");
  const icons = ["🧵", "🪡", "✂️", "🧶", "📐", "🪢"];

  if (fc) {
    const frag = document.createDocumentFragment();

    for (let i = 0; i < 14; i++) {
      const el = document.createElement("div");
      el.className = "float-icon";
      el.textContent = icons[Math.floor(Math.random() * icons.length)];

      el.style.cssText = `
        left:${Math.random() * 100}vw;
        bottom:${Math.random() * 10 - 5}vh;
        animation-delay:${Math.random() * 9}s;
        animation-duration:${8 + Math.random() * 7}s;
        font-size:${0.7 + Math.random()}rem;
      `;

      frag.appendChild(el);
    }

    fc.appendChild(frag);
  }

  /* ─────────── Scroll Reveal ─────────── */
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    $$(".reveal").forEach((el) => observer.observe(el));
  }

  /* ─────────── Counter ─────────── */
  if ("IntersectionObserver" in window) {
    $$("[data-count]").forEach((el) => {
      const observer = new IntersectionObserver((entries, obs) => {
        if (!entries[0].isIntersecting) return;

        const target = parseInt(el.dataset.count, 10) || 0;
        let current = 0;
        const step = target / 50;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target + "+";
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current) + "+";
          }
        }, 20);

        obs.unobserve(el);
      });

      observer.observe(el);
    });
  }

  /* ─────────── Filter System ─────────── */
  const btns = $$(".filter-btn");
  const cards = $$(".fabric-card[data-category]");
  const countEl = $("#fabricCount");

  if (btns.length && cards.length) {
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        let visible = 0;

        cards.forEach((card) => {
          const match =
            filter === "all" || card.dataset.category === filter;

          card.classList.toggle("hidden", !match);
          if (match) visible++;
        });

        if (countEl) {
          countEl.textContent = `Showing ${visible} fabric${
            visible !== 1 ? "s" : ""
          }`;
        }
      });
    });
  }

  /* ─────────── Grid Toggle ─────────── */
  const grid = $("#fabricsGrid");

  function setGrid(type) {
    if (!grid) return;

    grid.classList.remove("two-col", "one-col");

    if (type === 2) grid.classList.add("two-col");
    if (type === 1) grid.classList.add("one-col");
  }

  function setActive(btn) {
    $$(".grid-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  }

  $("#btn3col")?.addEventListener("click", function () {
    setGrid(3);
    setActive(this);
  });

  $("#btn2col")?.addEventListener("click", function () {
    setGrid(2);
    setActive(this);
  });

  $("#btn1col")?.addEventListener("click", function () {
    setGrid(1);
    setActive(this);
  });

  /* ─────────── Load More ─────────── */
  const loadBtn = $("#loadMoreBtn");

  if (loadBtn) {
    loadBtn.addEventListener("click", function () {
      const span = this.querySelector("span");
      if (span) span.textContent = "✓ All Fabrics Loaded";

      this.disabled = true;
      this.style.opacity = "0.5";
    });
  }

  /* ─────────── Modal ─────────── */
  const modal = $("#modalOverlay");

  window.openModal = function (name, sample = false) {
    $("#modalFabricInput") && ($("#modalFabricInput").value = name);
    $("#modalTitle") && ($("#modalTitle").textContent = name);
    $("#modalMode") &&
      ($("#modalMode").textContent = sample
        ? "Request Free Sample"
        : "Send Bulk Enquiry");

    modal && modal.classList.add("open");
  };

  window.closeModal = function () {
    modal && modal.classList.remove("open");
  };

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === this) window.closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") window.closeModal();
  });
})();


//////dashboard admin ka 

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('mobile-overlay');
            sidebar.classList.toggle('-translate-x-full');
            if (overlay.classList.contains('hidden')) {
                overlay.classList.remove('hidden');
            } else {
                overlay.classList.add('hidden');
            }
        }
