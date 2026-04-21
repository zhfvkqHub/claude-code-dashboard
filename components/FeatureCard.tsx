"use client";

import { useState } from "react";
import type { Feature, Category } from "@/lib/types";
import { categoryColors, formatDate, relativeDate } from "@/lib/utils";

interface Props {
  feature: Feature;
  category: Category;
  index: number;
}

export function FeatureCard({ feature, category, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const colors = categoryColors[feature.category];

  return (
    <article
      className={`fade-up group relative flex flex-col border ${colors.border} ${colors.bg} hair-border rounded-sm p-5 transition-all hover:scale-[1.01] hover:shadow-xl ${colors.glow}`}
      style={{ animationDelay: `${Math.min(index * 30, 600)}ms` }}
    >
      {/* importance top marker */}
      {feature.importance >= 5 && (
        <div className="absolute -top-px left-4 right-4 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
      )}

      <header className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
          <span className={`text-[10px] uppercase tracking-[0.15em] font-mono ${colors.text}`}>
            {category.label}
          </span>
        </div>
        <time
          className="text-[10px] font-mono text-stone-500 tabular-nums shrink-0"
          dateTime={feature.date}
          title={formatDate(feature.date)}
        >
          {relativeDate(feature.date)}
        </time>
      </header>

      <h3 className="font-display text-xl text-stone-100 leading-tight mb-2 text-balance">
        {feature.title}
      </h3>

      <p className="text-sm text-stone-400 leading-relaxed mb-4 text-pretty flex-1">
        {feature.summary}
      </p>

      {expanded && (
        <div className="text-xs text-stone-400 leading-relaxed mb-4 pl-3 border-l border-stone-700 fade-up">
          {feature.details}
        </div>
      )}

      {/* scores */}
      <div className="grid grid-cols-2 gap-3 mb-4 text-[10px] font-mono text-stone-500">
        <ScoreBar label="중요도" value={feature.importance} color="amber" />
        <ScoreBar label="사용성" value={feature.usability} color="emerald" />
      </div>

      {/* tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {feature.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[10px] font-mono text-stone-500 bg-stone-900/50 px-1.5 py-0.5 rounded-sm border border-stone-800"
          >
            {tag}
          </span>
        ))}
      </div>

      <footer className="flex items-center justify-between pt-3 border-t border-stone-800/60">
        <span className="text-[10px] font-mono text-stone-600 tabular-nums">
          v{feature.version}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="text-[10px] font-mono text-stone-500 hover:text-amber-400 transition-colors"
            aria-expanded={expanded}
          >
            {expanded ? "접기" : "자세히"}
          </button>
          <a
            href={feature.docUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-mono text-amber-500 hover:text-amber-300 transition-colors flex items-center gap-1 group/link"
            aria-label={`${feature.title} 공식 문서로 이동`}
          >
            공식문서
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            >
              <path
                d="M2 8L8 2M8 2H3.5M8 2V6.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </a>
        </div>
      </footer>
    </article>
  );
}

function ScoreBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "amber" | "emerald";
}) {
  const colorClasses = {
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-stone-500">{label}</span>
        <span className="text-stone-300 tabular-nums">{value}/5</span>
      </div>
      <div className="flex gap-0.5 h-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm ${i <= value ? colorClasses[color] : "bg-stone-800"}`}
          />
        ))}
      </div>
    </div>
  );
}
