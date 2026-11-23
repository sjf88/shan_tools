import type { ReactNode } from "react";

type Placement = "top" | "bottom" | "right";

type TooltipProps = {
  content: ReactNode;
  children: ReactNode;
  placement?: Placement;
  /** 引導模式：強制顯示並帶有提示動畫 */
  guide?: boolean;
  /** 一般模式下是否啟用滑鼠移入顯示 */
  disabled?: boolean;
  className?: string;
};

const bubblePos: Record<Placement, string> = {
  top: "bottom-full left-1/2 mb-3 -translate-x-1/2",
  bottom: "top-full left-1/2 mt-3 -translate-x-1/2",
  right: "left-full top-1/2 ml-3 -translate-y-1/2",
};

const arrowPos: Record<Placement, string> = {
  top: "top-full left-1/2 -translate-x-1/2 -mt-1",
  bottom: "bottom-full left-1/2 -translate-x-1/2 -mb-1",
  right: "right-full top-1/2 -translate-y-1/2 -mr-1",
};

export default function Tooltip({
  content,
  children,
  placement = "top",
  guide = false,
  disabled = false,
  className = "",
}: TooltipProps) {
  const visibility = guide
    ? "visible opacity-100"
    : disabled
      ? "invisible opacity-0"
      : "invisible opacity-0 group-hover/tip:visible group-hover/tip:opacity-100 group-focus-within/tip:visible group-focus-within/tip:opacity-100";

  const color = guide ? "bg-sun text-[#1C3B2C]" : "bg-leaf-900 text-white";
  const arrowColor = guide ? "bg-sun" : "bg-leaf-900";

  return (
    <div className={`group/tip relative ${className}`}>
      {children}
      <div
        role="tooltip"
        className={`pointer-events-none absolute z-20 w-max max-w-60 transition-opacity duration-200 ${bubblePos[placement]} ${visibility}`}
      >
        <div
          className={`relative rounded-lg px-3 py-2 text-sm font-medium shadow-sm ${color} ${guide ? "animate-tip-float" : ""}`}
        >
          {content}
          <span
            className={`absolute size-2.5 rotate-45 ${arrowColor} ${arrowPos[placement]}`}
          />
        </div>
      </div>
    </div>
  );
}
