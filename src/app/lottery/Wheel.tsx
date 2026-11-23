const COLORS = ["#2F6B4F", "#F2CC6B", "#E8907A", "#A9D2EE"];
const TEXT = ["#FFFBF0", "#5A4210", "#FFFBF0", "#1E4466"];

const SIZE = 400;
const C = SIZE / 2;
const RIM = C - 4;
const R = C - 22;

function point(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return [C + radius * Math.sin(rad), C - radius * Math.cos(rad)] as const;
}

function colorIndex(i: number, n: number) {
  const idx = i % COLORS.length;
  // 避免最後一格與第一格同色相鄰
  return n > 1 && i === n - 1 && idx === 0 ? 2 : idx;
}

function truncate(name: string, max: number) {
  return name.length > max ? `${name.slice(0, max - 1)}…` : name;
}

type WheelProps = {
  names: string[];
  rotation: number;
  spinning: boolean;
  durationMs: number;
  onSpinEnd: () => void;
};

export default function Wheel({
  names,
  rotation,
  spinning,
  durationMs,
  onSpinEnd,
}: WheelProps) {
  const n = names.length;
  const seg = n > 0 ? 360 / n : 360;
  const fontSize = n <= 6 ? 20 : n <= 12 ? 16 : n <= 24 ? 12 : 9;
  const maxChars = n <= 8 ? 8 : n <= 16 ? 6 : 5;

  return (
    <div className="mx-auto flex w-full max-w-[420px] flex-col items-center">
      <div className="relative aspect-square w-full">
        {/* 指針 */}
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-2 drop-shadow-sm">
          <svg width="44" height="40" viewBox="0 0 44 40" aria-hidden>
            <path
              d="M6 4 H38 Q42 4 40 8 L24 36 Q22 39 20 36 L4 8 Q2 4 6 4 Z"
              fill="#F2CC6B"
              stroke="#E0B24A"
              strokeWidth="2"
            />
          </svg>
        </div>

        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-full w-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${durationMs}ms cubic-bezier(0.15, 0.85, 0.2, 1)`
              : "none",
          }}
          onTransitionEnd={(e) => {
            if (e.propertyName === "transform") onSpinEnd();
          }}
          role="img"
          aria-label="抽獎轉盤"
        >
          {/* 奶油色外框 */}
          <circle cx={C} cy={C} r={RIM} fill="#FFFBF0" stroke="#E7DFC8" strokeWidth="3" />

          {n === 0 && (
            <>
              <circle cx={C} cy={C} r={R} fill="#E3EFDD" />
              <text x={C} y={C + 70} textAnchor="middle" fontSize="18" fill="#4F8A66">
                請先輸入名單
              </text>
            </>
          )}

          {n === 1 && <circle cx={C} cy={C} r={R} fill={COLORS[0]} />}

          {n > 1 &&
            names.map((_, i) => {
              const [x1, y1] = point(i * seg, R);
              const [x2, y2] = point((i + 1) * seg, R);
              const large = seg > 180 ? 1 : 0;
              return (
                <path
                  key={i}
                  d={`M${C} ${C} L${x1} ${y1} A${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`}
                  fill={COLORS[colorIndex(i, n)]}
                  stroke="#FFFBF0"
                  strokeWidth={n > 40 ? 0.5 : 2.5}
                />
              );
            })}

          {names.map((name, i) => {
            const mid = (i + 0.5) * seg;
            const ty = C - R + 18;
            return (
              <g key={`t${i}`} transform={`rotate(${mid} ${C} ${C})`}>
                <text
                  x={C}
                  y={ty}
                  transform={`rotate(90 ${C} ${ty})`}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontSize={fontSize}
                  fontWeight={600}
                  fill={TEXT[colorIndex(i, n)]}
                >
                  {truncate(name, maxChars)}
                </text>
              </g>
            );
          })}

          {/* 中心 */}
          <circle cx={C} cy={C} r={26} fill="#FFFBF0" />
          <circle cx={C} cy={C} r={18} fill="#F2CC6B" stroke="#E0B24A" strokeWidth="3" />
        </svg>
      </div>

      {/* 底座 */}
      <div className="-mt-3 h-8 w-10 rounded-b-md bg-leaf-600" />
      <div className="h-5 w-44 rounded-b-md rounded-t-xl bg-leaf-600 shadow-[0_6px_0_-2px_#24553E]" />
    </div>
  );
}
