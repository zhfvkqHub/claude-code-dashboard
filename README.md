# Claude Code Radar

Claude Code 공식 changelog를 한눈에 보기 좋게 정리한 대시보드. Next.js 15 + Tailwind CSS 4로 만들어 Vercel에 바로 배포할 수 있어요.

## ✨ 특징

- **공식 문서 기준** — 모든 기능 데이터는 [code.claude.com/docs/en/changelog](https://code.claude.com/docs/en/changelog)에서 출처
- **6개 카테고리 필터** — 핵심/생산성/통합/플랫폼/보안/DX
- **중요도 × 사용성 점수** — 실제로 유용한 기능을 빠르게 구분
- **검색** — 기능명, 버전, 태그, 설명 전체에서 즉시 검색
- **정렬** — 최신순/중요도순/사용성순 자유 전환
- **공식 문서 링크** — 각 기능에서 바로 공식 doc으로 이동
- **자동 업데이트** — GitHub Actions로 매일 changelog 갱신 (옵션)

## 🚀 빠른 시작

### 1. 로컬 실행

```bash
npm install
npm run dev
# → http://localhost:3000
```

### 2. Vercel 배포 (추천)

**가장 간단한 방법:**

1. 이 프로젝트를 GitHub 리포지토리에 푸시
2. [vercel.com/new](https://vercel.com/new)에서 해당 리포지토리 Import
3. Framework: Next.js 자동 감지 → Deploy 클릭

그걸로 끝이에요. 5분 안에 `your-project.vercel.app` URL에서 접근 가능.

## 🤖 자동 업데이트 세팅

Claude Code는 거의 매일 업데이트되기 때문에 세 가지 방법으로 자동화할 수 있어요.

### 방법 1: GitHub Actions (추천, 무료)

이미 `.github/workflows/update.yml`이 설정되어 있어요. GitHub 리포지토리에 푸시만 하면:

- 매일 UTC 0시(KST 오전 9시)에 자동 실행
- 공식 changelog에서 최신 버전을 가져와서
- 변경사항이 있으면 자동으로 **Pull Request 생성**
- PR을 머지하면 Vercel이 자동으로 재배포

```bash
# 수동으로 돌려보고 싶다면
node scripts/fetch-changelog.mjs
```

**GitHub Actions 권한 설정:**
리포지토리 → Settings → Actions → General → Workflow permissions → "Read and write permissions" 체크.

### 방법 2: Vercel Cron Jobs (Pro 이상)

Vercel Pro 플랜 사용자는 `vercel.json`에 cron 추가해서 API route를 주기적으로 실행할 수 있어요.

### 방법 3: ISR (Incremental Static Regeneration, 기본 제공)

이미 활성화되어 있어요. `app/page.tsx`의 `revalidate = 21600`이 6시간마다 페이지를 백그라운드에서 재생성합니다. 단, 이건 JSON 데이터 자체를 업데이트하지는 않아요 — 데이터 변경은 위 방법 1이나 2를 써야 반영됩니다.

## 📝 새 기능 추가하기

`data/features.json`의 `features` 배열에 객체를 추가하세요:

```json
{
  "id": "unique-id",
  "title": "기능 이름",
  "summary": "한 줄 요약",
  "details": "자세히 접어둔 상세 설명",
  "category": "core",
  "date": "2026-04-16",
  "version": "2.1.111",
  "importance": 5,
  "usability": 5,
  "tags": ["tag1", "tag2"],
  "docUrl": "https://code.claude.com/docs/en/changelog#2-1-111"
}
```

**점수 가이드라인:**

- **importance (중요도)**: 1=사소한 버그픽스, 3=유용한 개선, 5=워크플로우를 바꾸는 핵심 기능
- **usability (사용성)**: 1=복잡한 설정 필요, 3=간단한 플래그, 5=기본 활성/자동 적용

## 🏗️ 프로젝트 구조

```
claude-code-dashboard/
├── app/
│   ├── layout.tsx          # 루트 레이아웃 + 폰트 로딩
│   ├── page.tsx            # 메인 페이지 (ISR 6h)
│   └── globals.css         # Tailwind + 커스텀 테마
├── components/
│   ├── Dashboard.tsx       # 필터/검색/정렬 로직
│   └── FeatureCard.tsx     # 개별 기능 카드
├── data/
│   └── features.json       # 기능 데이터 (직접 편집)
├── lib/
│   ├── types.ts            # TypeScript 타입
│   └── utils.ts            # 카테고리 색상, 날짜 포맷
├── scripts/
│   └── fetch-changelog.mjs # 자동 업데이트 스크립트
└── .github/workflows/
    └── update.yml          # 매일 자동 실행
```

## 🎨 디자인

- **테마**: Editorial/magazine 스타일 (검은 배경 + 앰버 강조)
- **폰트**: Fraunces (display) + Inter Tight (body) + JetBrains Mono (mono)
- **반응형**: 모바일/태블릿/데스크탑 완전 대응

테마를 바꾸고 싶다면 `app/globals.css`의 `@theme` 블록을 수정하세요.

## 📚 참고 링크

- [Claude Code 공식 Changelog](https://code.claude.com/docs/en/changelog)
- [Claude Code GitHub](https://github.com/anthropics/claude-code)
- [Next.js ISR 문서](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)

---

공식 문서를 기준으로 만들어진 비공식 커뮤니티 대시보드입니다.
