/* global React, Header, Controls, FilterPanel, FeatureRow, FeatureModal, categoryMeta, FEATURES_DATA */
const { useState, useMemo } = React;

function Dashboard() {
  const data = FEATURES_DATA;
  const [query, setQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState(new Set());
  const [sortMode, setSortMode] = useState("date");
  const [minImportance, setMinImportance] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const counts = useMemo(() => {
    const c = {};
    for (const cat of data.categories) c[cat.id] = 0;
    for (const f of data.features) c[f.category] = (c[f.category] || 0) + 1;
    return c;
  }, [data]);

  const filtered = useMemo(() => {
    let r = data.features.filter(f => {
      if (activeCategories.size > 0 && !activeCategories.has(f.category)) return false;
      if (f.importance < minImportance) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = [f.title, f.summary, f.details, f.tags.join(" "), f.version].join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    r = r.sort((a, b) => {
      if (sortMode === "importance") return b.importance - a.importance;
      if (sortMode === "usability") return b.usability - a.usability;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    return r;
  }, [data.features, query, activeCategories, sortMode, minImportance]);

  const hasFilters = query !== "" || activeCategories.size > 0 || minImportance > 0;
  const selected = selectedIndex !== null ? filtered[selectedIndex] : null;
  const coreCount = data.features.filter(f => f.importance >= 4).length;

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header currentVersion={data.meta.currentVersion} totalCount={data.features.length} coreCount={coreCount} />
      <Controls
        query={query} onQuery={setQuery}
        sortMode={sortMode} onSort={setSortMode}
        showFilters={showFilters} onToggleFilters={() => setShowFilters(v => !v)}
        resultCount={filtered.length}
        hasFilters={hasFilters}
        onClear={() => { setQuery(""); setActiveCategories(new Set()); setMinImportance(0); }}
      />
      {showFilters && (
        <FilterPanel
          categories={data.categories}
          activeCategories={activeCategories}
          onToggleCategory={(id) => {
            const n = new Set(activeCategories);
            n.has(id) ? n.delete(id) : n.add(id);
            setActiveCategories(n);
          }}
          counts={counts}
          minImportance={minImportance}
          onMinImportance={setMinImportance}
        />
      )}
      <main style={{ maxWidth: 1024, margin: "0 auto", padding: "24px 32px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p className="font-display" style={{ fontSize: 28, color: "#a8a29e", margin: "0 0 6px" }}>결과 없음</p>
            <p style={{ fontSize: 14, color: "#78716c", margin: 0 }}>필터를 조정해보세요.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {filtered.map((f, i) => (
              <FeatureRow key={f.id} feature={f} onClick={() => setSelectedIndex(i)} />
            ))}
          </div>
        )}
      </main>
      <footer style={{ borderTop: "1px solid #e7e5e4", marginTop: 40 }}>
        <div style={{
          maxWidth: 1024, margin: "0 auto", padding: "24px 32px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontSize: 13, color: "#78716c",
        }}>
          <div>데이터 출처: <a href={data.meta.source} target="_blank" rel="noopener noreferrer"
            style={{ color: "#b45309", textDecoration: "underline", textUnderlineOffset: 2 }}>
            Claude Code 공식 Changelog</a></div>
          <div style={{ color: "#a8a29e" }}>마지막 갱신 · {data.meta.lastUpdated}</div>
        </div>
      </footer>
      {selected && (
        <FeatureModal
          feature={selected}
          onClose={() => setSelectedIndex(null)}
          onPrev={selectedIndex > 0 ? () => setSelectedIndex(selectedIndex - 1) : null}
          onNext={selectedIndex < filtered.length - 1 ? () => setSelectedIndex(selectedIndex + 1) : null}
        />
      )}
    </div>
  );
}

Object.assign(window, { Dashboard });
