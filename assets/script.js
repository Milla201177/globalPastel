const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const header = document.querySelector("[data-header]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = themeToggle?.querySelector("[data-theme-label]");

const setTheme = (theme, shouldStore = true) => {
  const normalizedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = normalizedTheme;

  if (themeToggle) {
    const isDark = normalizedTheme === "dark";
    const actionLabel = isDark ? "Switch to light theme" : "Switch to dark theme";
    themeToggle.setAttribute("aria-label", actionLabel);
    themeToggle.setAttribute("title", actionLabel);
    themeToggle.classList.toggle("is-dark", isDark);
    if (themeLabel) themeLabel.textContent = isDark ? "Light mode" : "Dark mode";
  }

  if (!shouldStore) return;

  try {
    localStorage.setItem("global-theme", normalizedTheme);
  } catch {
    // Ignore storage errors in private browsing or locked-down contexts.
  }
};

setTheme(document.documentElement.dataset.theme, false);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    navToggle.classList.toggle("is-open", isOpen);
  });
}

const dashboardLinks = document.querySelectorAll(".dashboard-sidebar nav a");

dashboardLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    dashboardLinks.forEach((item) => item.classList.remove("active"));
    link.classList.add("active");
  });
});

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
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("scroll", () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 16);
});
