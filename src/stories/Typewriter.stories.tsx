import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Typewriter,
  type CursorBlink,
  type CursorStyle,
  type DeleteMode,
  type TypewriterControls,
} from "../components/typewriter";

type PlaygroundArgs = {
  items: string;
  typingSpeed: number;
  deletingSpeed: number;
  pauseDuration: number;
  startDelay: number;
  variance: number;
  loop: boolean;
  deleteMode: DeleteMode;
  punctuationDelays: boolean;
  autoStart: boolean;
  respectReducedMotion: boolean;
  cursor: boolean;
  cursorStyle: CursorStyle;
  cursorBlink: CursorBlink;
  cursorChar: string;
  hideCursorWhenDone: boolean;
  className: string;
};

const PUNCT_PRESET: Record<string, number> = {
  ".": 600,
  "!": 600,
  "?": 600,
  ",": 250,
  ";": 350,
  ":": 350,
};

const LOREM_IPSUM =
  "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

const ICON_PROPS = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const PlayIcon = () => (
  <svg {...ICON_PROPS}>
    <polygon points="6 3 20 12 6 21 6 3" />
  </svg>
);

const PauseIcon = () => (
  <svg {...ICON_PROPS}>
    <rect x="6" y="4" width="4" height="16" rx="1" />
    <rect x="14" y="4" width="4" height="16" rx="1" />
  </svg>
);

const SkipIcon = () => (
  <svg {...ICON_PROPS}>
    <polygon points="5 4 15 12 5 20 5 4" />
    <line x1="19" x2="19" y1="5" y2="19" />
  </svg>
);

const ResetIcon = () => (
  <svg {...ICON_PROPS}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

interface ControlButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

function ControlButton({ onClick, icon, label }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 cursor-pointer transition-colors"
    >
      <span className="text-zinc-500">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function playgroundCodeTransform(_src: string, ctx: { args: PlaygroundArgs }) {
  const a = ctx.args;
  const items = a.items
    .split("\n")
    .filter((s) => s.length > 0)
    .map((line) => `  <Typewriter.Item>${line}</Typewriter.Item>`)
    .join("\n");

  const props: string[] = [];
  const push = (cond: boolean, prop: string) => {
    if (cond) props.push(`  ${prop}`);
  };

  push(a.typingSpeed !== 60, `typingSpeed={${a.typingSpeed}}`);
  push(a.deletingSpeed !== 30, `deletingSpeed={${a.deletingSpeed}}`);
  push(a.pauseDuration !== 2000, `pauseDuration={${a.pauseDuration}}`);
  push(a.startDelay !== 0, `startDelay={${a.startDelay}}`);
  push(a.variance !== 0.3, `variance={${a.variance}}`);
  push(
    a.punctuationDelays,
    `punctuationDelays={{ ".": 600, "!": 600, "?": 600, ",": 250, ";": 350, ":": 350 }}`,
  );
  push(a.deleteMode !== "backspace", `deleteMode="${a.deleteMode}"`);
  push(a.loop === false, `loop={false}`);
  push(a.autoStart === false, `autoStart={false}`);
  push(a.respectReducedMotion === false, `respectReducedMotion={false}`);
  push(a.cursor === false, `cursor={false}`);
  push(a.cursor && a.cursorStyle !== "line", `cursorStyle="${a.cursorStyle}"`);
  push(a.cursor && a.cursorBlink !== "smooth", `cursorBlink="${a.cursorBlink}"`);
  push(Boolean(a.cursor && a.cursorChar), `cursorChar="${a.cursorChar}"`);
  push(a.cursor && a.hideCursorWhenDone, `hideCursorWhenDone`);
  push(Boolean(a.className), `className="${a.className}"`);

  const propsBlock = props.length > 0 ? `\n${props.join("\n")}\n` : " ";
  return `<Typewriter${propsBlock}>\n${items}\n</Typewriter>`;
}

const meta: Meta<PlaygroundArgs> = {
  title: "Typewriter/Playground",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Master playground for live-testing every option from the Controls panel. Items are rendered via the compound `<Typewriter.Item>` API; the `Show code` panel mirrors the JSX you would write.",
      },
      source: {
        type: "code",
        language: "tsx",
        transform: playgroundCodeTransform,
      },
    },
  },
  args: {
    items: [
      "Build with React.",
      "Style with Tailwind.",
      "Ship faster.",
    ].join("\n"),
    typingSpeed: 60,
    deletingSpeed: 30,
    pauseDuration: 2000,
    startDelay: 0,
    variance: 0.3,
    loop: true,
    deleteMode: "smart",
    punctuationDelays: true,
    autoStart: true,
    respectReducedMotion: true,
    cursor: true,
    cursorStyle: "line",
    cursorBlink: "smooth",
    cursorChar: "",
    hideCursorWhenDone: false,
    className: "text-3xl font-semibold text-zinc-900",
  },
  argTypes: {
    items: {
      control: "text",
      table: { category: "Items" },
      description:
        "Each line becomes a `<Typewriter.Item>`. Multiline textbox for live editing.",
    },
    typingSpeed: {
      control: { type: "range", min: 10, max: 300, step: 5 },
      table: { category: "Timing" },
      description: "Milliseconds per typed character.",
    },
    deletingSpeed: {
      control: { type: "range", min: 5, max: 200, step: 5 },
      table: { category: "Timing" },
      description: "Milliseconds per deleted character.",
    },
    pauseDuration: {
      control: { type: "range", min: 0, max: 5000, step: 100 },
      table: { category: "Timing" },
      description: "Hold duration on a completed string before deleting.",
    },
    startDelay: {
      control: { type: "range", min: 0, max: 3000, step: 100 },
      table: { category: "Timing" },
      description: "Wait before the very first keystroke.",
    },
    variance: {
      control: { type: "range", min: 0, max: 0.8, step: 0.05 },
      table: { category: "Timing" },
      description:
        "± jitter applied to every character delay (0 = perfectly steady, 0.3 = natural).",
    },
    punctuationDelays: {
      control: "boolean",
      name: "Punctuation pauses",
      table: { category: "Timing" },
      description:
        "Apply a preset of extra delays after . ! ? , ; : characters.",
    },
    loop: {
      control: "boolean",
      table: { category: "Behavior" },
      description: "Cycle through items indefinitely.",
    },
    deleteMode: {
      control: "radio",
      options: ["backspace", "clear", "smart"] satisfies DeleteMode[],
      table: { category: "Behavior" },
      description:
        "How to clear the current item before typing the next: per-character (`backspace`), instant (`clear`), or keep common prefix (`smart`).",
    },
    autoStart: {
      control: "boolean",
      table: { category: "Behavior" },
      description:
        "Animate on mount. Set to `false` to drive the animation purely via controls.",
    },
    respectReducedMotion: {
      control: "boolean",
      name: "Reduced motion",
      table: { category: "Behavior" },
      description:
        "Honor `prefers-reduced-motion: reduce` — render the final item instantly.",
    },
    cursor: {
      control: "boolean",
      table: { category: "Cursor" },
      description: "Show the blinking cursor.",
    },
    cursorStyle: {
      control: "radio",
      options: ["line", "block", "underscore"] satisfies CursorStyle[],
      table: { category: "Cursor" },
      if: { arg: "cursor", truthy: true },
      description: "Visual variant of the geometric cursor.",
    },
    cursorBlink: {
      control: "radio",
      options: ["smooth", "hard", "none"] satisfies CursorBlink[],
      table: { category: "Cursor" },
      if: { arg: "cursor", truthy: true },
      description: "Blink animation style.",
    },
    cursorChar: {
      control: "text",
      table: { category: "Cursor" },
      description:
        "Override the geometric cursor with a custom character (e.g. ▌ _ |).",
      if: { arg: "cursor", truthy: true },
    },
    hideCursorWhenDone: {
      control: "boolean",
      table: { category: "Cursor" },
      if: { arg: "cursor", truthy: true },
      description:
        "Hide the cursor when animation finishes (only meaningful when `loop` is `false`).",
    },
    className: {
      control: "text",
      table: { category: "Styling" },
      description: "Class on the wrapping element.",
    },
  },
};

export default meta;

function PlaygroundDemo(args: PlaygroundArgs) {
  const lines = React.useMemo(
    () => args.items.split("\n").filter((s) => s.length > 0),
    [args.items],
  );

  const controlsRef = React.useRef<TypewriterControls>(null);

  return (
    <div className="space-y-6">
      <div className="min-h-32 flex items-center">
        <Typewriter
          key={`${args.deleteMode}-${args.autoStart}-${args.cursorStyle}-${args.cursorBlink}-${args.cursorChar}`}
          typingSpeed={args.typingSpeed}
          deletingSpeed={args.deletingSpeed}
          pauseDuration={args.pauseDuration}
          startDelay={args.startDelay}
          variance={args.variance}
          punctuationDelays={args.punctuationDelays ? PUNCT_PRESET : undefined}
          loop={args.loop}
          deleteMode={args.deleteMode}
          autoStart={args.autoStart}
          respectReducedMotion={args.respectReducedMotion}
          cursor={args.cursor}
          cursorStyle={args.cursorStyle}
          cursorBlink={args.cursorBlink}
          cursorChar={args.cursorChar || undefined}
          hideCursorWhenDone={args.hideCursorWhenDone}
          controlsRef={controlsRef}
          className={args.className}
        >
          {lines.map((line, i) => (
            <Typewriter.Item key={i}>{line}</Typewriter.Item>
          ))}
        </Typewriter>
      </div>

      <div className="flex items-center gap-1.5 pt-3 border-t border-zinc-100">
        <ControlButton
          onClick={() => controlsRef.current?.play()}
          icon={<PlayIcon />}
          label="Play"
        />
        <ControlButton
          onClick={() => controlsRef.current?.pause()}
          icon={<PauseIcon />}
          label="Pause"
        />
        <ControlButton
          onClick={() => controlsRef.current?.skip()}
          icon={<SkipIcon />}
          label="Skip"
        />
        <span className="w-px h-4 bg-zinc-200 mx-1" aria-hidden="true" />
        <ControlButton
          onClick={() => controlsRef.current?.reset()}
          icon={<ResetIcon />}
          label="Reset"
        />
      </div>
    </div>
  );
}

export const Playground: StoryObj<PlaygroundArgs> = {
  render: (args) => <PlaygroundDemo {...args} />,
};

export const SmartBackspace: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "`deleteMode=\"smart\"` keeps the longest common prefix between consecutive items, deleting only the differing suffix.",
      },
    },
  },
  render: () => (
    <Typewriter deleteMode="smart" className="text-3xl font-semibold text-zinc-900">
      <Typewriter.Item>I love React</Typewriter.Item>
      <Typewriter.Item>I love Tailwind</Typewriter.Item>
      <Typewriter.Item>I love TypeScript</Typewriter.Item>
    </Typewriter>
  ),
};

export const PerItemTiming: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Every `Typewriter.Item` may override `typingSpeed`, `deletingSpeed`, and `pauseDuration` for itself, falling back to the parent value otherwise.",
      },
    },
  },
  render: () => (
    <Typewriter
      typingSpeed={60}
      pauseDuration={1500}
      className="text-2xl text-zinc-800"
    >
      <Typewriter.Item>Normal speed.</Typewriter.Item>
      <Typewriter.Item typingSpeed={150} pauseDuration={3000}>
        Slow… and a long pause.
      </Typewriter.Item>
      <Typewriter.Item typingSpeed={20}>And blazing fast!</Typewriter.Item>
    </Typewriter>
  ),
};

export const PerItemStyling: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Every `Typewriter.Item` accepts its own `className` and `style` — the active item's styling is applied to the live text. The container `<Typewriter>` keeps its own class for layout / typography.",
      },
    },
  },
  render: () => (
    <Typewriter
      deleteMode="smart"
      className="text-3xl font-semibold"
    >
      <Typewriter.Item className="text-blue-600">Build with React.</Typewriter.Item>
      <Typewriter.Item className="text-cyan-500">
        Style with Tailwind.
      </Typewriter.Item>
      <Typewriter.Item
        className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent"
      >
        Ship faster.
      </Typewriter.Item>
    </Typewriter>
  ),
};

export const NaturalTyping: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "High `variance` plus `punctuationDelays` produce a natural, human-like typing rhythm.",
      },
    },
  },
  render: () => (
    <Typewriter
      typingSpeed={70}
      variance={0.5}
      punctuationDelays={PUNCT_PRESET}
      className="text-2xl text-zinc-800"
    >
      <Typewriter.Item>
        Hello, world. This feels natural, doesn't it?
      </Typewriter.Item>
      <Typewriter.Item>
        Variance + punctuation pauses make it real.
      </Typewriter.Item>
    </Typewriter>
  ),
};

export const HardBlinkBlockCursor: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Terminal feel — block cursor + hard blink + monospace font.",
      },
    },
  },
  render: () => (
    <Typewriter
      cursorStyle="block"
      cursorBlink="hard"
      loop={false}
      className="text-xl font-mono text-emerald-500 bg-zinc-900 p-4 rounded-lg"
    >
      <Typewriter.Item>$ npm install eglador-ui-react-typewriter</Typewriter.Item>
    </Typewriter>
  ),
};

export const CustomCursorChar: StoryObj = {
  parameters: {
    docs: {
      description: {
        story: "Use any character as the cursor (`▌`).",
      },
    },
  },
  render: () => (
    <Typewriter cursorChar="▌" className="text-2xl font-semibold text-blue-600">
      <Typewriter.Item>Custom cursor character</Typewriter.Item>
      <Typewriter.Item>Anything you like</Typewriter.Item>
    </Typewriter>
  ),
};

export const RenderProp: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Render-prop API — supply `render` to take full control of the wrapping markup. Items are still passed via `<Typewriter.Item>`. The render function also receives the active `item` so you can read its `className` / `style`.",
      },
    },
  },
  render: () => (
    <Typewriter
      render={({ text, cursor, phase, item }) => (
        <h1
          className={`text-4xl font-bold ${item?.className ?? ""}`}
          style={item?.style}
        >
          <span aria-hidden="true">{text}</span>
          <span className="text-zinc-900">{cursor}</span>
          <span className="block mt-2 text-xs font-normal text-zinc-500">
            phase: {phase}
          </span>
        </h1>
      )}
    >
      <Typewriter.Item className="text-blue-600">
        Wrap me in any element
      </Typewriter.Item>
      <Typewriter.Item className="text-emerald-600">
        Compose freely
      </Typewriter.Item>
    </Typewriter>
  ),
};

export const NonLooping: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "`loop={false}` plus `hideCursorWhenDone` — single pass animation that ends and removes the cursor.",
      },
    },
  },
  render: () => (
    <Typewriter
      loop={false}
      hideCursorWhenDone
      className="text-2xl text-zinc-800"
    >
      <Typewriter.Item>This types once, then stops.</Typewriter.Item>
    </Typewriter>
  ),
};

export const SingleString: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Shorthand for a single item — pass a plain string child instead of `<Typewriter.Item>`.",
      },
    },
  },
  render: () => (
    <Typewriter className="text-2xl font-semibold text-zinc-900">
      Hello, world.
    </Typewriter>
  ),
};

export const Paragraph: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Long-form prose — Lorem Ipsum typed at a reading rhythm. High `variance` plus `punctuationDelays` for human feel; `loop={false}` and `hideCursorWhenDone` to stop cleanly when finished.",
      },
    },
  },
  render: () => (
    <div className="max-w-2xl">
      <Typewriter
        typingSpeed={35}
        variance={0.5}
        punctuationDelays={PUNCT_PRESET}
        loop={false}
        hideCursorWhenDone
        className="text-base leading-relaxed text-zinc-700 [&>span]:[white-space:pre-wrap]"
      >
        <Typewriter.Item>{LOREM_IPSUM}</Typewriter.Item>
      </Typewriter>
    </div>
  ),
};
