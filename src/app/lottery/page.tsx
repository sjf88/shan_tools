import type { Metadata } from "next";
import LotteryApp from "./LotteryApp";
import Scenery from "./Scenery";

export const metadata: Metadata = {
  title: "抽獎轉盤 | Shan Tools",
  description: "輸入名單，轉動轉盤，隨機抽出幸運兒。",
};

export default function LotteryPage() {
  return (
    <main className="relative flex-1 overflow-hidden bg-leaf-50 text-slate-800">
      <Scenery />
      <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-leaf-900">
            抽獎轉盤
          </h1>
          <p className="mt-2 text-leaf-500">
            輸入參加名單，按下開始，讓轉盤決定幸運兒。
          </p>
        </header>
        <LotteryApp />
      </div>
    </main>
  );
}
