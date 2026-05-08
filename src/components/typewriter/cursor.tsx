"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import type { CursorBlink, CursorStyle } from "./types";
import { ensureCursorStyles } from "./cursor-styles";

export interface TypewriterCursorProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Visual variant of the cursor (default `"line"`). */
  variant?: CursorStyle;
  /** Blink behavior (default `"smooth"`). */
  blink?: CursorBlink;
  /** Override the default geometric cursor with a custom character
   *  (e.g. `"▌"`, `"_"`, `"|"`). When set, the `variant` prop is ignored. */
  char?: string;
}

/**
 * Standalone blinking cursor — exposed for use inside the `<Typewriter>`
 * render-prop API or as a static UI element.
 */
export function TypewriterCursor({
  variant = "line",
  blink = "smooth",
  char,
  className,
  ...props
}: TypewriterCursorProps) {
  React.useEffect(() => ensureCursorStyles(), []);

  const blinkClass = cn(
    blink === "smooth" && "eglador-tw-blink-smooth",
    blink === "hard" && "eglador-tw-blink-hard",
  );

  if (char != null) {
    return (
      <span
        aria-hidden="true"
        className={cn("inline-block ml-0.5", blinkClass, className)}
        {...props}
      >
        {char}
      </span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block bg-current align-baseline ml-0.5",
        blinkClass,
        variant === "line" && "w-px h-[1em]",
        variant === "block" && "w-[0.6em] h-[1.1em] opacity-70",
        variant === "underscore" && "w-[0.6em] h-px translate-y-[0.4em]",
        className,
      )}
      {...props}
    />
  );
}

TypewriterCursor.displayName = "TypewriterCursor";
