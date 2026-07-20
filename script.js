gsap.registerPlugin(ScrollTrigger);

/* LOADER */
window.addEventListener("load", function () {
  setTimeout(function () {
    document.getElementById("loader").classList.add("hide");
  }, 1800);
});

/* CURSOR */
var cursor = document.getElementById("cursor");
var cursorRing = document.getElementById("cursor-ring");
var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
var ringPos = { x: mouse.x, y: mouse.y };
var activeMagnet = null;

document.addEventListener("mousemove", function (e) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  gsap.to(cursor, {
    x: mouse.x,
    y: mouse.y,
    duration: 0.08,
    overwrite: "auto",
  });
});

gsap.ticker.add(function () {
  if (activeMagnet) {
    var rect = activeMagnet.getBoundingClientRect();
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    ringPos.x += (cx - ringPos.x) * 0.22;
    ringPos.y += (cy - ringPos.y) * 0.22;
    gsap.set(cursorRing, { x: ringPos.x, y: ringPos.y });
  } else {
    ringPos.x += (mouse.x - ringPos.x) * 0.15;
    ringPos.y += (mouse.y - ringPos.y) * 0.15;
    gsap.set(cursorRing, {
      x: ringPos.x,
      y: ringPos.y,
      width: 40,
      height: 40,
      borderRadius: "50%",
      borderColor: "rgba(0, 122, 255, 0.4)",
      backgroundColor: "transparent",
    });
  }
});

var interactives = document.querySelectorAll(
  "a, button, .stat-card, .skill-card, .project-card, .contact-card, .nav-links a, .nav-cta, .btn-primary, .btn-secondary, .contact-social a, .hero-cta-secondary",
);
interactives.forEach(function (el) {
  el.addEventListener("mouseenter", function () {
    activeMagnet = el;
    var rect = el.getBoundingClientRect();
    var isCard =
      el.classList.contains("skill-card") ||
      el.classList.contains("project-card") ||
      el.classList.contains("contact-card");
    gsap.to(cursorRing, {
      width: rect.width + (isCard ? 20 : 12),
      height: rect.height + (isCard ? 20 : 12),
      borderRadius: window.getComputedStyle(el).borderRadius || "8px",
      borderColor: "var(--cyan)",
      backgroundColor: "rgba(0, 122, 255, 0.03)",
      duration: 0.35,
      ease: "power3.out",
    });
    gsap.to(cursor, {
      scale: 2.2,
      backgroundColor: "var(--orange)",
      duration: 0.3,
    });
  });
  el.addEventListener("mouseleave", function () {
    activeMagnet = null;
    gsap.to(cursorRing, {
      width: 40,
      height: 40,
      borderRadius: "50%",
      borderColor: "rgba(0, 122, 255, 0.4)",
      backgroundColor: "transparent",
      duration: 0.35,
      ease: "power3.out",
    });
    gsap.to(cursor, {
      scale: 1,
      backgroundColor: "var(--cyan)",
      duration: 0.3,
    });
  });
});

/* NAVBAR SCROLL */
var navbar = document.getElementById("navbar");
window.addEventListener(
  "scroll",
  function () {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  },
  { passive: true },
);

/* PARTICLES CANVAS */
(function () {
  var canvas = document.getElementById("particles");
  var ctx = canvas.getContext("2d");
  var W,
    H,
    particles = [];
  var NUM = 55;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  for (var i = 0; i < NUM; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r: Math.random() * 2 + 1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(function (p) {
      var dx = p.x - mouse.x;
      var dy = p.y - mouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160) {
        var force = (160 - dist) / 160;
        var angle = Math.atan2(dy, dx);
        p.vx += Math.cos(angle) * force * 0.45;
        p.vy += Math.sin(angle) * force * 0.45;
      }
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle =
        dist < 160
          ? "rgba(0, 122, 255, " + (0.4 + (1 - dist / 160) * 0.55) + ")"
          : "rgba(0, 122, 255, 0.25)";
      ctx.fill();
    });
    for (var i = 0; i < NUM; i++) {
      for (var j = i + 1; j < NUM; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "rgba(0, 122, 255, " + 0.1 * (1 - dist / 110) + ")";
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* SCROLL REVEALS */
gsap.fromTo(
  ".reveal",
  { opacity: 0, y: 45 },
  {
    scrollTrigger: {
      trigger: "body",
      start: "top 82%",
      toggleActions: "play none none none",
    },
    opacity: 1,
    y: 0,
    duration: 0.85,
    stagger: 0.08,
    ease: "power2.out",
  },
);

gsap.fromTo(
  ".skill-card",
  { opacity: 0, y: 50, scale: 0.9 },
  {
    scrollTrigger: { trigger: "#skills", start: "top 78%" },
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.12,
    duration: 0.8,
    ease: "back.out(1.2)",
  },
);

gsap.fromTo(
  ".project-card",
  { opacity: 0, y: 40 },
  {
    scrollTrigger: { trigger: "#projects", start: "top 80%" },
    opacity: 1,
    y: 0,
    stagger: 0.12,
    duration: 0.7,
    ease: "power2.out",
  },
);

gsap.fromTo(
  ".timeline-item",
  { opacity: 0, x: -30 },
  {
    scrollTrigger: { trigger: "#experience", start: "top 80%" },
    opacity: 1,
    x: 0,
    stagger: 0.1,
    duration: 0.6,
    ease: "power2.out",
  },
);

gsap.fromTo(
  ".contact-card",
  { opacity: 0, y: 30, scale: 0.95 },
  {
    scrollTrigger: { trigger: "#contact", start: "top 80%" },
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.1,
    duration: 0.6,
    ease: "back.out(1.2)",
  },
);

gsap.fromTo(
  ".formation-card",
  { opacity: 0, y: 40, scale: 0.95 },
  {
    scrollTrigger: { trigger: "#formation", start: "top 80%" },
    opacity: 1,
    y: 0,
    scale: 1,
    stagger: 0.12,
    duration: 0.7,
    ease: "back.out(1.2)",
  },
);

/* COUNTER ANIMATION */
function animateCounters() {
  var counters = document.querySelectorAll("[data-target]");
  counters.forEach(function (el) {
    var target = parseInt(el.dataset.target);
    var suffix = el.dataset.suffix || "";
    var obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.0,
      ease: "power3.out",
      onUpdate: function () {
        el.textContent = Math.floor(obj.val) + suffix;
      },
    });
  });
}
setTimeout(animateCounters, 500);

/* TYPEWRITER */
var phrases = [
  "API REST & WebSocket",
  "Symfony, Laravel, Node.js",
  "React & Express.js",
  "Developpeur Web Backend",
];
var pi = 0,
  ci = 0,
  deleting = false;
var tw = document.getElementById("typewriter-text");

function typewrite() {
  var phrase = phrases[pi];
  if (!deleting && ci <= phrase.length) {
    tw.textContent = phrase.slice(0, ci++);
    setTimeout(typewrite, 55);
  } else if (!deleting && ci > phrase.length) {
    deleting = true;
    setTimeout(typewrite, 1800);
  } else if (deleting && ci > 0) {
    tw.textContent = phrase.slice(0, ci--);
    setTimeout(typewrite, 30);
  } else {
    deleting = false;
    pi = (pi + 1) % phrases.length;
    setTimeout(typewrite, 400);
  }
}
setTimeout(typewrite, 2400);

/* DARK MODE TOGGLE */
(function () {
  var toggle = document.getElementById("theme-toggle");
  var stored = localStorage.getItem("theme");
  if (stored) {
    document.documentElement.setAttribute("data-theme", stored);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
  toggle.addEventListener("click", function () {
    var current = document.documentElement.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
})();

/* MOBILE MENU */
(function () {
  var openBtn = document.getElementById("mobile-menu-open");
  var closeBtn = document.getElementById("mobile-menu-close");
  var menu = document.getElementById("mobile-menu");
  var links = menu.querySelectorAll(".mobile-nav-link, .mobile-nav-cta");

  openBtn.addEventListener("click", function () {
    menu.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  closeBtn.addEventListener("click", function () {
    menu.classList.remove("open");
    document.body.style.overflow = "";
  });

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
})();

/* NEWSLETTER FORM */
(function () {
  var form = document.getElementById("newsletter-form");
  var msg = document.getElementById("newsletter-msg");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = form.querySelector("input[type='email']");
    if (!email || !email.value) {
      msg.textContent = "Veuillez entrer votre email.";
      msg.style.color = "#FF3B30";
      return;
    }
    msg.textContent = "Merci ! Vous serez notifie des prochains projets.";
    msg.style.color = "#34C759";
    email.value = "";
  });
})();
