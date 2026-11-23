import Link from "next/link";
import type { ReactNode } from "react";
import CurrentYear from "./CurrentYear";

/* 首頁固定淺色藍色調，全部使用固定色碼，不受暗色色票影響 */

const TOOLS: {
  href: string;
  name: string;
  tag: string;
  desc: string;
  art: ReactNode;
}[] = [
  {
    href: "/lottery",
    name: "抽獎轉盤",
    tag: "隨機抽選",
    desc: "輸入參加名單，按下開始讓轉盤旋轉，公平抽出幸運兒。支援抽中後自動移除與中獎紀錄。",
    art: <WheelArt />,
  },
  {
    href: "/pomodoro",
    name: "番茄鐘",
    tag: "專注學習",
    desc: "自訂專注時間、休息時間與組數，設定本組目標，搭配激勵格言，陪你一步步完成任務。",
    art: <TimerArt />,
  },
  {
    href: "/fortune",
    name: "好運抽籤",
    tag: "今日運勢",
    desc: "搖一搖籤筒，抽出大吉到大凶，查看學業、工作、財運、感情與健康的今日運勢。",
    art: <FortuneArt />,
  },
];

function WheelArt() {
  const colors = ["#3B82F6", "#93C5FD", "#1D4ED8", "#BFDBFE", "#60A5FA", "#DBEAFE"];
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden>
      <g transform="translate(100 82)">
        {colors.map((c, i) => {
          const a1 = (i * 60 * Math.PI) / 180;
          const a2 = ((i + 1) * 60 * Math.PI) / 180;
          const r = 56;
          return (
            <path
              key={i}
              d={`M0 0 L${(r * Math.sin(a1)).toFixed(2)} ${(-r * Math.cos(a1)).toFixed(2)} A${r} ${r} 0 0 1 ${(r * Math.sin(a2)).toFixed(2)} ${(-r * Math.cos(a2)).toFixed(2)} Z`}
              fill={c}
              stroke="#FFFFFF"
              strokeWidth="2"
            />
          );
        })}
        <circle r="60" fill="none" stroke="#FFFFFF" strokeWidth="5" />
        <circle r="10" fill="#FFFFFF" />
        <circle r="5" fill="#1D4ED8" />
        <path d="M-9 -72 H9 L0 -56 Z" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function TimerArt() {
  const r = 48;
  const circ = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden>
      <g transform="translate(100 82)">
        <circle r={r} fill="#FFFFFF" fillOpacity="0.6" stroke="#DBEAFE" strokeWidth="10" />
        <circle
          r={r}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * 0.32}
          transform="rotate(-90)"
        />
        <text y="8" textAnchor="middle" fontSize="24" fontWeight="700" fill="#1E3A8A" fontFamily="ui-monospace, monospace">
          25:00
        </text>
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={-21 + i * 14} cy="70" r="4" fill={i < 2 ? "#3B82F6" : "#BFDBFE"} />
        ))}
      </g>
    </svg>
  );
}

function FortuneArt() {
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden>
      <g transform="translate(100 0)">
        {[-14, -5, 4, 13].map((rot, i) => (
          <rect key={i} x="-4" y="22" width="8" height="60" rx="4" fill={i === 1 ? "#F59E0B" : "#FCD9A0"} transform={`rotate(${rot} 0 92)`} />
        ))}
        <path d="M-34 58 H34 V128 Q34 142 20 142 H-20 Q-34 142 -34 128 Z" fill="#2563EB" />
        <rect x="-34" y="58" width="68" height="10" fill="#1D4ED8" />
        <rect x="-12" y="78" width="24" height="50" rx="6" fill="#FFFFFF" />
        <text x="0" y="98" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2563EB">大</text>
        <text x="0" y="117" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2563EB">吉</text>
      </g>
      <path d="M40 40 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3 Z" fill="#FFFFFF" />
      <path d="M160 100 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 Z" fill="#FFFFFF" />
    </svg>
  );
}

const glass =
  "border border-[#FFFFFF]/60 bg-[#FFFFFF]/35 shadow-[0_8px_32px_rgba(30,64,175,0.12)] backdrop-blur-xl";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-[#E4EBF3] text-[#0F2A5C] [color-scheme:light]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#2563EB] text-[#FFFFFF]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-xl bg-[#FFFFFF] text-[#2563EB]">
              <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" />
              </svg>
            </span>
            Shan 的工具箱
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            {TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="hidden rounded-lg px-3 py-2 text-[#DBEAFE] transition-colors hover:bg-[#FFFFFF]/15 hover:text-[#FFFFFF] sm:block"
              >
                {t.name}
              </Link>
            ))}
            <a href="#tools" className="ml-1 rounded-lg bg-[#FFFFFF] px-4 py-2 font-medium text-[#2563EB] transition-colors hover:bg-[#DBEAFE]">
              開始使用
            </a>
          </nav>
        </div>
      </header>

      <main className="relative flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-4 pb-14 pt-20 text-center sm:px-6 sm:pt-28">
          <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium text-[#2563EB] ${glass}`}>
            ✦ 簡單好用的日常小工具
          </span>
          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Shan 的
            <span className="ml-1 text-[#2563EB]">工具箱</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#4A6491]">
            打開瀏覽器就能用
            <br className="hidden sm:block" />
            讓生活多一點效率與樂趣
          </p>
        </section>

        {/* 工具卡片 */}
        <section id="tools" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-24 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {TOOLS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`group flex flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_40px_rgba(30,64,175,0.2)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#93C5FD] ${glass}`}
              >
                {/* 上半：圖示 */}
                <div className="relative h-48 bg-gradient-to-br from-[#DBEAFE]/80 to-[#EFF6FF]/40 p-4">
                  <div className="h-full transition-transform duration-500 group-hover:scale-105">{t.art}</div>
                  <span className="absolute left-4 top-4 rounded-full bg-[#FFFFFF]/70 px-3 py-1 text-xs font-medium text-[#2563EB] backdrop-blur">
                    {t.tag}
                  </span>
                </div>
                {/* 下半：介紹 */}
                <div className="flex flex-1 flex-col gap-3 border-t border-[#FFFFFF]/60 p-6">
                  <h2 className="text-xl font-bold">{t.name}</h2>
                  <p className="flex-1 text-sm leading-relaxed text-[#4A6491]">{t.desc}</p>
                  <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-[#2563EB] px-5 py-2 text-sm font-semibold text-[#FFFFFF] transition-colors group-hover:bg-[#1D4ED8]">
                    View
                    <svg viewBox="0 0 24 24" className="size-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative bg-[#1E40AF] text-[#BFDBFE]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm sm:flex-row sm:px-6">
          <span className="font-semibold text-[#FFFFFF]">Shan 的工具箱</span>
          <nav className="flex gap-4">
            {TOOLS.map((t) => (
              <Link key={t.href} href={t.href} className="transition-colors hover:text-[#FFFFFF]">
                {t.name}
              </Link>
            ))}
          </nav>
          <span>© <CurrentYear /> Shan Tools</span>
        </div>
      </footer>
    </div>
  );
}
