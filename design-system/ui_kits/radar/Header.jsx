/* global React */
const { useState, useMemo } = React;

function Header({ currentVersion, totalCount, coreCount }) {
  return (
    <header style={{
      borderBottom: "1px solid #e7e5e4", background: "#fff",
    }}>
      <div style={{
        maxWidth: 1024, margin: "0 auto",
        padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, background: "#f59e0b", borderRadius: 6,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#1c1917",
            letterSpacing: "0.5px",
          }}>CCR</div>
          <h1 style={{
            margin: 0, fontSize: 22, fontWeight: 600,
            color: "#1c1917", letterSpacing: "-0.015em",
          }}>Claude Code Radar</h1>
          <span style={{ fontSize: 13, color: "#a8a29e", fontFamily: "var(--font-mono)" }}>
            v{currentVersion}
          </span>
        </div>
        <div style={{ display: "flex", gap: 14, fontSize: 13, color: "#78716c" }}>
          <span>{totalCount}개 기능</span>
          <span style={{ color: "#d6d3d1" }}>·</span>
          <span>핵심 {coreCount}개</span>
        </div>
      </div>
    </header>
  );
}

function Controls({ query, onQuery, sortMode, onSort, showFilters, onToggleFilters, resultCount, hasFilters, onClear }) {
  return (
    <section style={{
      position: "sticky", top: 0, zIndex: 10,
      background: "rgba(250, 250, 249, 0.95)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid #e7e5e4",
    }}>
      <div style={{
        maxWidth: 1024, margin: "0 auto", padding: "16px 32px",
        display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
      }}>
        <div style={{ position: "relative", flex: 1, maxWidth: 380, minWidth: 240 }}>
          <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#a8a29e" }}
               width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11 11L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="기능, 버전, 태그 검색…"
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#fff", border: "1px solid #d6d3d1", borderRadius: 8,
              padding: "10px 14px 10px 36px", fontFamily: "inherit", fontSize: 15,
              color: "#292524", outline: "none",
            }}
            onFocus={(e) => { e.target.style.borderColor = "#f59e0b"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.2)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#d6d3d1"; e.target.style.boxShadow = "none"; }}
          />
        </div>

        <div style={{
          display: "inline-flex", border: "1px solid #d6d3d1", borderRadius: 8,
          overflow: "hidden", background: "#fff",
        }}>
          {[["date", "최신순"], ["importance", "중요도"], ["usability", "사용성"]].map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => onSort(mode)}
              style={{
                padding: "8px 14px", border: 0, fontFamily: "inherit", fontSize: 13, fontWeight: 500,
                cursor: "pointer", transition: "all 150ms",
                background: sortMode === mode ? "#f59e0b" : "transparent",
                color: sortMode === mode ? "#fff" : "#57534e",
              }}
            >{label}</button>
          ))}
        </div>

        <button
          onClick={onToggleFilters}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "8px 12px", border: "1px solid",
            borderColor: showFilters || hasFilters ? "#fcd34d" : "#d6d3d1",
            background: showFilters || hasFilters ? "#fffbeb" : "#fff",
            color: showFilters || hasFilters ? "#b45309" : "#57534e",
            borderRadius: 8, fontFamily: "inherit", fontSize: 13, cursor: "pointer",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          필터
          {hasFilters && <span style={{ width: 6, height: 6, borderRadius: 999, background: "#f59e0b" }} />}
        </button>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 13, color: "#78716c" }}>{resultCount}개 결과</span>
          {hasFilters && (
            <button onClick={onClear} style={{
              background: "none", border: 0, fontFamily: "inherit", fontSize: 13,
              color: "#78716c", cursor: "pointer", padding: 0,
            }}>초기화</button>
          )}
        </div>
      </div>
    </section>
  );
}

function FilterPanel({ categories, activeCategories, onToggleCategory, counts, minImportance, onMinImportance }) {
  return (
    <div style={{
      maxWidth: 1024, margin: "0 auto",
      padding: "0 32px 16px",
      display: "flex", flexDirection: "column", gap: 14,
      borderBottom: "1px solid #e7e5e4",
    }}>
      <div style={{ paddingTop: 14, borderTop: "1px solid #e7e5e4", display: "flex", flexWrap: "wrap", gap: 8 }}>
        {categories.map((cat) => {
          const isActive = activeCategories.has(cat.id);
          const m = categoryMeta[cat.id];
          return (
            <button
              key={cat.id}
              onClick={() => onToggleCategory(cat.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "7px 12px", borderRadius: 8, border: "1px solid",
                borderColor: isActive ? m.border : "#e7e5e4",
                background: isActive ? m.bg : "#fff",
                color: isActive ? m.text : "#57534e",
                fontWeight: isActive ? 500 : 400,
                fontFamily: "inherit", fontSize: 13, cursor: "pointer",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 999, background: m.dot }} />
              {cat.label}
              <span style={{ color: "#a8a29e", fontFamily: "var(--font-mono)", fontSize: 11 }}>{counts[cat.id]}</span>
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 13, color: "#57534e" }}>최소 중요도</span>
        {[0, 3, 4, 5].map((v) => (
          <button
            key={v}
            onClick={() => onMinImportance(v)}
            style={{
              padding: "6px 12px", borderRadius: 6, fontFamily: "inherit", fontSize: 13,
              cursor: "pointer", border: "1px solid",
              background: minImportance === v ? "#292524" : "#fff",
              color: minImportance === v ? "#fff" : "#57534e",
              borderColor: minImportance === v ? "#292524" : "#e7e5e4",
            }}
          >{v === 0 ? "모두" : `${v}+`}</button>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Header, Controls, FilterPanel });
