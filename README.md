# Claude Code Radar

Claude Code 공식 changelog를 한눈에 보기 좋게 정리한 대시보드.
Next.js 15 + Tailwind CSS 4 기반, Vercel 배포.

## 특징

- **공식 문서 기준** — 모든 기능 데이터는 [공식 changelog](https://code.claude.com/docs/en/changelog)에서 수집
- **6개 카테고리 필터** — 핵심 / 생산성 / 통합 / 플랫폼 / 보안 / DX
- **중요도, 사용성 점수** — 실제로 유용한 기능을 빠르게 구분
- **검색** — 기능명, 버전, 태그, 설명 전체에서 즉시 검색
- **정렬** — 최신순 / 중요도순 / 사용성순 전환
- **공식 문서 링크** — 각 기능에서 바로 공식 문서로 이동
- **자동 업데이트** — GitHub Actions로 매일 changelog 갱신

## 시작하기

### 로컬 실행

```bash
npm install
npm run dev
# http://localhost:3000
```

### Vercel 배포

1. GitHub 리포지토리에 푸시
2. [vercel.com/new](https://vercel.com/new)에서 리포지토리 Import
3. Framework 자동 감지 → Deploy

## 자동 업데이트

`.github/workflows/update.yml`이 설정되어 있으며, GitHub에 푸시하면 바로 동작합니다.

- 매일 UTC 0시 (KST 오전 9시) 자동 실행
- 공식 changelog에서 최신 버전 수집
- 변경사항이 있으면 Pull Request 자동 생성
- PR 머지 시 Vercel 자동 재배포

```bash
# 수동 실행
node scripts/fetch-changelog.mjs
```

**권한 설정:** 리포지토리 Settings → Actions → General → Workflow permissions → "Read and write permissions" 체크

## 기능 데이터 추가

`data/features.json`의 `features` 배열에 추가:

```json
{
  "id": "unique-id",
  "title": "기능 이름",
  "summary": "한 줄 요약",
  "details": "상세 설명",
  "category": "core",
  "date": "2026-04-16",
  "version": "2.1.111",
  "importance": 5,
  "usability": 5,
  "tags": ["tag1", "tag2"],
  "docUrl": "https://code.claude.com/docs/en/changelog#2-1-111"
}
```

**점수 기준:**

| 점수 | importance (중요도) | usability (사용성) |
|------|--------------------|--------------------|
| 1 | 사소한 버그픽스 | 복잡한 설정 필요 |
| 3 | 유용한 개선 | 간단한 플래그 |
| 5 | 워크플로우를 바꾸는 핵심 기능 | 기본 활성 / 자동 적용 |

## 프로젝트 구조

```
app/
  layout.tsx          # 루트 레이아웃 + 폰트
  page.tsx            # 메인 페이지 (ISR 6h)
  globals.css         # Tailwind + 커스텀 테마
components/
  Dashboard.tsx       # 필터 / 검색 / 정렬
  FeatureRow.tsx      # 기능 행 표시
  FeatureModal.tsx    # 기능 상세 모달
data/
  features.json       # 기능 데이터
lib/
  types.ts            # TypeScript 타입
  utils.ts            # 카테고리 색상, 날짜 포맷
scripts/
  fetch-changelog.mjs # 자동 업데이트 스크립트
.github/workflows/
  update.yml          # 매일 자동 실행
```

## 디자인

- **테마**: 라이트 모드, 앰버 강조색
- **폰트**: Fraunces (display) + Inter Tight (body) + JetBrains Mono (mono)
- **반응형**: 모바일 / 태블릿 / 데스크탑 대응

테마 수정은 `app/globals.css`의 `@theme` 블록에서 가능합니다.

## 참고

- [Claude Code 공식 Changelog](https://code.claude.com/docs/en/changelog)
- [Claude Code GitHub](https://github.com/anthropics/claude-code)

---

공식 문서 기준으로 만들어진 비공식 커뮤니티 대시보드입니다.
