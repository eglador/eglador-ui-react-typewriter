"use client";

import * as React from "react";
import type {
  TypewriterControls,
  TypewriterItem,
  TypewriterPhase,
  UseTypewriterOptions,
} from "./types";

const DEFAULTS = {
  typingSpeed: 60,
  deletingSpeed: 30,
  pauseDuration: 2000,
  startDelay: 0,
  variance: 0.3,
  loop: true,
  autoStart: true,
  respectReducedMotion: true,
} as const;

const EMPTY_PUNCT: Record<string, number> = {};

function commonPrefixLength(a: string, b: string): number {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) return i;
  }
  return len;
}

function withVariance(base: number, variance: number): number {
  if (variance <= 0) return base;
  const jitter = base * variance;
  return Math.max(0, base + (Math.random() * 2 - 1) * jitter);
}

function usePrefersReducedMotion(enabled: boolean): boolean {
  const [prefers, setPrefers] = React.useState(false);
  React.useEffect(() => {
    if (!enabled || typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefers(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefers(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [enabled]);
  return prefers;
}

/** Coerce string shorthand into the object form so the rest of the
 *  hook can treat every item uniformly. */
function normalizeItems(
  raw: ReadonlyArray<string | TypewriterItem>,
): TypewriterItem[] {
  return raw.map((item) =>
    typeof item === "string" ? { text: item } : item,
  );
}

export interface UseTypewriterReturn {
  /** Currently displayed text. */
  text: string;
  /** Current animation phase. */
  phase: TypewriterPhase;
  /** Index of the active item. */
  index: number;
  /** Number of completed cycles through the items list. */
  loopCount: number;
  /** Whether `pause()` was called and `play()` hasn't resumed yet. */
  isPaused: boolean;
  /** Convenience flag — `phase === "done"`. */
  isDone: boolean;
  /** Imperative control surface. */
  controls: TypewriterControls;
}

/**
 * Headless typewriter — produces the live text and phase, no UI.
 * Compose your own rendering on top, or use `<Typewriter>` for the
 * default presentation.
 */
export function useTypewriter(
  options: UseTypewriterOptions,
): UseTypewriterReturn {
  const {
    items,
    typingSpeed = DEFAULTS.typingSpeed,
    deletingSpeed = DEFAULTS.deletingSpeed,
    pauseDuration = DEFAULTS.pauseDuration,
    startDelay = DEFAULTS.startDelay,
    variance = DEFAULTS.variance,
    punctuationDelays = EMPTY_PUNCT,
    deleteMode = "backspace",
    loop = DEFAULTS.loop,
    autoStart = DEFAULTS.autoStart,
    respectReducedMotion = DEFAULTS.respectReducedMotion,
    onType,
    onChange,
    onLoop,
    onComplete,
  } = options;

  const list = React.useMemo<TypewriterItem[]>(
    () => normalizeItems(items),
    [items],
  );

  const reducedMotion = usePrefersReducedMotion(respectReducedMotion);

  const [text, setText] = React.useState("");
  const [phase, setPhase] = React.useState<TypewriterPhase>("idle");
  const [index, setIndex] = React.useState(0);
  const [loopCount, setLoopCount] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  // Stable refs for callbacks so we don't re-run the tick effect on every
  // parent render. Always read the latest version via `.current`.
  const cbRef = React.useRef({ onType, onChange, onLoop, onComplete });
  cbRef.current = { onType, onChange, onLoop, onComplete };

  // Reduced-motion shortcut — show the last item's text and freeze.
  React.useEffect(() => {
    if (!reducedMotion) return;
    const last = list[list.length - 1]?.text ?? "";
    setText(last);
    setPhase("done");
  }, [reducedMotion, list]);

  // Auto-start — leave `idle` after `startDelay`. Re-armed by `reset()`.
  React.useEffect(() => {
    if (reducedMotion) return;
    if (phase !== "idle" || !autoStart || isPaused) return;
    if (startDelay <= 0) {
      setPhase("typing");
      return;
    }
    const id = window.setTimeout(() => setPhase("typing"), startDelay);
    return () => window.clearTimeout(id);
  }, [phase, startDelay, autoStart, isPaused, reducedMotion]);

  // Emit onChange for every text/phase delta. Skipped under reduced motion
  // where the animation is frozen.
  React.useEffect(() => {
    if (reducedMotion) return;
    cbRef.current.onChange?.(text, phase);
  }, [text, phase, reducedMotion]);

  // Main tick — schedules the next character / phase transition.
  React.useEffect(() => {
    if (reducedMotion || isPaused) return;
    if (phase === "idle" || phase === "done") return;
    if (list.length === 0) return;

    const currentItem = list[index] ?? { text: "" };
    const current = currentItem.text;

    // Per-item overrides fall back to the parent-level values.
    const itemTypingSpeed = currentItem.typingSpeed ?? typingSpeed;
    const itemDeletingSpeed = currentItem.deletingSpeed ?? deletingSpeed;
    const itemPauseDuration = currentItem.pauseDuration ?? pauseDuration;

    if (phase === "typing") {
      if (text.length < current.length) {
        const lastChar = text[text.length - 1];
        let delay = withVariance(itemTypingSpeed, variance);
        if (lastChar && punctuationDelays[lastChar]) {
          delay += punctuationDelays[lastChar];
        }
        const id = window.setTimeout(
          () => setText(current.slice(0, text.length + 1)),
          delay,
        );
        return () => window.clearTimeout(id);
      }
      // Reached full length — fire callback, transition.
      cbRef.current.onType?.(current, index);
      if (!loop && index === list.length - 1) {
        setPhase("done");
        cbRef.current.onComplete?.();
        return;
      }
      setPhase("pausing");
      return;
    }

    if (phase === "pausing") {
      const id = window.setTimeout(
        () => setPhase("deleting"),
        itemPauseDuration,
      );
      return () => window.clearTimeout(id);
    }

    if (phase === "deleting") {
      const nextIndex = (index + 1) % list.length;
      const wrapping = nextIndex === 0 && index === list.length - 1;
      const advance = () => {
        if (wrapping) {
          setLoopCount((c) => {
            const nextCount = c + 1;
            cbRef.current.onLoop?.(nextCount);
            return nextCount;
          });
        }
        setIndex(nextIndex);
        setPhase("typing");
      };

      if (deleteMode === "clear") {
        setText("");
        advance();
        return;
      }

      const targetLength =
        deleteMode === "smart"
          ? commonPrefixLength(current, list[nextIndex]?.text ?? "")
          : 0;

      if (text.length > targetLength) {
        const id = window.setTimeout(
          () => setText(text.slice(0, -1)),
          withVariance(itemDeletingSpeed, variance),
        );
        return () => window.clearTimeout(id);
      }

      advance();
      return;
    }
  }, [
    text,
    phase,
    index,
    list,
    isPaused,
    reducedMotion,
    loop,
    deleteMode,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    variance,
    punctuationDelays,
  ]);

  // Imperative controls. Memoized so consumers can use them in deps.
  const controls = React.useMemo<TypewriterControls>(
    () => ({
      play: () => setIsPaused(false),
      pause: () => setIsPaused(true),
      reset: () => {
        setText("");
        setIndex(0);
        setLoopCount(0);
        setIsPaused(false);
        setPhase("idle");
      },
      skip: () => {
        setText((current) => list[index]?.text ?? current);
        setPhase("pausing");
      },
    }),
    [list, index],
  );

  return {
    text,
    phase,
    index,
    loopCount,
    isPaused,
    isDone: phase === "done",
    controls,
  };
}
