export type Tier = "great" | "good" | "fair" | "bad";

export type Level = {
  name: string;
  tier: Tier;
  weight: number;
  stars: [number, number]; // 各項運勢星數範圍
  poem: string;
  summary: string;
};

export const LEVELS: Level[] = [
  {
    name: "大吉",
    tier: "great",
    weight: 9,
    stars: [4, 5],
    poem: "春風得意馬蹄疾，一日看盡長安花。",
    summary: "諸事順遂、貴人相助，今天適合勇敢跨出第一步，想做的事就放手去做吧！",
  },
  {
    name: "吉",
    tier: "good",
    weight: 45,
    stars: [3, 5],
    poem: "長風破浪會有時，直掛雲帆濟滄海。",
    summary: "運勢穩定向上，努力會被看見，保持節奏就能收穫好結果。",
  },
  {
    name: "中吉",
    tier: "good",
    weight: 64,
    stars: [3, 4],
    poem: "山重水複疑無路，柳暗花明又一村。",
    summary: "小有波折但終能化解，遇到卡關時換個角度想，答案就在不遠處。",
  },
  {
    name: "小吉",
    tier: "fair",
    weight: 64,
    stars: [2, 4],
    poem: "千里之行，始於足下。",
    summary: "平穩中帶點小確幸，把握身邊的小機會，一步一步累積好運。",
  },
  {
    name: "末吉",
    tier: "fair",
    weight: 64,
    stars: [2, 3],
    poem: "沉舟側畔千帆過，病樹前頭萬木春。",
    summary: "運勢慢熱，前半天平淡、後半天漸入佳境，耐心是今天的關鍵字。",
  },
  {
    name: "凶",
    tier: "bad",
    weight: 45,
    stars: [1, 3],
    poem: "行到水窮處，坐看雲起時。",
    summary: "今天容易分心或出小差錯，凡事多確認一次，放慢腳步反而更順。",
  },
  {
    name: "大凶",
    tier: "bad",
    weight: 9,
    stars: [1, 2],
    poem: "天將降大任於斯人也，必先苦其心志。",
    summary: "低潮是轉運的開始！今天宜低調、宜休息，把挑戰當作練功，明天會更好。",
  },
];

export const ASPECTS = ["學業", "工作", "財運", "感情", "健康"] as const;

export const ASPECT_TIPS: Record<(typeof ASPECTS)[number], Record<Tier, string[]>> = {
  學業: {
    great: ["靈感泉湧，難題迎刃而解", "專注力滿點，適合挑戰進度"],
    good: ["溫故知新，複習效果佳", "與同學討論能激發想法"],
    fair: ["按部就班，別貪多", "整理筆記會有收穫"],
    bad: ["容易分心，試試番茄鐘", "先從簡單的題目暖身"],
  },
  工作: {
    great: ["提案容易被採納", "貴人出現，合作順利"],
    good: ["效率不錯，能提早完成任務", "適合主動爭取機會"],
    fair: ["照計畫走就不會出錯", "細節多留意即可"],
    bad: ["溝通易生誤會，多確認", "避免臨時改變計畫"],
  },
  財運: {
    great: ["可能有意外之財", "投資眼光精準"],
    good: ["收支平衡，小有進帳", "適合規劃預算"],
    fair: ["量入為出最安心", "小額消費帶來好心情"],
    bad: ["忍住衝動購物", "暫緩大筆支出"],
  },
  感情: {
    great: ["桃花朵朵開，魅力大增", "適合表達心意"],
    good: ["相處融洽，默契加分", "一句關心能拉近距離"],
    fair: ["平淡中見真情", "多傾聽對方的想法"],
    bad: ["說話前先想三秒", "給彼此一點空間"],
  },
  健康: {
    great: ["精神飽滿，活力十足", "適合運動流汗"],
    good: ["狀態穩定，記得多喝水", "散步能帶來好心情"],
    fair: ["注意作息，別熬夜", "久坐記得起身伸展"],
    bad: ["容易疲倦，早點休息", "飲食清淡為宜"],
  },
};

export const LUCKY_COLORS = ["紅色", "橙色", "金黃色", "薄荷綠", "天藍色", "靛藍色", "紫色", "粉色", "白色", "米色"];
