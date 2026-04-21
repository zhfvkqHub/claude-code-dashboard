#!/usr/bin/env node
/**
 * Claude Code 공식 changelog를 fetch해서 최신 버전 정보만 메타데이터에 반영.
 *
 * 사용법:
 *   node scripts/fetch-changelog.mjs
 *
 * 실행 방법 (자동화):
 *   1. GitHub Actions cron (권장): .github/workflows/update.yml 참조
 *   2. Vercel Cron Job (Pro 이상): vercel.json의 crons 필드
 *
 * 주의: 이 스크립트는 meta 정보(lastUpdated, currentVersion)만 갱신합니다.
 *       새 기능을 features 배열에 추가하는 건 사람이 큐레이션으로 판단해야 해요
 *       (중요도/사용성 점수, 카테고리 분류 등 판단 필요).
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, "..", "data", "features.json");
const CHANGELOG_URL =
  "https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md";

async function main() {
  console.log("📡 공식 changelog fetching…");
  const res = await fetch(CHANGELOG_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch changelog: ${res.status}`);
  }
  const text = await res.text();

  // 첫 번째 ## x.y.z 형태의 버전 헤더 찾기
  const versionMatch = text.match(/^##\s+(\d+\.\d+\.\d+)/m);
  if (!versionMatch) {
    throw new Error("버전 헤더를 찾을 수 없어요");
  }
  const latestVersion = versionMatch[1];
  console.log(`✅ 최신 버전: ${latestVersion}`);

  // 기존 데이터 읽기
  const data = JSON.parse(await readFile(DATA_PATH, "utf-8"));
  const prevVersion = data.meta.currentVersion;
  data.meta.currentVersion = latestVersion;
  data.meta.lastUpdated = new Date().toISOString().slice(0, 10);

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + "\n");
  console.log(`✅ 메타데이터 갱신: ${prevVersion} → ${latestVersion}`);

  if (prevVersion !== latestVersion) {
    console.log(
      "\n⚠️  새 버전이 나왔어요. data/features.json에 주요 기능을 수동으로 추가해주세요.",
    );
    console.log(
      `   참조: https://code.claude.com/docs/en/changelog#${latestVersion.replaceAll(".", "-")}`,
    );
  }
}

main().catch((err) => {
  console.error("❌ 실패:", err);
  process.exit(1);
});
