import type { Metadata } from "next";
import FortuneApp from "./FortuneApp";

export const metadata: Metadata = {
  title: "好運抽籤 | Shan Tools",
  description: "隨機抽一支籤，看看今天的運勢。",
};

export default function FortunePage() {
  return (
    // 此頁固定淺色模式：只使用固定色碼，不受全站暗色色票影響
    <main className="flex flex-1 flex-col bg-[#FFF5F2] text-[#3B2A28] [color-scheme:light]">
      <FortuneApp />
    </main>
  );
}
