"use client";

const STYLE_ID = "eglador-typewriter-cursor-styles";

const STYLES = `
@keyframes eglador-tw-blink-hard {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
.eglador-tw-blink-hard {
  animation: eglador-tw-blink-hard 1s steps(2, end) infinite;
}
.eglador-tw-blink-smooth {
  animation: eglador-tw-blink-smooth 1.05s ease-in-out infinite;
}
@keyframes eglador-tw-blink-smooth {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
`;

/**
 * Injects the cursor blink keyframes into `<head>` once per page.
 * Library-friendly — consumers don't need to import a CSS file or
 * configure Tailwind's `@theme` keyframes block.
 */
export function ensureCursorStyles(): void {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = STYLES;
  document.head.appendChild(el);
}
