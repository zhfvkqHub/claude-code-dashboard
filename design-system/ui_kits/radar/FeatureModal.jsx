/* global React, categoryMeta, formatDate */

function FeatureModal({ feature, onClose, onPrev, onNext }) {
  const m = categoryMeta[feature.category];

  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(28,25,23,0.4)",
        backdropFilter: "blur(4px)",
        animation: "fadeIn 200ms ease-out",
      }} />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative", background: "#fff", borderRadius: 12,
          boxShadow: "0 24px 48px -12px rgba(28,25,23,0.25)",
          width: "100%", maxWidth: 640, maxHeight: "85vh", overflowY: "auto",
          animation: "slideUp 250ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div style={{ height: 6, background: m.dot, borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
        <div style={{ padding: "24px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: m.dot }} />
              <span style={{ fontSize: 14, fontWeight: 500, color: m.text }}>{m.label}</span>
            </div>
            <button onClick={onClose} style={{
              background: "none", border: 0, color: "#a8a29e", cursor: "pointer", padding: 4,
            }} aria-label="닫기">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
          <h2 style={{
            margin: "0 0 8px", fontSize: 26, fontWeight: 600, color: "#1c1917",
            letterSpacing: "-0.015em", lineHeight: 1.15,
          }}>{feature.title}</h2>
          <div style={{ display: "flex", gap: 10, alignItems: "center", fontSize: 13, color: "#78716c", marginBottom: 20 }}>
            <span style={{ fontFamily: "var(--font-mono)" }}>v{feature.version}</span>
            <span style={{ color: "#d6d3d1" }}>·</span>
            <span>{formatDate(feature.date)}</span>
          </div>
          <p style={{ margin: "0 0 16px", fontSize: 15, color: "#44403c", lineHeight: 1.55 }}>
            {feature.summary}
          </p>
          {feature.details && (
            <div style={{
              background: "#fafaf9", border: "1px solid #e7e5e4", borderRadius: 8,
              padding: "14px 16px", fontSize: 13, color: "#57534e", lineHeight: 1.6, marginBottom: 16,
            }}>{feature.details}</div>
          )}
          <ScoreRow label="중요도" value={feature.importance} color="#fbbf24" />
          <div style={{ height: 12 }} />
          <ScoreRow label="사용성" value={feature.usability} color="#34d399" />
          {feature.tags && feature.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "20px 0 16px" }}>
              {feature.tags.map(t => (
                <span key={t} style={{
                  fontFamily: "var(--font-mono)", fontSize: 12, color: "#57534e",
                  background: "#f5f5f4", padding: "3px 10px", borderRadius: 6,
                }}>{t}</span>
              ))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                        paddingTop: 14, borderTop: "1px solid #e7e5e4" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {onPrev && <NavBtn onClick={onPrev}>← 이전</NavBtn>}
              {onNext && <NavBtn onClick={onNext}>다음 →</NavBtn>}
            </div>
            <a href={feature.docUrl} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, fontWeight: 500, color: "#b45309",
              padding: "6px 12px", borderRadius: 6, textDecoration: "none",
            }}>
              공식 문서 보기
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreRow({ label, value, color }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
        <span style={{ color: "#57534e" }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 500, color: "#1c1917" }}>{value}/5</span>
      </div>
      <div style={{ display: "flex", gap: 4, height: 8 }}>
        {[1,2,3,4,5].map(i => (
          <span key={i} style={{
            flex: 1, borderRadius: 999,
            background: i <= value ? color : "#e7e5e4",
          }} />
        ))}
      </div>
    </div>
  );
}

function NavBtn({ onClick, children }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        fontFamily: "inherit", fontSize: 13,
        color: hover ? "#44403c" : "#78716c",
        background: hover ? "#f5f5f4" : "transparent",
        border: 0, padding: "6px 12px", borderRadius: 6, cursor: "pointer",
      }}>{children}</button>
  );
}

Object.assign(window, { FeatureModal });
