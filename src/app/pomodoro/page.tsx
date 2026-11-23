import type { Metadata } from "next";
import PomodoroApp from "./PomodoroApp";

export const metadata: Metadata = {
  title: "番茄鐘 | Shan Tools",
  description: "自訂專注時間、休息時間與組數的番茄鐘。",
};

export default function PomodoroPage() {
  return (
    <main className="flex-1 bg-gradient-to-b from-mist-100 to-white text-mist-900">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <PomodoroApp />
      </div>
    </main>
  );
}
