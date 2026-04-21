/* global React */
const { useState, useMemo } = React;

const categoryMeta = {
  core:         { label: "핵심 기능",   dot: "#fbbf24", bg: "#fffbeb", border: "#fcd34d", text: "#b45309" },
  productivity: { label: "생산성",      dot: "#34d399", bg: "#ecfdf5", border: "#6ee7b7", text: "#047857" },
  integration:  { label: "통합/연동",   dot: "#38bdf8", bg: "#f0f9ff", border: "#7dd3fc", text: "#0369a1" },
  platform:     { label: "플랫폼/배포", dot: "#a78bfa", bg: "#f5f3ff", border: "#c4b5fd", text: "#6d28d9" },
  security:     { label: "보안/권한",   dot: "#fb7185", bg: "#fff1f2", border: "#fda4af", text: "#be123c" },
  dx:           { label: "개발자 경험", dot: "#fb923c", bg: "#fff7ed", border: "#fdba74", text: "#c2410c" },
};

function relativeDate(dateStr) {
  const d = new Date(dateStr);
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return "오늘";
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

Object.assign(window, { categoryMeta, relativeDate, formatDate });
