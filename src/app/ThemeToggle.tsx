"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";

// 這些頁面固定淺色，不顯示切換按鈕
const LIGHT_ONLY = ["/", "/fortune"];

const STORAGE_KEY = "theme";
const EVENT = "themechange";

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

const isDark = () => document.documentElement.classList.contains("dark");

export default function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);
  const pathname = usePathname();

  function toggle() {
    const next = !isDark();
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      /* 無法寫入時僅本次生效 */
    }
    window.dispatchEvent(new Event(EVENT));
  }

  if (LIGHT_ONLY.includes(pathname)) return null;

  const label = dark ? "切換為亮色模式" : "切換為暗色模式";

  return (
    <div className="group fixed right-4 top-4 z-40">
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        className="flex size-11 items-center justify-center rounded-full bg-white/80 text-slate-600 shadow-sm ring-1 ring-slate-200 backdrop-blur transition-colors hover:text-slate-900 dark:bg-neutral-900 dark:text-yellow-400 dark:ring-yellow-400/30 dark:hover:text-yellow-300"
      >
        {dark ? (
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        )}
      </button>
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full mt-2 w-max rounded-lg bg-slate-800 px-2.5 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-yellow-400 dark:text-black"
      >
        {label}
      </span>
    </div>
  );
}
