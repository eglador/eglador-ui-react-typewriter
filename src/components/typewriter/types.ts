/**
 * Lifecycle phases of the typewriter animation.
 *
 * - `idle` — before the start delay elapses or when paused via controls.
 * - `typing` — actively appending characters to the current string.
 * - `pausing` — current string is fully typed; holding before deleting.
 * - `deleting` — actively removing characters.
 * - `done` — non-looping animation has finished its last string.
 */
export type TypewriterPhase =
  | "idle"
  | "typing"
  | "pausing"
  | "deleting"
  | "done";

/** Visual style of the cursor element. */
export type CursorStyle = "line" | "block" | "underscore";

/** Cursor blink behavior.
 *
 * - `smooth` — opacity fades (default, mirrors `animate-pulse`).
 * - `hard` — instant on/off, traditional terminal cursor feel.
 * - `none` — always visible.
 */
export type CursorBlink = "smooth" | "hard" | "none";

/** How to clear the current string before typing the next.
 *
 * - `backspace` — delete one character at a time at `deletingSpeed`.
 * - `clear` — wipe instantly (no deletion animation).
 * - `smart` — keep the longest common prefix with the next string,
 *   delete only the differing suffix, then type the new suffix
 *   (Notion / Apple landing-page pattern).
 */
export type DeleteMode = "backspace" | "clear" | "smart";

/**
 * One item in the typewriter sequence. Each item carries the text plus
 * optional per-item overrides — so individual strings can be slower,
 * faster, or pause longer than the surrounding sequence.
 */
export interface TypewriterItem {
  /** The string to type. */
  text: string;
  /** Override the parent's `typingSpeed` for this item only. */
  typingSpeed?: number;
  /** Override the parent's `deletingSpeed` for this item only. */
  deletingSpeed?: number;
  /** Override the parent's `pauseDuration` for this item only. */
  pauseDuration?: number;
}

export interface TypewriterControls {
  /** Resume animation after `pause()`. No-op if not paused. */
  play: () => void;
  /** Pause in the current phase, preserving displayed text. */
  pause: () => void;
  /** Stop, clear text, jump back to the first item and re-arm. */
  reset: () => void;
  /** Skip immediately to the end of the current item and start pausing. */
  skip: () => void;
}

export interface TypewriterCallbacks {
  /** Fires when the current item reaches its full length. */
  onType?: (text: string, index: number) => void;
  /** Fires after every text or phase change — use sparingly (high frequency). */
  onChange?: (text: string, phase: TypewriterPhase) => void;
  /** Fires after a full pass through items (only when `loop` is `true`). */
  onLoop?: (loopCount: number) => void;
  /** Fires after the last item finishes (only when `loop` is `false`). */
  onComplete?: () => void;
}

/**
 * Timing / behavior options shared between the headless hook and the
 * `<Typewriter>` component. Per-item values on a `TypewriterItem`
 * override these defaults for the duration of that item.
 */
export interface TypewriterTimingOptions {
  /** Milliseconds per typed character (default `60`). */
  typingSpeed?: number;
  /** Milliseconds per deleted character (default `30`). */
  deletingSpeed?: number;
  /** Milliseconds to hold a completed string before deleting (default `2000`). */
  pauseDuration?: number;
  /** Milliseconds to wait before the very first keystroke (default `0`). */
  startDelay?: number;
  /**
   * Random ± jitter applied to every character delay so typing feels
   * natural (default `0.3` = 30% of the base speed). Set to `0` for
   * perfectly steady typing.
   */
  variance?: number;
  /**
   * Extra delay (ms) inserted after typing the given character —
   * commonly used for `.`, `,`, `!`, `?`. Empty by default.
   *
   * @example { ".": 600, ",": 250 }
   */
  punctuationDelays?: Record<string, number>;
  /** How to clear text between items (default `"backspace"`). */
  deleteMode?: DeleteMode;
  /** Cycle through items indefinitely (default `true`). */
  loop?: boolean;
  /** Begin animation on mount (default `true`). Set `false` to drive
   *  the animation imperatively via controls. */
  autoStart?: boolean;
  /** Honor `prefers-reduced-motion: reduce` — render the final item
   *  instantly with no animation or cursor (default `true`). */
  respectReducedMotion?: boolean;
}

/**
 * Options accepted by the headless `useTypewriter` hook. Items are
 * passed as an array (use the compound `<Typewriter.Item>` API on the
 * component side instead).
 */
export interface UseTypewriterOptions
  extends TypewriterTimingOptions,
    TypewriterCallbacks {
  /**
   * Items to type. Plain strings are shorthand for `{ text: "..." }`.
   * Objects allow per-item timing overrides.
   *
   * @example
   * ["First", "Second"]
   * [{ text: "First" }, { text: "Second", typingSpeed: 100 }]
   */
  items: ReadonlyArray<string | TypewriterItem>;
}
