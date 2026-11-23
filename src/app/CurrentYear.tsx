"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/** 年份在瀏覽器端計算（伺服器元件在 Cache Components 下不能直接讀取當下時間） */
export default function CurrentYear() {
  return <>{useSyncExternalStore(noop, () => new Date().getFullYear(), () => null)}</>;
}
