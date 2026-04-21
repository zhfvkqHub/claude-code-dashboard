"use client";

import { useMemo, useState } from "react";
import type { FeaturesData, CategoryId, SortMode } from "@/lib/types";
import { categoryColors } from "@/lib/utils";
import { FeatureCard } from "./FeatureCard";

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

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <header className="relative border-b border-stone-900 grain">
        <div className="marquee-stripe absolute top-0 left-0 right-0 h-1" />

        <div className="max-w-7xl mx-auto px-6 pt-12 pb-10 md:pt-16 md:pb-12 relative">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 pulse-glow" />
            <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-amber-500">
              Live · 공식 문서 기준
            </span>
            <span className="text-[11px] font-mono text-stone-600 ml-auto hidden sm:block">
              v{data.meta.currentVersion} · {data.meta.lastUpdated}
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-balance mb-4">
            Claude Code
            <br />
            <span className="italic text-amber-400">Radar.</span>
          </h1>

          <p className="text-stone-400 text-base md:text-lg max-w-xl leading-relaxed text-pretty">
            최신 기능과 업데이트를 한눈에. 공식 changelog 기준으로 중요도·사용성을
            점수화하고 바로 문서로 이동할 수 있게 정리했어요.
          </p>

          <div className="mt-8 flex flex-wrap gap-6 text-xs font-mono text-stone-500">
            <Stat label="큐레이션 기능" value={data.features.length} />
            <Stat
              label="핵심 기능"
              value={
                data.features.filter((f) => f.importance >= 4).length
              }
            />
            <Stat label="카테고리" value={data.categories.length} />
          </div>
        </div>
      </header>

      {/* Controls */}
      <section className="sticky top-0 z-10 bg-stone-950/95 backdrop-blur-md border-b border-stone-900">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
            {/* search */}
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500"
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
              >
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" />
                <path
                  d="M10 10L13 13"
                  stroke="currentColor"
                  strokeLinecap="round"
                />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="기능, 버전, 태그 검색…"
                className="w-full bg-stone-900/60 border border-stone-800 rounded-sm pl-9 pr-3 py-2 text-sm font-mono text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-700 focus:ring-1 focus:ring-amber-700/40 transition"
              />
            </div>

            {/* sort */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-mono text-stone-500">
                정렬
              </span>
              <div className="flex border border-stone-800 rounded-sm overflow-hidden">
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
                    className={`px-3 py-1.5 text-xs font-mono transition ${
                      sortMode === mode
                        ? "bg-amber-500 text-stone-950"
                        : "bg-stone-900/60 text-stone-400 hover:text-stone-200"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* importance filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-mono text-stone-500">
                최소 중요도
              </span>
              <div className="flex gap-0.5">
                {[0, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => setMinImportance(v)}
                    className={`px-2.5 py-1.5 text-xs font-mono transition rounded-sm ${
                      minImportance === v
                        ? "bg-stone-100 text-stone-950"
                        : "bg-stone-900/60 text-stone-500 hover:text-stone-200 border border-stone-800"
                    }`}
                  >
                    {v === 0 ? "모두" : `${v}+`}
                  </button>
                ))}
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-[11px] font-mono text-stone-500 hover:text-amber-400 transition ml-auto"
              >
                필터 초기화 ✕
              </button>
            )}
          </div>

          {/* category pills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {data.categories.map((cat) => {
              const isActive = activeCategories.has(cat.id);
              const colors = categoryColors[cat.id];
              const count = data.features.filter(
                (f) => f.category === cat.id,
              ).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`group inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-full border transition ${
                    isActive
                      ? `${colors.bg} ${colors.border} ${colors.text}`
                      : "bg-stone-900/40 border-stone-800 text-stone-500 hover:text-stone-300"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${colors.dot} ${
                      isActive ? "" : "opacity-40"
                    }`}
                  />
                  {cat.label}
                  <span className="text-stone-600 tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-3xl text-stone-400 mb-2">
              결과 없음
            </p>
            <p className="text-sm text-stone-500 font-mono">
              필터를 바꿔보세요.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-display text-2xl text-stone-300">
                {filtered.length}개 기능
                <span className="text-stone-600 text-sm font-mono ml-3">
                  / {data.features.length}
                </span>
              </h2>
              <p className="text-[11px] font-mono text-stone-600">
                {sortMode === "date" && "최신 업데이트 순"}
                {sortMode === "importance" && "중요도 높은 순"}
                {sortMode === "usability" && "사용성 높은 순"}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((feature, i) => (
                <FeatureCard
                  key={feature.id}
                  feature={feature}
                  category={categoryMap[feature.category]!}
                  index={i}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-900 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-xs font-mono text-stone-500">
          <div>
            데이터 출처:{" "}
            <a
              href={data.meta.source}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-500 hover:text-amber-300 underline underline-offset-2"
            >
              Claude Code 공식 Changelog
            </a>
          </div>
          <div className="text-stone-600">
            마지막 갱신 · {data.meta.lastUpdated}
          </div>
        </div>
      </footer>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="font-display text-2xl text-stone-200 tabular-nums">
        {value}
      </span>
      <span className="uppercase tracking-wider text-stone-500">{label}</span>
    </div>
  );
}
