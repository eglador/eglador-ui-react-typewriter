import type * as React from "react";

export type TypewriterPhase =
  | "idle"
  | "typing"
  | "pausing"
  | "deleting"
  | "done";

export type CursorStyle = "line" | "block" | "underscore";

export type CursorBlink = "smooth" | "hard" | "none";

export type DeleteMode = "backspace" | "clear" | "smart";

export interface TypewriterItem {
  text: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface TypewriterControls {
  play: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
}

export interface TypewriterCallbacks {
  onType?: (text: string, index: number) => void;
  onChange?: (text: string, phase: TypewriterPhase) => void;
  onLoop?: (loopCount: number) => void;
  onComplete?: () => void;
}

export interface TypewriterTimingOptions {
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  startDelay?: number;
  variance?: number;
  punctuationDelays?: Record<string, number>;
  deleteMode?: DeleteMode;
  loop?: boolean;
  autoStart?: boolean;
  respectReducedMotion?: boolean;
}

export interface UseTypewriterOptions
  extends TypewriterTimingOptions,
    TypewriterCallbacks {
  items: ReadonlyArray<string | TypewriterItem>;
}
