/* global React, categoryMeta, relativeDate */

function FeatureRow({ feature, onClick }) {
  const [hover, setHover] = React.useState(false);
  const m = categoryMeta[feature.category];
  const important = feature.importance >= 4;

  const boxShadow = hover ? "0 1px 2px rgba(28,25,23,0.04)" : "none";
  const bg = hover ? "#fff" : "transparent";
  const borderColor = hover ? "#e7e5e4" : "transparent";

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: "100%", textAlign: "left", cursor: "pointer",
        display: "flex", alignItems: "center", gap: 16,
        padding: "14px 18px",
        paddingLeft: important ? 15 : 18,
        borderRadius: 8,
        border: `1px solid ${borderColor}`,
        borderLeft: important ? "3px solid #fbbf24" : `1px solid ${borderColor}`,
        background: bg, boxShadow,
        fontFamily: "inherit",
        transition: "all 150ms",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, width: 110, flexShrink: 0 }}>
        <span style={{ width: 8, height: 8, borderRadius: 999, background: m.dot }} />
        <span style={{ fontSize: 13, color: m.text }}>{m.label}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 style={{
          margin: 0, fontSize: 15, fontWeight: 500,
          color: hover ? "#92400e" : "#1c1917",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          transition: "color 150ms",
        }}>{feature.title}</h3>
        <p style={{
          margin: "2px 0 0", fontSize: 13, color: "#78716c",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{feature.summary}</p>
      </div>
      <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: 999,
            background: i <= feature.importance ? "#fbbf24" : "#e7e5e4",
          }} />
        ))}
      </div>
      <time style={{
        fontFamily: "var(--font-mono)", fontSize: 12, color: "#a8a29e",
        width: 64, textAlign: "right", flexShrink: 0, fontVariantNumeric: "tabular-nums",
      }}>{relativeDate(feature.date)}</time>
      <span style={{
        fontFamily: "var(--font-mono)", fontSize: 12, color: "#a8a29e",
        width: 72, textAlign: "right", flexShrink: 0,
      }}>v{feature.version}</span>
      <svg style={{ color: hover ? "#f59e0b" : "#d6d3d1", flexShrink: 0, transition: "color 150ms" }}
           width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </button>
  );
}

Object.assign(window, { FeatureRow });
