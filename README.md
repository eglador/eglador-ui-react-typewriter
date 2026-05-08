<img src=".github/eglador-logo.svg" alt="eglador-ui-react-typewriter" width="200" />

# eglador-ui-react-typewriter

[![npm version](https://img.shields.io/npm/v/eglador-ui-react-typewriter?style=flat-square&color=blue)](https://www.npmjs.com/package/eglador-ui-react-typewriter)
[![npm downloads](https://img.shields.io/npm/dm/eglador-ui-react-typewriter?style=flat-square&color=green)](https://www.npmjs.com/package/eglador-ui-react-typewriter)
[![license](https://img.shields.io/npm/l/eglador-ui-react-typewriter?style=flat-square)](https://github.com/eglador/eglador-ui-react-typewriter/blob/main/LICENSE)
![zero runtime deps](https://img.shields.io/badge/zero%20deps-runtime-22C55E?style=flat-square)
![tailwind v4](https://img.shields.io/badge/tailwindcss-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![react >= 18](https://img.shields.io/badge/react-%3E%3D18-61DAFB?style=flat-square&logo=react&logoColor=white)
![typescript](https://img.shields.io/badge/typescript-ready-3178C6?style=flat-square&logo=typescript&logoColor=white)

A modern typewriter animation for React — smart backspace, natural typing variance, punctuation pauses, imperative controls, and a fully headless `useTypewriter` hook. Styled with **Tailwind CSS v4**.

## Features

- **Compound API** — `<Typewriter>` + `<Typewriter.Item>` (Radix / shadcn pattern), per-item `className` / `style` / timing overrides
- **Multi-string rotation** — cycle through any number of items, with `loop` on/off
- **Smart backspace** — `deleteMode="smart"` keeps the common prefix with the next string, only retypes the differing suffix (Apple landing-page pattern)
- **Natural typing rhythm** — `variance` adds ± jitter to every character delay; `punctuationDelays` adds extra pauses after `.` `,` `!` `?` etc.
- **Imperative controls** — `play()` / `pause()` / `reset()` / `skip()` via `controlsRef`
- **Lifecycle callbacks** — `onType`, `onChange`, `onLoop`, `onComplete`
- **Cursor styles** — `line` / `block` / `underscore` × `smooth` / `hard` / `none` blink, or override with any custom character
- **Render-prop API** — pass a function as `children` for fully custom rendering
- **Headless `useTypewriter` hook** — same animation logic, no UI
- **Accessible** — `role="text"` + `aria-label` joins all strings so screen readers get the full content once instead of character-by-character
- **Reduced-motion friendly** — honors `prefers-reduced-motion: reduce` automatically
- **SSR safe** — empty render on server, animation begins on client mount
- **TypeScript-first** — full type safety, every prop documented inline
- **Zero runtime dependencies** — only `clsx` + `tailwind-merge`, both pre-bundled

## Installation

```bash
npm install eglador-ui-react-typewriter
```

**Peer dependencies:** `react >= 18` · `react-dom >= 18` · `tailwindcss ^4`

## Setup

Add the following to your global stylesheet so Tailwind picks up the component classes:

```css
@import "tailwindcss";
@source "../node_modules/eglador-ui-react-typewriter";
```

The `@source` path is relative to the CSS file location:

| Framework | CSS file location | Path |
|---|---|---|
| Next.js (App Router) | `app/globals.css` | `../node_modules/eglador-ui-react-typewriter` |
| Next.js (`src/`) | `src/app/globals.css` | `../../node_modules/eglador-ui-react-typewriter` |
| Vite | `src/index.css` | `../node_modules/eglador-ui-react-typewriter` |

## Quick Start

```tsx
"use client";

import { Typewriter } from "eglador-ui-react-typewriter";

export function Hero() {
  return (
    <h1 className="text-5xl font-bold">
      We{" "}
      <Typewriter deleteMode="smart" className="text-blue-600">
        <Typewriter.Item>build.</Typewriter.Item>
        <Typewriter.Item>design.</Typewriter.Item>
        <Typewriter.Item>ship.</Typewriter.Item>
      </Typewriter>
    </h1>
  );
}
```

For a single string, plain text children works too:

```tsx
<Typewriter>Hello, world.</Typewriter>
```

Each `Typewriter.Item` can override timing for itself:

```tsx
<Typewriter typingSpeed={60}>
  <Typewriter.Item>Normal speed.</Typewriter.Item>
  <Typewriter.Item typingSpeed={150} pauseDuration={3000}>
    Slow this one down.
  </Typewriter.Item>
  <Typewriter.Item>Back to normal.</Typewriter.Item>
</Typewriter>
```

## API

### Exports

| Export | Purpose |
|---|---|
| `Typewriter` | Opinionated compound component — types one or more strings with a configurable cursor |
| `Typewriter.Item` | Marker subcomponent representing one string — supports per-item `className`, `style`, and timing overrides |
| `TypewriterCursor` | Standalone blinking cursor (line / block / underscore + smooth / hard / none) |
| `useTypewriter()` | Headless hook — same animation logic, no UI |
| `ensureCursorStyles()` | Inject cursor blink keyframes into `<head>` (auto-called by the component) |

### `Typewriter` props

| Prop | Type | Default | Description |
|---|---|---|---|
| `children` | `ReactNode` | — | `<Typewriter.Item>` elements, or a plain string (single-item shorthand) |
| `typingSpeed` | `number` | `60` | Milliseconds per typed character |
| `deletingSpeed` | `number` | `30` | Milliseconds per deleted character |
| `pauseDuration` | `number` | `2000` | Hold duration on a completed string before deleting |
| `startDelay` | `number` | `0` | Wait before the first character |
| `variance` | `number` | `0.3` | ± jitter applied to every character delay (0 = steady) |
| `punctuationDelays` | `Record<string, number>` | `{}` | Extra delay (ms) after typing each character |
| `deleteMode` | `"backspace" \| "clear" \| "smart"` | `"backspace"` | How to clear text between strings |
| `loop` | `boolean` | `true` | Cycle through items indefinitely |
| `autoStart` | `boolean` | `true` | Animate on mount (set `false` to drive via controls) |
| `respectReducedMotion` | `boolean` | `true` | Honor `prefers-reduced-motion: reduce` |
| `cursor` | `boolean` | `true` | Show the blinking cursor |
| `cursorStyle` | `"line" \| "block" \| "underscore"` | `"line"` | Visual variant of the cursor |
| `cursorBlink` | `"smooth" \| "hard" \| "none"` | `"smooth"` | Blink behavior |
| `cursorChar` | `string` | — | Override geometric cursor with a custom character |
| `cursorClassName` | `string` | — | Extra className for the cursor |
| `hideCursorWhenDone` | `boolean` | `false` | Hide the cursor when animation finishes (only meaningful when `loop` is `false`) |
| `controlsRef` | `Ref<TypewriterControls>` | — | Imperative controls (`play`, `pause`, `reset`, `skip`) |
| `className` | `string` | — | Class on the wrapping element |
| `ariaLabel` | `string \| null` | joined items | Custom screen-reader label, or `null` to disable |
| `render` | `(state) => ReactNode` | — | Render-prop override; receives `{ text, phase, index, loopCount, cursor, item }` |
| `onType` | `(text, index) => void` | — | Fires when the current string reaches its full length |
| `onChange` | `(text, phase) => void` | — | Fires on every text/phase change (high frequency) |
| `onLoop` | `(loopCount) => void` | — | Fires after each pass through items |
| `onComplete` | `() => void` | — | Fires after the last string when `loop` is `false` |

### `Typewriter.Item` props

| Prop | Type | Description |
|---|---|---|
| `children` | `string` | The text this item types out |
| `className` | `string` | Class applied to the live text while this item is active |
| `style` | `React.CSSProperties` | Inline style applied to the live text while this item is active |
| `typingSpeed` | `number` | Override parent's `typingSpeed` for this item |
| `deletingSpeed` | `number` | Override parent's `deletingSpeed` for this item |
| `pauseDuration` | `number` | Override parent's `pauseDuration` for this item |

### `useTypewriter(options)` returns

| Field | Type | Description |
|---|---|---|
| `text` | `string` | Currently displayed text |
| `phase` | `TypewriterPhase` | `"idle"` / `"typing"` / `"pausing"` / `"deleting"` / `"done"` |
| `index` | `number` | Active string index |
| `loopCount` | `number` | Completed loop count |
| `isPaused` | `boolean` | Whether `pause()` was called |
| `isDone` | `boolean` | `phase === "done"` |
| `controls` | `TypewriterControls` | `{ play, pause, reset, skip }` |

### Types

```ts
type TypewriterPhase = "idle" | "typing" | "pausing" | "deleting" | "done";
type CursorStyle = "line" | "block" | "underscore";
type CursorBlink = "smooth" | "hard" | "none";
type DeleteMode = "backspace" | "clear" | "smart";

interface TypewriterControls {
  play: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
}
```

## Recipes

### Smart backspace

```tsx
<Typewriter deleteMode="smart">
  <Typewriter.Item>I love React</Typewriter.Item>
  <Typewriter.Item>I love Tailwind</Typewriter.Item>
  <Typewriter.Item>I love TypeScript</Typewriter.Item>
</Typewriter>
```

### Per-item timing

```tsx
<Typewriter typingSpeed={60} pauseDuration={1500}>
  <Typewriter.Item>Normal speed.</Typewriter.Item>
  <Typewriter.Item typingSpeed={150} pauseDuration={3000}>
    Slow… and a long pause.
  </Typewriter.Item>
  <Typewriter.Item typingSpeed={20}>And blazing fast!</Typewriter.Item>
</Typewriter>
```

### Per-item styling

```tsx
<Typewriter className="text-3xl font-semibold" deleteMode="smart">
  <Typewriter.Item className="text-blue-600">Build with React.</Typewriter.Item>
  <Typewriter.Item className="text-cyan-500">Style with Tailwind.</Typewriter.Item>
  <Typewriter.Item
    className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent"
  >
    Ship faster.
  </Typewriter.Item>
</Typewriter>
```

### Natural typing rhythm

```tsx
<Typewriter
  variance={0.5}
  punctuationDelays={{ ".": 600, "!": 600, "?": 600, ",": 250 }}
>
  <Typewriter.Item>Hello, world. This feels natural, doesn't it?</Typewriter.Item>
</Typewriter>
```

### Terminal-style block cursor

```tsx
<Typewriter
  cursorStyle="block"
  cursorBlink="hard"
  className="font-mono text-emerald-500"
>
  <Typewriter.Item>$ npm install eglador-ui-react-typewriter</Typewriter.Item>
</Typewriter>
```

### Imperative controls

```tsx
import { useRef } from "react";
import { Typewriter, type TypewriterControls } from "eglador-ui-react-typewriter";

const controls = useRef<TypewriterControls>(null);

<Typewriter autoStart={false} controlsRef={controls}>
  <Typewriter.Item>Hello</Typewriter.Item>
</Typewriter>

<button onClick={() => controls.current?.play()}>Start</button>
<button onClick={() => controls.current?.pause()}>Pause</button>
<button onClick={() => controls.current?.skip()}>Skip</button>
<button onClick={() => controls.current?.reset()}>Reset</button>
```

### Headless hook

```tsx
import { useTypewriter, TypewriterCursor } from "eglador-ui-react-typewriter";

function Hero() {
  const { text } = useTypewriter({
    items: [
      "First",
      { text: "Second", typingSpeed: 100 },
    ],
    deleteMode: "smart",
  });
  return (
    <h1>
      {text}
      <TypewriterCursor variant="block" blink="hard" />
    </h1>
  );
}
```

### Render-prop

```tsx
<Typewriter
  render={({ text, cursor, item }) => (
    <h1 className={item?.className} style={item?.style}>
      {text}
      <span className="text-zinc-900">{cursor}</span>
    </h1>
  )}
>
  <Typewriter.Item className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
    Compose freely
  </Typewriter.Item>
</Typewriter>
```

## Compatibility

Works with any React-based framework: **Next.js**, **Remix**, **Vite + React**, **Gatsby**, etc.

The component is marked `"use client"` (it uses `useState` / `useEffect`). On the server it renders empty; the animation begins on client mount. Place it inside a client component when using Next.js App Router.

## Development

```bash
npm install
npm run dev               # tsup watch mode
npm run build             # production build to dist/
npm run typecheck         # tsc --noEmit
npm run storybook         # Storybook dev (http://localhost:6006)
npm run build-storybook   # static Storybook export
```

## Publishing

Publishing is automated via GitHub Actions. When a GitHub Release is created, the package is published to npm.

1. Update `version` in `package.json`
2. Commit and push
3. Create a GitHub Release with a matching tag (e.g. `v1.0.0`)

## Author

Kenan Gündoğan — [https://github.com/kenangundogan](https://github.com/kenangundogan)

Maintained under [Eglador](https://github.com/eglador)

## License

MIT
