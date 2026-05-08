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
  text: string;
  phase: TypewriterPhase;
  index: number;
  loopCount: number;
  cursor: React.ReactNode;
  item: TypewriterItem | undefined;
}

export interface TypewriterItemProps
  extends Omit<TypewriterItem, "text"> {
  children: string;
}

const TypewriterItemComponent: React.FC<TypewriterItemProps> = () => null;
TypewriterItemComponent.displayName = "Typewriter.Item";

declare const process: { env: { NODE_ENV?: string } } | undefined;
const isDevelopment =
  typeof process !== "undefined" && process?.env?.NODE_ENV !== "production";

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
    if (
      React.isValidElement(child) &&
      child.type === TypewriterItemComponent
    ) {
      const props = child.props as TypewriterItemProps;
      out.push({
        text: props.children,
        typingSpeed: props.typingSpeed,
        deletingSpeed: props.deletingSpeed,
        pauseDuration: props.pauseDuration,
        className: props.className,
        style: props.style,
      });
      return;
    }
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(
        "[Typewriter] Ignored unsupported child. Only `<Typewriter.Item>`, " +
          "plain strings, and numbers are accepted. For custom rendering " +
          "use the `render` prop.",
      );
    }
  });
  return out;
}

export interface TypewriterProps
  extends TypewriterTimingOptions,
    TypewriterCallbacks {
  children?: React.ReactNode;
  render?: (state: RenderState) => React.ReactNode;
  cursor?: boolean;
  cursorStyle?: CursorStyle;
  cursorBlink?: CursorBlink;
  cursorChar?: string;
  cursorClassName?: string;
  hideCursorWhenDone?: boolean;
  controlsRef?: React.Ref<TypewriterControls>;
  className?: string;
  style?: React.CSSProperties;
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
      style,
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

    const activeItem = items[index];

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
      return render({
        text,
        phase,
        index,
        loopCount,
        cursor: cursorNode,
        item: activeItem,
      });
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
        style={style}
      >
        <span
          aria-hidden="true"
          className={activeItem?.className}
          style={activeItem?.style}
        >
          {text}
        </span>
        {cursorNode}
      </span>
    );
  },
);

TypewriterRoot.displayName = "Typewriter";

export const Typewriter = Object.assign(TypewriterRoot, {
  Item: TypewriterItemComponent,
});
