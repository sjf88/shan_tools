"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { ASPECTS, ASPECT_TIPS, LEVELS, LUCKY_COLORS, type Level } from "./fortunes";

type Result = {
  level: Level;
  aspects: { name: string; stars: number; tip: string }[];
  color: string;
  number: number;
};

const SHAKE_MS = 1400;
const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function rand(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

const pick = <T,>(arr: readonly T[]) => arr[rand(arr.length)];

function drawLevel(): Level {
  const total = LEVELS.reduce((s, l) => s + l.weight, 0);
  let r = rand(total);
  for (const l of LEVELS) {
    if (r < l.weight) return l;
    r -= l.weight;
  }
  return LEVELS[0];
}

function draw(): Result {
  const level = drawLevel();
  const [lo, hi] = level.stars;
  return {
    level,
    aspects: ASPECTS.map((name) => ({
      name,
      stars: lo + rand(hi - lo + 1),
      tip: pick(ASPECT_TIPS[name][level.tier]),
    })),
    color: pick(LUCKY_COLORS),
    number: 1 + rand(9),
  };
}

// 日期只在瀏覽器端計算，使用者時區才會正確
let cachedDate = "";
function getToday() {
  const d = new Date();
  const s = `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日（星期${WEEKDAYS[d.getDay()]}）`;
  if (s !== cachedDate) cachedDate = s;
  return cachedDate;
}
const noopSubscribe = () => () => {};

// 吉：紅色；凶：灰色
const GOOD = { main: "#D64541", soft: "#FDECEA", block: "#FFF5F2" };
const BAD = { main: "#7F8C8D", soft: "#EEF0F1", block: "#F6F7F8" };

function Stars({ n, color }: { n: number; color: string }) {
  return (
    <span className="tracking-wider" aria-label={`${n} 顆星`}>
      <span style={{ color }}>{"★".repeat(n)}</span>
      <span className="text-[#E3DCDA]">{"★".repeat(5 - n)}</span>
    </span>
  );
}

export default function FortuneApp() {
  const today = useSyncExternalStore(noopSubscribe, getToday, () => "");
  const [shaking, setShaking] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [open, setOpen] = useState(false);

  function start() {
    if (shaking) return;
    setOpen(false);
    setShaking(true);
    setTimeout(() => {
      setResult(draw());
      setShaking(false);
      setOpen(true);
    }, SHAKE_MS);
  }

  // Esc 關閉 modal、開啟時鎖住背景捲動
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const c = result && result.level.tier === "bad" ? BAD : GOOD;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-10 px-4 py-12">
      <header className="text-center">
        <p className="min-h-6 text-sm font-medium tracking-wider text-[#D64541]">{today}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#3B2A28]">好運抽籤</h1>
        <p className="mt-2 text-[#8A6E6A]">誠心默念你的心願，搖一搖籤筒，看看今天的運勢。</p>
      </header>

      {/* 籤筒 */}
      <button
        type="button"
        onClick={start}
        disabled={shaking}
        aria-label="搖籤筒抽籤"
        className="group flex flex-col items-center rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-[#F5B7B1]"
      >
        <div className={`relative mt-12 ${shaking ? "animate-shake" : "transition-transform duration-300 group-hover:-rotate-3"}`}>
          {/* 籤枝 */}
          <div className="absolute -top-12 left-1/2 flex -translate-x-1/2 gap-2">
            {[-12, -5, 0, 5, 12].map((rot, i) => (
              <span
                key={i}
                className={`block h-24 w-2.5 origin-bottom rounded-t-full ${i === 2 ? "bg-[#F6C38B]" : "bg-[#F9D9B4]"} ${shaking && i === 2 ? "animate-stick" : ""}`}
                style={{ transform: `rotate(${rot}deg)` }}
              />
            ))}
          </div>
          {/* 筒身 */}
          <div className="relative flex h-52 w-36 flex-col items-center justify-center rounded-b-[2rem] rounded-t-lg bg-[#D64541]">
            <span className="absolute inset-x-0 top-0 h-4 rounded-t-lg bg-[#B83A36]" />
            <span className="rounded-lg bg-[#FFF5F2] px-2.5 py-4 text-2xl font-bold tracking-widest text-[#D64541] [writing-mode:vertical-rl]">
              好運籤
            </span>
          </div>
        </div>
        <span className="mt-8 rounded-full bg-[#D64541] px-10 py-3.5 text-lg font-semibold text-[#FFFFFF] transition-colors group-hover:bg-[#B83A36] group-disabled:bg-[#E8908D]">
          {shaking ? "搖籤中…" : result ? "再抽一次" : "開始抽籤"}
        </span>
      </button>

      {result && !open && !shaking && (
        <button type="button" onClick={() => setOpen(true)} className="-mt-6 text-sm text-[#8A6E6A] underline-offset-4 hover:underline">
          查看剛剛的籤（{result.level.name}）
        </button>
      )}

      {/* 結果 modal */}
      {open && result && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#EDE4D8]/85 p-4 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="fortune-title"
            onClick={(e) => e.stopPropagation()}
            className="animate-pop relative flex max-h-[90vh] w-full max-w-md flex-col overflow-y-auto rounded-3xl bg-[#FAF6EF] p-6 ring-1 ring-[#E2D6C6] sm:p-8"
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="關閉"
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full text-[#8A6E6A] transition-colors hover:bg-[#3B2A28] hover:text-[#FFFFFF] focus-visible:bg-[#3B2A28] focus-visible:text-[#FFFFFF] focus-visible:outline-none"
            >
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="flex flex-col items-center gap-3 text-center">
              <span className="text-xs tracking-[0.3em] text-[#A8928E]">{today}</span>
              <div className="flex size-28 items-center justify-center rounded-full" style={{ backgroundColor: c.soft }}>
                <span id="fortune-title" className="text-4xl font-black" style={{ color: c.main }}>
                  {result.level.name}
                </span>
              </div>
              <p className="mt-1 font-medium text-[#3B2A28]">「{result.level.poem}」</p>
              <p className="leading-relaxed text-[#6B5552]">{result.level.summary}</p>
            </div>

            {/* 各方面運勢：直向區塊 */}
            <div className="mt-6 flex flex-col gap-3">
              {result.aspects.map((a) => (
                <div key={a.name} className="rounded-2xl px-4 py-3" style={{ backgroundColor: c.block }}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#3B2A28]">{a.name}</span>
                    <Stars n={a.stars} color={c.main} />
                  </div>
                  <p className="mt-1 text-sm text-[#6B5552]">{a.tip}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              {[
                ["幸運色", result.color],
                ["幸運數字", String(result.number)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-2xl px-2 py-3" style={{ backgroundColor: c.block }}>
                  <div className="text-xs text-[#A8928E]">{k}</div>
                  <div className="mt-1 font-bold" style={{ color: c.main }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={start}
              className="mt-6 rounded-full py-3 font-semibold text-[#FFFFFF] transition-opacity hover:opacity-90"
              style={{ backgroundColor: c.main }}
            >
              再抽一次
            </button>
            <p className="mt-4 text-center text-xs text-[#A8928E]">籤詩僅供娛樂參考，好運掌握在自己手中 ✦</p>
          </div>
        </div>
      )}
    </div>
  );
}
