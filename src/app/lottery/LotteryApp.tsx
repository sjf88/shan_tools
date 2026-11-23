"use client";

import { useMemo, useState } from "react";
import Tooltip from "./Tooltip";
import Wheel from "./Wheel";

const SPIN_MS = 5000;
const SAMPLE = ["小明", "小華", "阿美", "志強", "雅婷", "家豪", "怡君", "建宏"];

function parseNames(text: string) {
  return text
    .split(/[\n,，]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function randomInt(max: number) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % max;
}

export default function LotteryApp() {
  const [text, setText] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [winner, setWinner] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [removeAfterDraw, setRemoveAfterDraw] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const names = useMemo(() => parseNames(text), [text]);
  const canSpin = names.length >= 2 && !spinning;

  // 引導步驟：先輸入名單，再按下開始
  const guideInput = names.length < 2 && !inputFocused && !spinning;
  const guideSpin = canSpin && !hasSpun && !inputFocused && winner === null;

  function spin() {
    if (!canSpin) return;
    const n = names.length;
    const idx = randomInt(n);
    const seg = 360 / n;
    // 落點在格子中段，避開邊界
    const jitter = (Math.random() - 0.5) * seg * 0.7;
    const target = (idx + 0.5) * seg + jitter;
    const base = rotation - (rotation % 360);
    const next = base + 360 * 6 + (360 - target);

    setPendingIndex(idx);
    setWinner(null);
    setSpinning(true);
    setHasSpun(true);
    setRotation(next);
  }

  function handleSpinEnd() {
    if (!spinning || pendingIndex === null) return;
    const name = names[pendingIndex];
    setSpinning(false);
    setPendingIndex(null);
    setWinner(name);
    setHistory((h) => [name, ...h]);
  }

  function closeResult() {
    if (winner && removeAfterDraw) removeName(winner);
    setWinner(null);
  }

  function removeName(name: string) {
    const list = parseNames(text);
    const i = list.indexOf(name);
    if (i >= 0) list.splice(i, 1);
    setText(list.join("\n"));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      {/* 左側：名單 */}
      <section className="flex flex-col gap-4 rounded-3xl bg-cream/90 p-6 shadow-[0_8px_30px_-12px_rgba(47,107,79,0.25)] ring-1 ring-leaf-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-leaf-900">參加名單</h2>
          <span className="rounded-full bg-leaf-100 px-3 py-1 text-sm text-slate-600">
            {names.length} 人
          </span>
        </div>

        <Tooltip
          placement="bottom"
          guide={guideInput}
          disabled={spinning}
          content={
            guideInput ? "① 在這裡輸入名單，每行一位（至少 2 位）" : "每行一位，也可以用逗號分隔"
          }
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            disabled={spinning}
            rows={10}
            placeholder={"例如：\n小明\n小華\n阿美"}
            className={`w-full resize-y rounded-xl border-2 bg-white p-3 text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-leaf-500 focus:bg-white disabled:opacity-60 ${
              guideInput ? "border-leaf-300" : "border-leaf-200"
            }`}
          />
        </Tooltip>

        <div className="flex flex-wrap gap-2">
          <Tooltip content="填入一組範例名單" disabled={spinning}>
            <button
              type="button"
              onClick={() => setText(SAMPLE.join("\n"))}
              disabled={spinning}
              className="rounded-lg bg-leaf-100 px-3 py-2 text-sm font-medium text-leaf-700 transition-colors hover:bg-leaf-200 disabled:opacity-50"
            >
              填入範例
            </button>
          </Tooltip>
          <Tooltip content="清空所有名單" disabled={spinning}>
            <button
              type="button"
              onClick={() => setText("")}
              disabled={spinning || text === ""}
              className="rounded-lg bg-leaf-100 px-3 py-2 text-sm font-medium text-leaf-700 transition-colors hover:bg-leaf-200 disabled:opacity-50"
            >
              清空
            </button>
          </Tooltip>
        </div>

        <Tooltip
          content="開啟後，抽中的人會自動從名單移除，避免重複中獎"
          placement="top"
          className="w-fit"
        >
          <label className="flex cursor-pointer select-none items-center gap-3 text-sm text-leaf-700">
            <input
              type="checkbox"
              checked={removeAfterDraw}
              onChange={(e) => setRemoveAfterDraw(e.target.checked)}
              className="peer sr-only"
            />
            <span className="relative h-6 w-11 rounded-full bg-leaf-200 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-leaf-600 peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-leaf-300" />
            抽中後從名單移除
          </label>
        </Tooltip>

        {history.length > 0 && (
          <div className="border-t border-leaf-100 pt-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-leaf-900">中獎紀錄</h3>
              <button
                type="button"
                onClick={() => setHistory([])}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                清除紀錄
              </button>
            </div>
            <ol className="flex max-h-40 flex-col gap-1 overflow-y-auto text-sm">
              {history.map((h, i) => (
                <li
                  key={`${h}-${history.length - i}`}
                  className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5"
                >
                  <span className="w-6 text-slate-400">#{history.length - i}</span>
                  <span className="font-medium text-leaf-700">{h}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </section>

      {/* 右側：轉盤 */}
      <section className="flex flex-col items-center gap-8 rounded-3xl bg-cream/90 p-6 shadow-[0_8px_30px_-12px_rgba(47,107,79,0.25)] ring-1 ring-leaf-200 sm:p-10">
        <Wheel
          names={names}
          rotation={rotation}
          spinning={spinning}
          durationMs={SPIN_MS}
          onSpinEnd={handleSpinEnd}
        />

        <Tooltip
          placement="top"
          guide={guideSpin}
          content={
            guideSpin
              ? "② 名單準備好了！按這裡開始抽獎"
              : names.length < 2
                ? "請先輸入至少 2 位參加者"
                : "再抽一次"
          }
          disabled={spinning}
        >
          <button
            type="button"
            onClick={spin}
            disabled={!canSpin}
            className={`rounded-full bg-leaf-600 px-12 py-4 text-lg font-bold text-white transition-all hover:bg-leaf-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300 ${
              guideSpin ? "ring-4 ring-leaf-200" : ""
            }`}
          >
            {spinning ? "轉動中…" : "開始抽獎"}
          </button>
        </Tooltip>
      </section>

      {/* 結果 */}
      {winner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-leaf-900/40 p-4"
          onClick={closeResult}
        >
          <div
            className="animate-pop w-full max-w-sm rounded-3xl bg-cream p-8 ring-4 ring-sun text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-medium text-leaf-600">恭喜中獎</p>
            <p className="mt-3 break-words text-4xl font-bold text-leaf-900">
              {winner}
            </p>
            <p className="mt-3 text-sm text-slate-500">
              {removeAfterDraw ? "關閉後將從名單中移除" : "名單維持不變"}
            </p>
            <button
              type="button"
              onClick={closeResult}
              autoFocus
              className="mt-6 w-full rounded-xl bg-leaf-600 py-3 font-semibold text-white transition-colors hover:bg-leaf-700"
            >
              好的
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
