"use client";

import { useEffect, useCallback } from "react";
import type { Feature, Category } from "@/lib/types";
import { categoryColors, formatDate } from "@/lib/utils";

interface Props {
  feature: Feature;
  category: Category;
  onClose: () => void;
  onPrev: (() => void) | null;
  onNext: (() => void) | null;
}

export function FeatureModal({ feature, category, onClose, onPrev, onNext }: Props) {
  const colors = categoryColors[feature.category];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm animate-fade-in" />

      {/* modal */}
      <div
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* top accent bar */}
        <div className={`h-1.5 rounded-t-xl ${colors.accent}`} />

        <div className="p-6 sm:p-8">
          {/* header */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors.dot}`} />
              <span className={`text-sm font-medium ${colors.textDark}`}>
                {category.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-600 transition-colors p-1"
              aria-label="닫기"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* title */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 leading-tight tracking-tight mb-3">
            {feature.title}
          </h2>

          {/* meta row */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-stone-500 mb-6">
            <span className="font-mono">v{feature.version}</span>
            <span className="text-stone-300">·</span>
            <time dateTime={feature.date}>{formatDate(feature.date)}</time>
          </div>

          {/* summary */}
          <p className="text-base text-stone-700 leading-relaxed mb-6">
            {feature.summary}
          </p>

          {/* details */}
          {feature.details && (
            <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-stone-600 leading-relaxed">
                {feature.details}
              </p>
            </div>
          )}

          {/* scores */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <ScoreDisplay label="중요도" value={feature.importance} color="amber" />
            <ScoreDisplay label="사용성" value={feature.usability} color="emerald" />
          </div>

          {/* tags */}
          {feature.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {feature.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm font-mono text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* actions */}
          <div className="flex items-center justify-between pt-4 border-t border-stone-200">
            <div className="flex gap-2">
              {onPrev && (
                <button
                  onClick={onPrev}
                  className="text-sm text-stone-500 hover:text-stone-700 transition-colors px-3 py-1.5 rounded-md hover:bg-stone-100"
                >
                  ← 이전
                </button>
              )}
              {onNext && (
                <button
                  onClick={onNext}
                  className="text-sm text-stone-500 hover:text-stone-700 transition-colors px-3 py-1.5 rounded-md hover:bg-stone-100"
                >
                  다음 →
                </button>
              )}
            </div>
            <a
              href={feature.docUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors px-3 py-1.5 rounded-md hover:bg-amber-50"
            >
              공식 문서 보기
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreDisplay({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "amber" | "emerald";
}) {
  const dotColor = color === "amber" ? "bg-amber-400" : "bg-emerald-400";
  const emptyColor = "bg-stone-200";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-stone-600">{label}</span>
        <span className="text-sm font-mono font-medium text-stone-800">{value}/5</span>
      </div>
      <div className="flex gap-1 h-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`flex-1 rounded-full ${i <= value ? dotColor : emptyColor}`}
          />
        ))}
      </div>
    </div>
  );
}
