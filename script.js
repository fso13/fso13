document.getElementById("year").textContent = String(new Date().getFullYear());

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const statuses = [
  "compiling excuses…",
  "refactoring in production*",
  "* just kidding. mostly.",
  "kafka lag: under control",
  "plugins loading… ████░░",
  "code review: approved ✓",
  "nullPointerException not found",
  "sudo make coffee",
];

const statusEl = document.getElementById("status-text");
let statusIndex = 0;

if (statusEl) {
  window.setInterval(() => {
    statusIndex = (statusIndex + 1) % statuses.length;
    statusEl.classList.add("is-swap");
    window.setTimeout(() => {
      statusEl.textContent = statuses[statusIndex];
      statusEl.classList.remove("is-swap");
    }, 180);
  }, 2800);
}

const toast = document.getElementById("toast");
const logo = document.querySelector(".logo");
const SECRET_CLICKS = 13;
let clicks = 0;

const toasts = [
  "🦇 Welcome to the dark side of backend",
  "404: boring portfolio not found",
  "git commit -m \"hire me\"",
  "Stack: Java, Kotlin, vibes",
];

function showToast(message) {
  if (!toast) return;
  toast.hidden = false;
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast._timer);
  showToast._timer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => {
      toast.hidden = true;
    }, 280);
  }, 2400);
}

if (logo) {
  logo.addEventListener("click", (event) => {
    event.preventDefault();
    clicks += 1;

    if (clicks >= SECRET_CLICKS) {
      clicks = 0;
      showToast("arcade unlocked: pong.exe");
      if (window.PongGame) window.PongGame.open();
      return;
    }

    if (clicks === 1) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (clicks === 1 || clicks % 4 === 0) {
      const message = toasts[Math.floor(Math.random() * toasts.length)];
      showToast(message);
      document.body.classList.add("is-party");
      window.setTimeout(() => document.body.classList.remove("is-party"), 900);
    }
  });
}

const name = document.querySelector(".hero-name");
if (name) {
  name.addEventListener("mouseenter", () => name.classList.add("is-glitch"));
  name.addEventListener("mouseleave", () => name.classList.remove("is-glitch"));
}
