"use strict";

document.documentElement.classList.add("js");

const header = document.getElementById("header");
const progress = document.getElementById("scrollProgress");
const nav = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
const year = document.getElementById("year");
const form = document.getElementById("joinForm");
const errorBox = document.getElementById("formError");
const result = document.getElementById("applicationResult");
const resultText = document.getElementById("applicationText");
const copyButton = document.getElementById("copyApplication");
const copyStatus = document.getElementById("copyStatus");
const startOver = document.getElementById("startOver");
let applicationText = "";
let rafQueued = false;

if (year) year.textContent = new Date().getFullYear();

function refreshScroll() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
  if (progress) progress.style.width = (ratio * 100) + "%";
  if (header) header.classList.toggle("scrolled", window.scrollY > 20);
  rafQueued = false;
}
window.addEventListener("scroll", () => {
  if (rafQueued) return;
  rafQueued = true;
  window.requestAnimationFrame(refreshScroll);
}, { passive: true });
window.addEventListener("resize", refreshScroll, { passive: true });
refreshScroll();

function closeMenu() {
  if (!nav || !menuToggle || !header) return;
  nav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Открыть меню");
  const glyph = menuToggle.querySelector("use");
  if (glyph) glyph.setAttribute("href", "#icon-menu");
  header.classList.remove("nav-open");
  document.body.classList.remove("menu-open");
}
if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const opening = !nav.classList.contains("is-open");
    if (!opening) { closeMenu(); return; }
    nav.classList.add("is-open");
    header.classList.add("nav-open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Закрыть меню");
    const glyph = menuToggle.querySelector("use");
    if (glyph) glyph.setAttribute("href", "#icon-cross");
    document.body.classList.add("menu-open");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeMenu();
      menuToggle.focus();
    }
  });
  document.addEventListener("click", (event) => {
    if (nav.classList.contains("is-open") && !nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
  });
  window.matchMedia("(min-width: 981px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -35px 0px", threshold: 0.08 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

// FAQ: one open item at a time; each remains a native keyboard-accessible <details>.
const faqItems = document.querySelectorAll(".faq-items details");
faqItems.forEach(item => item.addEventListener("toggle", () => {
  if (!item.open) return;
  faqItems.forEach(other => { if (other !== item) other.open = false; });
}));

function valueOf(id) {
  const element = document.getElementById(id);
  return element ? element.value.trim() : "";
}
function showError(message, id) {
  errorBox.hidden = false;
  errorBox.textContent = message;
  const field = document.getElementById(id);
  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.focus();
  }
}
function clearError() {
  errorBox.hidden = true;
  errorBox.textContent = "";
  form.querySelectorAll('[aria-invalid="true"]').forEach(el => el.removeAttribute("aria-invalid"));
}

if (form) {
  form.addEventListener("input", clearError);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();
    const nickname = valueOf("nickname");
    const server = valueOf("server");
    const level = valueOf("level");
    const contact = valueOf("contact");
    const about = valueOf("aboutyou");

    if (nickname.length < 3) return showError("Укажи игровой ник длиной хотя бы 3 символа.", "nickname");
    if (!server) return showError("Укажи сервер Arizona RP, на котором играешь.", "server");
    const numericLevel = Number(level);
    if (!level || !Number.isInteger(numericLevel) || numericLevel < 1 || numericLevel > 1000) {
      return showError("Укажи игровой уровень числом от 1 до 1000.", "level");
    }
    if (contact.length < 3) return showError("Укажи, как с тобой можно связаться.", "contact");

    const clean = str => str.replace(/\s+/g, " ").trim();
    applicationText = [
      "FULLSIZE | ЗАЯВКА НА ВСТУПЛЕНИЕ",
      "",
      "Игровой ник: " + clean(nickname),
      "Сервер Arizona RP: " + clean(server),
      "Уровень: " + numericLevel,
      "Связь: " + clean(contact),
      "О себе: " + (about ? clean(about) : "Не указано"),
      "",
      "Хочу стать частью семьи FULLSIZE."
    ].join("\n");

    resultText.textContent = applicationText;
    form.hidden = true;
    result.hidden = false;
    copyStatus.textContent = "";
    result.querySelector(".result-title").setAttribute("tabindex", "-1");
    result.querySelector(".result-title").focus({ preventScroll: true });
    result.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "center" });
  });
}

async function copyPlainText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try { await navigator.clipboard.writeText(text); return true; } catch (_) { /* use fallback */ }
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  textarea.setAttribute("readonly", "");
  document.body.appendChild(textarea);
  textarea.select();
  let success = false;
  try { success = document.execCommand("copy"); } catch (_) { success = false; }
  textarea.remove();
  return success;
}
if (copyButton) {
  copyButton.addEventListener("click", async () => {
    const copied = await copyPlainText(applicationText);
    copyStatus.textContent = copied
      ? "Заявка скопирована. Теперь передай её представителю семьи."
      : "Не удалось скопировать автоматически. Выдели текст выше и скопируй вручную.";
    const textSpan = copyButton.querySelector("span");
    if (copied && textSpan) textSpan.textContent = "СКОПИРОВАНО";
  });
}
if (startOver) {
  startOver.addEventListener("click", () => {
    result.hidden = true;
    form.hidden = false;
    copyStatus.textContent = "";
    const textSpan = copyButton.querySelector("span");
    if (textSpan) textSpan.textContent = "СКОПИРОВАТЬ ЗАЯВКУ";
    document.getElementById("nickname").focus({ preventScroll: true });
    form.scrollIntoView({ behavior: "smooth", block: "center" });
  });
}