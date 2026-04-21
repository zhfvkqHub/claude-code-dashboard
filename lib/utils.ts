import type { CategoryId } from "./types";

export const categoryColors: Record<
  CategoryId,
  {
    bg: string;
    border: string;
    text: string;
    dot: string;
    glow: string;
  }
> = {
  core: {
    bg: "bg-amber-950/40",
    border: "border-amber-700/50",
    text: "text-amber-300",
    dot: "bg-amber-400",
    glow: "shadow-amber-500/20",
  },
  productivity: {
    bg: "bg-emerald-950/40",
    border: "border-emerald-700/50",
    text: "text-emerald-300",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/20",
  },
  integration: {
    bg: "bg-sky-950/40",
    border: "border-sky-700/50",
    text: "text-sky-300",
    dot: "bg-sky-400",
    glow: "shadow-sky-500/20",
  },
  platform: {
    bg: "bg-violet-950/40",
    border: "border-violet-700/50",
    text: "text-violet-300",
    dot: "bg-violet-400",
    glow: "shadow-violet-500/20",
  },
  security: {
    bg: "bg-rose-950/40",
    border: "border-rose-700/50",
    text: "text-rose-300",
    dot: "bg-rose-400",
    glow: "shadow-rose-500/20",
  },
  dx: {
    bg: "bg-orange-950/40",
    border: "border-orange-700/50",
    text: "text-orange-300",
    dot: "bg-orange-400",
    glow: "shadow-orange-500/20",
  },
};

export function formatDate(dateStr: string, locale: string = "ko-KR"): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function daysAgo(dateStr: string): number {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
}

export function relativeDate(dateStr: string): string {
  const days = daysAgo(dateStr);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}
