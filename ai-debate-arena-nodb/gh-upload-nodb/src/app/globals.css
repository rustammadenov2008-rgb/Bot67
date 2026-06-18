@import "tailwindcss";

:root {
  --color-ink: #15171c;
  --color-panel: #1c1f26;
  --color-panel-raised: #232730;
  --color-line: #30343e;
  --color-text: #e8e6e1;
  --color-text-dim: #8b8f98;

  --color-gemini: #5b7fff;
  --color-gemini-dim: #2e3f80;
  --color-grok: #e8eaed;
  --color-grok-dim: #4a4d54;
  --color-gold: #e8b34c;
}

@theme inline {
  --color-ink: var(--color-ink);
  --color-panel: var(--color-panel);
  --color-panel-raised: var(--color-panel-raised);
  --color-line: var(--color-line);
  --color-text: var(--color-text);
  --color-text-dim: var(--color-text-dim);
  --color-gemini: var(--color-gemini);
  --color-gemini-dim: var(--color-gemini-dim);
  --color-grok: var(--color-grok);
  --color-grok-dim: var(--color-grok-dim);
  --color-gold: var(--color-gold);
  --font-display: var(--font-unbounded);
  --font-body: var(--font-inter);
  --font-mono: var(--font-jetbrains-mono);
}

* {
  box-sizing: border-box;
}

body {
  background: var(--color-ink);
  color: var(--color-text);
  font-family: var(--font-body), -apple-system, sans-serif;
  background-image:
    radial-gradient(circle at 15% 10%, rgba(91, 127, 255, 0.08), transparent 40%),
    radial-gradient(circle at 85% 90%, rgba(232, 234, 237, 0.05), transparent 40%);
}

::selection {
  background: var(--color-gold);
  color: var(--color-ink);
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

.pulse-dot {
  animation: pulse-dot 1.4s ease-in-out infinite;
}

@keyframes slide-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-enter {
  animation: slide-up 0.35s ease-out;
}

@media (prefers-reduced-motion: reduce) {
  .pulse-dot, .message-enter {
    animation: none;
  }
}

textarea, input {
  background: var(--color-panel-raised);
  border: 1px solid var(--color-line);
  border-radius: 8px;
  padding: 8px 12px;
  color: var(--color-text);
  font-family: var(--font-body), sans-serif;
  outline: none;
  transition: border-color 0.15s;
}

textarea:focus, input:focus {
  border-color: var(--color-gold);
}

textarea::placeholder, input::placeholder {
  color: var(--color-text-dim);
}
