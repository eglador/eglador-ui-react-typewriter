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
  texts: string;
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

// ── Lucide-style SVG icons (inline — story-only, not part of the bundle) ──

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

/** Storybook's "Show code" defaults to displaying the wrapper component
 *  (`<PlaygroundDemo ... />`), which hides the actual compound API. This
 *  transform regenerates the snippet using the real `<Typewriter>` +
 *  `<Typewriter.Item>` JSX users would write — exactly mirroring the
 *  current Controls panel state, with default-valued props omitted. */
function playgroundCodeTransform(_src: string, ctx: { args: PlaygroundArgs }) {
  const a = ctx.args;
  const items = a.texts
    .split("\n")
    .filter((s) => s.length > 0)
    .map((line) => `  <Typewriter.Item>${line}</Typewriter.Item>`)
    .join("\n");

  const props: string[] = [];
  const push = (cond: boolean, prop: string) => {
    if (cond) props.push(`  ${prop}`);
  };

  // Only emit non-default values to keep the snippet tight.
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
          "Tek noktadan tüm özelliklerin canlı test edildiği master playground. Controls panelinden hız, gecikme, döngü modu, cursor ve daha fazlası ayarlanabilir. Items compound API ile (`<Typewriter.Item>`) render edilir — \"Show code\" görünümü kullanıcının yazacağı gerçek JSX'i gösterir.",
      },
      source: {
        type: "code",
        language: "tsx",
        transform: playgroundCodeTransform,
      },
    },
  },
  args: {
    texts: [
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
    texts: {
      control: "text",
      table: { category: "Items" },
      description:
        "Yazılacak metinler — her satır ayrı bir `<Typewriter.Item>` olarak render edilir.",
    },
    typingSpeed: {
      control: { type: "range", min: 10, max: 300, step: 5 },
      table: { category: "Timing" },
    },
    deletingSpeed: {
      control: { type: "range", min: 5, max: 200, step: 5 },
      table: { category: "Timing" },
    },
    pauseDuration: {
      control: { type: "range", min: 0, max: 5000, step: 100 },
      table: { category: "Timing" },
    },
    startDelay: {
      control: { type: "range", min: 0, max: 3000, step: 100 },
      table: { category: "Timing" },
    },
    variance: {
      control: { type: "range", min: 0, max: 0.8, step: 0.05 },
      table: { category: "Timing" },
      description: "Her karakter delay'ine ±jitter (0 = sabit hız, 0.3 = doğal his).",
    },
    punctuationDelays: {
      control: "boolean",
      name: "Punctuation pauses",
      table: { category: "Timing" },
      description:
        ". ! ? , ; : karakterlerinden sonra ekstra duraklama (preset).",
    },
    loop: {
      control: "boolean",
      table: { category: "Behavior" },
    },
    deleteMode: {
      control: "radio",
      options: ["backspace", "clear", "smart"] satisfies DeleteMode[],
      table: { category: "Behavior" },
    },
    autoStart: {
      control: "boolean",
      table: { category: "Behavior" },
    },
    respectReducedMotion: {
      control: "boolean",
      name: "Reduced motion",
      table: { category: "Behavior" },
    },
    cursor: {
      control: "boolean",
      table: { category: "Cursor" },
    },
    cursorStyle: {
      control: "radio",
      options: ["line", "block", "underscore"] satisfies CursorStyle[],
      table: { category: "Cursor" },
      if: { arg: "cursor", truthy: true },
    },
    cursorBlink: {
      control: "radio",
      options: ["smooth", "hard", "none"] satisfies CursorBlink[],
      table: { category: "Cursor" },
      if: { arg: "cursor", truthy: true },
    },
    cursorChar: {
      control: "text",
      table: { category: "Cursor" },
      description:
        "Geometric cursor yerine custom karakter (örn: ▌ _ |).",
      if: { arg: "cursor", truthy: true },
    },
    hideCursorWhenDone: {
      control: "boolean",
      table: { category: "Cursor" },
      if: { arg: "cursor", truthy: true },
    },
    className: {
      control: "text",
      table: { category: "Styling" },
    },
  },
};

export default meta;

function PlaygroundDemo(args: PlaygroundArgs) {
  const lines = React.useMemo(
    () => args.texts.split("\n").filter((s) => s.length > 0),
    [args.texts],
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

// ── Preset stories ─────────────────────────────────────────────────

export const SmartBackspace: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "`deleteMode=\"smart\"` — sıradaki string ile ortak prefix korunur, sadece fark silinir/yazılır.",
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

export const PerItemOverrides: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Compound API ile her `Typewriter.Item` kendi `typingSpeed` / `deletingSpeed` / `pauseDuration` değerlerini ayarlayabilir — parent değerlerini override eder.",
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

export const NaturalTyping: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "Yüksek `variance` ve `punctuationDelays` — gerçek bir insanın yazdığı hissi.",
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
          "Terminal hissi — block cursor + hard blink + monospace font.",
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
        story: "Geometric cursor yerine custom karakter (`▌`).",
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
          "Render-prop API — `render` prop'u ile kendi UI'ını çiz, items yine `<Typewriter.Item>` ile gelir.",
      },
    },
  },
  render: () => (
    <Typewriter
      render={({ text, cursor, phase }) => (
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          <span aria-hidden="true">{text}</span>
          <span className="text-zinc-900">{cursor}</span>
          <span className="block mt-2 text-xs font-normal text-zinc-500">
            phase: {phase}
          </span>
        </h1>
      )}
    >
      <Typewriter.Item>Wrap me in any element</Typewriter.Item>
      <Typewriter.Item>Compose freely</Typewriter.Item>
    </Typewriter>
  ),
};

export const NonLooping: StoryObj = {
  parameters: {
    docs: {
      description: {
        story:
          "`loop=false` + `hideCursorWhenDone` — tek seferlik animasyon, biter ve cursor kaybolur.",
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
          "Tek string için ergonomik kısayol — `<Typewriter.Item>` olmadan doğrudan string children.",
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
          "Uzun-form prose — Lorem Ipsum metni okuyan ritimde yazılır. Yüksek `variance` ve `punctuationDelays` ile gerçekçi insan-yazımı hissi; `loop=false` + `hideCursorWhenDone` ile bittiğinde durur.",
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
