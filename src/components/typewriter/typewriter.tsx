"use client";

import * as React from "react";
import { cn } from "../../lib/utils";
import { TypewriterCursor } from "./cursor";
import { useTypewriter } from "./use-typewriter";
import type {
  CursorBlink,
  CursorStyle,
  TypewriterCallbacks,
  TypewriterControls,
  TypewriterItem,
  TypewriterPhase,
  TypewriterTimingOptions,
} from "./types";

interface RenderState {
  /** Currently displayed text. */
  text: string;
  /** Current animation phase. */
  phase: TypewriterPhase;
  /** Active item index. */
  index: number;
  /** Loop iteration count. */
  loopCount: number;
  /** Pre-built cursor element using current cursor props. */
  cursor: React.ReactNode;
}

// ---------- Item subcomponent ----------

export interface TypewriterItemProps
  extends Omit<TypewriterItem, "text"> {
  /** Plain string content — the text this item types out. */
  children: string;
}

/**
 * Marker component representing a single string in the sequence.
 * Renders nothing — its props are extracted by the parent
 * `<Typewriter>` to build the items list.
 *
 * @example
 * <Typewriter typingSpeed={60}>
 *   <Typewriter.Item>Build with React.</Typewriter.Item>
 *   <Typewriter.Item typingSpeed={120}>Slow this one down.</Typewriter.Item>
 * </Typewriter>
 */
const TypewriterItemComponent: React.FC<TypewriterItemProps> = () => null;
TypewriterItemComponent.displayName = "Typewriter.Item";

// ---------- Children -> items extraction ----------

function extractItems(children: React.ReactNode): TypewriterItem[] {
  if (children == null) return [];
  if (typeof children === "string") return [{ text: children }];
  if (typeof children === "number") return [{ text: String(children) }];

  const out: TypewriterItem[] = [];
  React.Children.forEach(children, (child) => {
    if (child == null || typeof child === "boolean") return;
    if (typeof child === "string") {
      out.push({ text: child });
      return;
    }
    if (typeof child === "number") {
      out.push({ text: String(child) });
      return;
    }
    if (React.isValidElement(child) && child.type === TypewriterItemComponent) {
      const props = child.props as TypewriterItemProps;
      out.push({
        text: props.children,
        typingSpeed: props.typingSpeed,
        deletingSpeed: props.deletingSpeed,
        pauseDuration: props.pauseDuration,
      });
    }
    // Other children (JSX elements that aren't Item, fragments, etc.) are
    // intentionally ignored — they shouldn't appear under <Typewriter>.
  });
  return out;
}

// ---------- Root component ----------

export interface TypewriterProps
  extends TypewriterTimingOptions,
    TypewriterCallbacks {
  /**
   * Items to type. Three accepted forms:
   *
   * - `<Typewriter.Item>` elements (compound pattern, supports per-item overrides)
   * - A plain string (shorthand for a single item)
   * - Multiple plain strings (shorthand for multiple items)
   *
   * For render-prop control, use the `render` prop instead.
   */
  children?: React.ReactNode;
  /**
   * Render-prop override. Receives live state plus a pre-built cursor
   * node. When provided, the default `<span>` wrapper is skipped and
   * the consumer is fully responsible for rendering. Pair with
   * `<Typewriter.Item>` children to supply the items list.
   */
  render?: (state: RenderState) => React.ReactNode;
  /** Show the blinking cursor (default `true`). */
  cursor?: boolean;
  /** Visual style of the cursor — ignored if `cursorChar` is set
   *  (default `"line"`). */
  cursorStyle?: CursorStyle;
  /** Cursor blink behavior (default `"smooth"`). */
  cursorBlink?: CursorBlink;
  /** Override the geometric cursor with a custom character
   *  (e.g. `"▌"`, `"_"`, `"|"`). */
  cursorChar?: string;
  /** Additional className for the cursor element. */
  cursorClassName?: string;
  /** Hide the cursor when the animation finishes (default `false`).
   *  Only meaningful when `loop` is `false`. */
  hideCursorWhenDone?: boolean;
  /** Imperative controls — receives `play / pause / reset / skip`. */
  controlsRef?: React.Ref<TypewriterControls>;
  /** Element class. */
  className?: string;
  /** Accessible label announced by screen readers. Defaults to joining
   *  every item's text so the full content is conveyed at once instead
   *  of character-by-character. Pass `null` to disable. */
  ariaLabel?: string | null;
}

const TypewriterRoot = React.forwardRef<HTMLSpanElement, TypewriterProps>(
  function Typewriter(
    {
      children,
      render,
      cursor = true,
      cursorStyle = "line",
      cursorBlink = "smooth",
      cursorChar,
      cursorClassName,
      hideCursorWhenDone = false,
      controlsRef,
      className,
      ariaLabel,
      ...timingAndCallbacks
    },
    ref,
  ) {
    const items = React.useMemo(() => extractItems(children), [children]);

    const {
      text,
      phase,
      index,
      loopCount,
      controls,
    } = useTypewriter({ items, ...timingAndCallbacks });

    React.useImperativeHandle(controlsRef, () => controls, [controls]);

    const showCursor =
      cursor && !(hideCursorWhenDone && phase === "done");

    const cursorNode = showCursor ? (
      <TypewriterCursor
        variant={cursorStyle}
        blink={cursorBlink}
        char={cursorChar}
        className={cursorClassName}
      />
    ) : null;

    if (render) {
      return <>{render({ text, phase, index, loopCount, cursor: cursorNode })}</>;
    }

    const computedAriaLabel =
      ariaLabel === undefined
        ? items.map((i) => i.text).join(", ")
        : ariaLabel ?? undefined;

    return (
      <span
        ref={ref}
        role="text"
        aria-label={computedAriaLabel}
        className={cn("inline-block", className)}
      >
        {/* Visible text is hidden from screen readers — they get the full
            label instead, avoiding character-by-character announcements. */}
        <span aria-hidden="true">{text}</span>
        {cursorNode}
      </span>
    );
  },
);

TypewriterRoot.displayName = "Typewriter";

/**
 * Animated typewriter — types out one or more strings, optionally
 * looping with smart backspace, natural typing variance, punctuation
 * pauses, and a configurable cursor.
 *
 * Items are passed via the compound `<Typewriter.Item>` API:
 *
 * @example
 * <Typewriter deleteMode="smart" className="text-3xl font-semibold">
 *   <Typewriter.Item>Build with React.</Typewriter.Item>
 *   <Typewriter.Item>Style with Tailwind.</Typewriter.Item>
 *   <Typewriter.Item>Ship faster.</Typewriter.Item>
 * </Typewriter>
 *
 * Drop down to `useTypewriter()` for fully custom rendering.
 */
export const Typewriter = Object.assign(TypewriterRoot, {
  Item: TypewriterItemComponent,
});
