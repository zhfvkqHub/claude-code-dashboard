"use client";

import { useMemo, useState } from "react";
import type { FeaturesData, CategoryId, SortMode, Feature } from "@/lib/types";
import { categoryColors } from "@/lib/utils";
import { FeatureRow } from "./FeatureRow";
import { FeatureModal } from "./FeatureModal";

interface Props {
  data: FeaturesData;
}

export function Dashboard({ data }: Props) {
  const [query, setQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<Set<CategoryId>>(
    new Set(),
  );
  const [sortMode, setSortMode] = useState<SortMode>("date");
  const [minImportance, setMinImportance] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categoryMap = useMemo(
    () => Object.fromEntries(data.categories.map((c) => [c.id, c])),
    [data.categories],
  );

  const filtered = useMemo(() => {
    let result = data.features.filter((f) => {
      if (activeCategories.size > 0 && !activeCategories.has(f.category))
        return false;
      if (f.importance < minImportance) return false;
      if (query) {
        const q = query.toLowerCase();
        const haystack =
          f.title.toLowerCase() +
          " " +
          f.summary.toLowerCase() +
          " " +
          f.details.toLowerCase() +
          " " +
          f.tags.join(" ").toLowerCase() +
          " " +
          f.version;
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    result = result.sort((a, b) => {
      if (sortMode === "importance") return b.importance - a.importance;
      if (sortMode === "usability") return b.usability - a.usability;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return result;
  }, [data.features, query, activeCategories, sortMode, minImportance]);

  const toggleCategory = (id: CategoryId) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearFilters = () => {
    setQuery("");
    setActiveCategories(new Set());
    setMinImportance(0);
  };

  const hasFilters =
    query !== "" || activeCategories.size > 0 || minImportance > 0;

  const selectedFeature = selectedIndex !== null ? filtered[selectedIndex] : null;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                style={{ background: "#f59e0b" }}
              >
                <span
                  className="font-mono font-bold text-stone-900"
                  style={{ fontSize: 11, letterSpacing: "0.5px" }}
                >
                  CCR
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
                Claude Code Radar
              </h1>
              <span className="text-sm text-stone-400 hidden sm:inline font-mono">
                v{data.meta.currentVersion}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-stone-500">
              <span>{data.features.length}개 기능</span>
              <span className="hidden sm:inline text-stone-300">·</span>
              <span className="hidden sm:inline">핵심 {data.features.filter((f) => f.importance >= 4).length}개</span>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <section className="sticky top-0 z-10 bg-stone-50/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* search */}
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="기능, 버전, 태그 검색…"
                className="w-full bg-white border border-stone-300 rounded-lg pl-10 pr-4 py-2.5 text-base text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition"
              />
            </div>

            {/* sort */}
            <div className="flex items-center gap-2">
              <div className="flex border border-stone-300 rounded-lg overflow-hidden bg-white">
                {(
                  [
                    ["date", "최신순"],
                    ["importance", "중요도"],
                    ["usability", "사용성"],
                  ] as const
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    onClick={() => setSortMode(mode)}
                    className={`px-3 py-2 text-sm font-medium transition ${
                      sortMode === mode
                        ? "bg-amber-500 text-white"
                        : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* filter toggle */}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition ${
                showFilters || hasFilters
                  ? "border-amber-300 bg-amber-50 text-amber-700"
                  : "border-stone-300 bg-white text-stone-600 hover:border-stone-400"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              필터
              {hasFilters && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>

            {/* result count + clear */}
            <div className="flex items-center gap-3 sm:ml-auto">
              <span className="text-sm text-stone-500">
                {filtered.length}개 결과
              </span>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-stone-500 hover:text-amber-600 transition"
                >
                  초기화
                </button>
              )}
            </div>
          </div>

          {/* expandable filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-stone-200 flex flex-col gap-4">
              {/* categories */}
              <div className="flex flex-wrap gap-2">
                {data.categories.map((cat) => {
                  const isActive = activeCategories.has(cat.id);
                  const colors = categoryColors[cat.id];
                  const count = data.features.filter((f) => f.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition ${
                        isActive
                          ? `${colors.bgLight} ${colors.borderLight} ${colors.textDark} font-medium`
                          : "bg-white border-stone-200 text-stone-600 hover:border-stone-300"
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
                      {cat.label}
                      <span className="text-stone-400 tabular-nums text-xs">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* importance filter */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-stone-600">최소 중요도</span>
                <div className="flex gap-1">
                  {[0, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      onClick={() => setMinImportance(v)}
                      className={`px-3 py-1.5 text-sm rounded-md transition ${
                        minImportance === v
                          ? "bg-stone-800 text-white"
                          : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      {v === 0 ? "모두" : `${v}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* List */}
      <main className="max-w-5xl mx-auto px-5 sm:px-8 py-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-stone-400 mb-2">
              결과 없음
            </p>
            <p className="text-sm text-stone-500">필터를 조정해보세요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {filtered.map((feature, i) => (
              <FeatureRow
                key={feature.id}
                feature={feature}
                category={categoryMap[feature.category]!}
                onClick={() => setSelectedIndex(i)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 mt-10">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-sm text-stone-500">
          <div>
            데이터 출처:{" "}
            <a
              href={data.meta.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-700 hover:text-amber-900 underline underline-offset-2"
            >
              Claude Code 공식 Changelog
            </a>
          </div>
          <div className="text-stone-400">
            마지막 갱신 · {data.meta.lastUpdated}
          </div>
        </div>
      </footer>

      {/* Modal */}
      {selectedFeature && selectedIndex !== null && (
        <FeatureModal
          feature={selectedFeature}
          category={categoryMap[selectedFeature.category]!}
          onClose={() => setSelectedIndex(null)}
          onPrev={selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : null}
          onNext={selectedIndex < filtered.length - 1 ? () => setSelectedIndex(selectedIndex + 1) : null}
        />
      )}
    </div>
  );
}

