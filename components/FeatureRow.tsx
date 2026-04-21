"use client";

import type { Feature, Category } from "@/lib/types";
import { categoryColors, relativeDate } from "@/lib/utils";

interface Props {
  feature: Feature;
  category: Category;
  onClick: () => void;
}

export function FeatureRow({ feature, category, onClick }: Props) {
  const colors = categoryColors[feature.category];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left group flex items-center gap-4 px-4 sm:px-5 py-3.5 rounded-lg border border-transparent hover:border-stone-200 hover:bg-white hover:shadow-sm transition-all ${
        feature.importance >= 4 ? "border-l-amber-400 border-l-[3px]" : ""
      }`}
    >
      {/* category dot + label */}
      <div className="hidden sm:flex items-center gap-2 w-28 shrink-0">
        <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
        <span className={`text-sm ${colors.textDark}`}>
          {category.label}
        </span>
      </div>

      {/* mobile: dot only */}
      <span className={`sm:hidden w-2.5 h-2.5 rounded-full shrink-0 ${colors.dot}`} />

      {/* title + summary */}
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-medium text-stone-900 truncate group-hover:text-amber-800 transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm text-stone-500 truncate mt-0.5 hidden md:block">
          {feature.summary}
        </p>
      </div>

      {/* importance */}
      <div className="hidden sm:flex items-center gap-0.5 shrink-0">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full ${
              i <= feature.importance ? "bg-amber-400" : "bg-stone-200"
            }`}
          />
        ))}
      </div>

      {/* date */}
      <time
        className="text-sm text-stone-400 font-mono tabular-nums shrink-0 w-16 text-right"
        dateTime={feature.date}
      >
        {relativeDate(feature.date)}
      </time>

      {/* version */}
      <span className="hidden lg:block text-sm font-mono text-stone-400 shrink-0 w-20 text-right">
        v{feature.version}
      </span>

      {/* arrow */}
      <svg
        className="w-4 h-4 text-stone-300 group-hover:text-amber-500 transition-colors shrink-0"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  );
}
