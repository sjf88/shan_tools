function Leaf({ className, flip }: { className: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 60 90" className={className} aria-hidden style={flip ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M30 88 C30 60 30 40 30 6" stroke="#4F8A66" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M30 70 C10 66 4 50 8 40 C22 44 30 56 30 70 Z" fill="#4F8A66" />
      <path d="M30 52 C50 48 56 32 52 22 C38 26 30 38 30 52 Z" fill="#5E9B74" />
      <path d="M30 30 C16 26 14 12 18 4 C28 10 31 20 30 30 Z" fill="#6FA884" />
    </svg>
  );
}

function Sparkle({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill="#fff" />
    </svg>
  );
}

/** 背景裝飾：柔和山丘、葉子與星光 */
export default function Scenery() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden>
      <svg className="absolute bottom-0 left-0 h-2/3 w-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
        <path d="M0 160 C200 60 380 80 560 150 C760 230 960 90 1200 130 V400 H0 Z" fill="var(--color-leaf-100)" />
        <path d="M0 260 C240 180 420 220 640 270 C840 320 1000 220 1200 240 V400 H0 Z" fill="var(--color-leaf-200)" />
      </svg>
      <Leaf className="absolute -bottom-2 left-2 h-48 w-32 opacity-80 sm:left-8" />
      <Leaf className="absolute -bottom-2 right-2 h-40 w-28 opacity-80 sm:right-10" flip />
      <Leaf className="absolute left-[46%] top-6 hidden h-16 w-10 rotate-[30deg] opacity-50 lg:block" />
      <Sparkle className="absolute left-[8%] top-24 size-6 opacity-90" />
      <Sparkle className="absolute right-[12%] top-16 size-8 opacity-90" />
      <Sparkle className="absolute bottom-40 right-[30%] size-5 opacity-80" />
      <Sparkle className="absolute bottom-24 left-[35%] size-4 opacity-80" />
    </div>
  );
}
