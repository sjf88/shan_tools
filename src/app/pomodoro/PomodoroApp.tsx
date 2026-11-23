"use client";

import { useEffect, useRef, useState } from "react";
import { QUOTES } from "./quotes";

type Phase = "idle" | "focus" | "break" | "done";

const PHASE_LABEL: Record<Phase, string> = {
  idle: "準備開始",
  focus: "專注中",
  break: "休息一下",
  done: "全部完成！",
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatMs(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`;
}

function chime() {
  try {
    const ctx = new AudioContext();
    [0, 0.25, 0.5].forEach((t, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = [660, 880, 990][i];
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + t);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.6);
      osc.connect(gain).connect(ctx.destination);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.65);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    /* 瀏覽器不支援音效時略過 */
  }
}

function Stepper({
  label,
  value,
  unit,
  min,
  max,
  disabled,
  onChange,
}: {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  disabled: boolean;
  onChange: (v: number) => void;
}) {
  const set = (v: number) => onChange(Math.min(max, Math.max(min, v || min)));
  const btn =
    "size-9 rounded-full bg-mist-100 text-lg text-mist-700 transition-colors hover:bg-mist-200 disabled:opacity-40";
  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl bg-white p-4 ring-1 ring-mist-200">
      <span className="text-sm text-mist-600">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" className={btn} disabled={disabled || value <= min} onClick={() => set(value - 1)} aria-label={`減少${label}`}>
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          value={value}
          min={min}
          max={max}
          disabled={disabled}
          onChange={(e) => set(parseInt(e.target.value, 10))}
          className="w-14 rounded-lg bg-transparent text-center text-2xl font-semibold text-mist-900 outline-none focus:bg-mist-50 disabled:opacity-60 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          aria-label={label}
        />
        <button type="button" className={btn} disabled={disabled || value >= max} onClick={() => set(value + 1)} aria-label={`增加${label}`}>
          +
        </button>
      </div>
      <span className="text-xs text-mist-400">{unit}</span>
    </div>
  );
}

export default function PomodoroApp() {
  const [focusMin, setFocusMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [rounds, setRounds] = useState(4);
  const [autoNext, setAutoNext] = useState(true);
  const [task, setTask] = useState("");
  const [taskDraft, setTaskDraft] = useState("");

  const [phase, setPhase] = useState<Phase>("idle");
  const [round, setRound] = useState(1);
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(25 * 60_000);
  const [quoteIdx, setQuoteIdx] = useState<number | null>(null);
  const endAt = useRef(0);

  const phaseTotal = (phase === "break" ? breakMin : focusMin) * 60_000;
  const displayMs = phase === "idle" ? focusMin * 60_000 : remaining;
  const progress = phase === "idle" ? 0 : phase === "done" ? 1 : 1 - remaining / phaseTotal;

  // 隨機格言（僅在瀏覽器端選，避免伺服器/客戶端不一致）
  useEffect(() => {
    const id = requestAnimationFrame(() => setQuoteIdx(Math.floor(Math.random() * QUOTES.length)));
    return () => cancelAnimationFrame(id);
  }, []);

  function nextQuote() {
    setQuoteIdx((cur) => {
      let i = Math.floor(Math.random() * QUOTES.length);
      if (i === cur) i = (i + 1) % QUOTES.length;
      return i;
    });
  }

  function startPhase(p: "focus" | "break", run: boolean) {
    const ms = (p === "focus" ? focusMin : breakMin) * 60_000;
    setPhase(p);
    setRemaining(ms);
    endAt.current = Date.now() + ms;
    setRunning(run);
  }

  // 計時：以結束時間戳計算，分頁切到背景也不會跑慢
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = endAt.current - Date.now();
      if (left > 0) {
        setRemaining(left);
        return;
      }
      chime();
      if (phase === "focus") {
        if (round >= rounds) {
          setPhase("done");
          setRemaining(0);
          setRunning(false);
        } else {
          startPhase("break", autoNext);
        }
      } else {
        setRound((r) => r + 1);
        startPhase("focus", autoNext);
        nextQuote();
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, phase, round, rounds, autoNext]);

  // 分頁標題顯示倒數
  useEffect(() => {
    document.title =
      phase === "idle" || phase === "done"
        ? "番茄鐘 | Shan Tools"
        : `${formatMs(remaining)} ${phase === "focus" ? "專注" : "休息"} | 番茄鐘`;
  }, [phase, remaining]);

  function toggle() {
    if (phase === "idle" || phase === "done") {
      setRound(1);
      startPhase("focus", true);
      return;
    }
    if (running) {
      setRemaining(endAt.current - Date.now());
      setRunning(false);
    } else {
      endAt.current = Date.now() + remaining;
      setRunning(true);
    }
  }

  function reset() {
    setRunning(false);
    setPhase("idle");
    setRound(1);
  }

  function skip() {
    endAt.current = Date.now();
    if (!running) setRunning(true);
  }

  const locked = phase !== "idle" && phase !== "done";
  const ringColor = phase === "break" ? "var(--color-sage)" : "var(--color-mist-500)";
  const R = 120;
  const CIRC = 2 * Math.PI * R;
  const quote = quoteIdx === null ? null : QUOTES[quoteIdx];

  return (
    <div className="flex flex-col gap-8">
      {/* 格言 */}
      <section className="relative rounded-3xl bg-white/80 px-10 pb-8 pt-5 text-center ring-1 ring-mist-200">
        <p className="min-h-14 text-lg leading-relaxed text-mist-700">
          {quote ? `「${quote.text}」` : " "}
        </p>
        <p className="mt-2 min-h-5 text-sm text-mist-400">
          {quote ? `— ${quote.author}` : ""}
        </p>
        <div className="group absolute bottom-3 right-3">
          <button
            type="button"
            onClick={nextQuote}
            aria-label="換一句"
            className="flex size-9 items-center justify-center rounded-full text-mist-500 transition-all hover:rotate-90 hover:bg-mist-100 active:scale-90"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 12a9 9 0 1 1-2.64-6.36" />
              <path d="M21 3v6h-6" />
            </svg>
          </button>
          <span
            role="tooltip"
            className="pointer-events-none absolute bottom-full right-0 mb-2 w-max rounded-lg bg-mist-900 px-2.5 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-has-[:focus-visible]:opacity-100"
          >
            換一句
          </span>
        </div>
      </section>

      {/* 計時器 */}
      <section className="flex flex-col items-center gap-6 rounded-3xl bg-white px-6 py-10 shadow-[0_10px_40px_-20px_rgba(68,101,129,0.35)] ring-1 ring-mist-200">
        {task && (
          <div className="animate-pop flex w-full max-w-md flex-col items-center gap-1 rounded-2xl bg-mist-100 px-6 py-4 text-center ring-2 ring-mist-300">
            <span className="text-xs font-semibold tracking-[0.2em] text-mist-500">本組目標</span>
            <p className="break-words text-2xl font-bold leading-snug text-mist-900">{task}</p>
          </div>
        )}
        <div className="relative size-72">
          <svg viewBox="0 0 280 280" className="size-full -rotate-90">
            <circle cx="140" cy="140" r={R} fill="none" stroke="var(--color-mist-100)" strokeWidth="14" />
            <circle
              cx="140"
              cy="140"
              r={R}
              fill="none"
              stroke={ringColor}
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              strokeDashoffset={CIRC * (1 - progress)}
              style={{ transition: "stroke-dashoffset 0.3s linear, stroke 0.4s" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-sm font-medium tracking-widest text-mist-500">{PHASE_LABEL[phase]}</span>
            <span className="mt-1 font-mono text-6xl font-semibold tabular-nums text-mist-900">{formatMs(displayMs)}</span>
            <span className="mt-2 text-sm text-mist-400">
              第 {Math.min(round, rounds)} / {rounds} 組
            </span>
          </div>
        </div>

        {/* 組數進度點 */}
        <div className="flex flex-wrap justify-center gap-2" aria-label="組數進度">
          {Array.from({ length: rounds }, (_, i) => {
            const n = i + 1;
            const finished = n < round || phase === "done" || (n === round && phase === "break");
            const current = n === round && phase === "focus";
            return (
              <span
                key={i}
                className={`size-3 rounded-full transition-colors ${
                  finished ? "bg-mist-500" : current ? "bg-mist-300 ring-2 ring-mist-200" : "bg-mist-100"
                }`}
              />
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={reset}
            disabled={phase === "idle"}
            className="rounded-full px-5 py-3 text-mist-600 transition-colors hover:bg-mist-100 disabled:opacity-40"
          >
            重設
          </button>
          <button
            type="button"
            onClick={toggle}
            className="min-w-36 rounded-full bg-mist-500 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-mist-600 active:scale-95"
          >
            {phase === "idle" ? "開始專注" : phase === "done" ? "再來一輪" : running ? "暫停" : "繼續"}
          </button>
          <button
            type="button"
            onClick={skip}
            disabled={!locked}
            className="rounded-full px-5 py-3 text-mist-600 transition-colors hover:bg-mist-100 disabled:opacity-40"
          >
            跳過
          </button>
        </div>
      </section>

      {/* 設定 */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-mist-700">設定</h2>
          {locked && <span className="text-xs text-mist-400">計時中無法修改時間與組數，請先重設</span>}
        </div>
        <form
          className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-mist-200"
          onSubmit={(e) => {
            e.preventDefault();
            setTask(taskDraft.trim());
          }}
        >
          <label htmlFor="task" className="text-sm text-mist-600">
            這一組想完成的事
          </label>
          <div className="flex gap-2">
            <input
              id="task"
              value={taskDraft}
              onChange={(e) => setTaskDraft(e.target.value)}
              maxLength={40}
              placeholder="例如：讀完第三章、寫完報告大綱"
              className="min-w-0 flex-1 rounded-xl border-2 border-mist-200 bg-mist-50 px-3 py-2 text-mist-900 outline-none transition-colors placeholder:text-mist-400 focus:border-mist-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={taskDraft.trim() === task}
              className="rounded-xl bg-mist-500 px-4 font-semibold text-white transition-colors hover:bg-mist-600 disabled:opacity-40"
            >
              設定
            </button>
            {task && (
              <button
                type="button"
                onClick={() => {
                  setTask("");
                  setTaskDraft("");
                }}
                className="rounded-xl px-3 text-sm text-mist-500 transition-colors hover:bg-mist-100"
              >
                清除
              </button>
            )}
          </div>
        </form>
        <div className="grid grid-cols-3 gap-3">
          <Stepper label="專注時間" unit="分鐘" value={focusMin} min={1} max={120} disabled={locked} onChange={setFocusMin} />
          <Stepper label="休息時間" unit="分鐘" value={breakMin} min={1} max={60} disabled={locked} onChange={setBreakMin} />
          <Stepper label="組數" unit="組" value={rounds} min={1} max={12} disabled={locked} onChange={setRounds} />
        </div>
        <label className="flex w-fit cursor-pointer select-none items-center gap-3 text-sm text-mist-700">
          <input type="checkbox" checked={autoNext} onChange={(e) => setAutoNext(e.target.checked)} className="peer sr-only" />
          <span className="relative h-6 w-11 rounded-full bg-mist-200 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-mist-500 peer-checked:after:translate-x-5" />
          時間到自動開始下一階段
        </label>
      </section>
    </div>
  );
}
