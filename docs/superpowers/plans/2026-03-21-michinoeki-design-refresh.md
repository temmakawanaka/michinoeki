# 道の駅サイト デザイン調整 実装計画

> **エージェント向け:** この計画の実装では `superpowers:subagent-driven-development` の利用を推奨します。あるいは `superpowers:executing-plans` を使って、このチェックボックス形式 (`- [ ]`) の手順を順に実行してください。

**ゴール:** 既存の道の駅 MVP を、検索のしやすさを保ちながら「週末にふらっと出かけたくなる」観光サイト寄りの見た目へ引き上げる。

**アーキテクチャ:** 既存の Next.js App Router 構成は維持し、UI の責務ごとにコンポーネントを追加・整理する。トップページにはヒーロー、おすすめ、イベントの訴求を追加し、一覧カードと詳細ページは既存データで表情が出る見せ方に調整する。共通配色と装飾は `globals.css` と小さな UI コンポーネント群で管理し、将来の画像・イベント実データ導入に備える。

**技術スタック:** Next.js App Router, TypeScript, React, Tailwind CSS, Vitest, React Testing Library, Playwright, ESLint

---

## 前提

- 機能スコープは MVP のままとし、今回は見た目と情報の見せ方に集中する。
- UI 文言は日本語を基本とし、将来の多言語対応は今回扱わない。
- 写真データがまだ十分でないため、グラフィックやプレースホルダーで観光感を補う。
- 「おすすめ道の駅」「注目イベント」は、まずは静的またはローカル定義データで見せ場を作る。
- 既存の検索、一覧、詳細、API の振る舞いは壊さない。

## 想定ファイル構成

### トップページと共通ビジュアル

- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/components/layout/site-header.tsx`
- Modify: `src/components/search/hero-search-form.tsx`
- Create: `src/components/home/hero-visual.tsx`
- Create: `src/components/home/featured-stations-section.tsx`
- Create: `src/components/home/featured-events-section.tsx`
- Create: `src/components/home/prefecture-entry-section.tsx`

### 一覧カードと詳細ページ

- Modify: `src/app/search/page.tsx`
- Modify: `src/components/stations/station-card.tsx`
- Modify: `src/components/stations/station-detail.tsx`
- Create: `src/components/ui/section-heading.tsx`
- Create: `src/components/ui/info-chip.tsx`

### 表示用の静的データ

- Create: `src/lib/content/home-highlights.ts`

### テスト

- Modify: `src/components/layout/site-header.test.tsx`
- Modify: `src/components/stations/station-card.test.tsx`
- Modify: `src/components/stations/station-detail.test.tsx`
- Create: `src/components/home/featured-stations-section.test.tsx`
- Create: `src/components/home/featured-events-section.test.tsx`
- Modify: `tests/e2e/home-search.spec.ts`
- Modify: `tests/e2e/station-detail.spec.ts`

## Task 1: ビジュアル基盤と共通トーンを整える

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/layout/site-header.tsx`
- Modify: `src/components/layout/site-header.test.tsx`
- Create: `src/components/ui/section-heading.tsx`
- Create: `src/components/ui/info-chip.tsx`

- [ ] **Step 1: 共通見出しの失敗テストを書く**

```tsx
import { render, screen } from "@testing-library/react";
import { SectionHeading } from "./section-heading";

test("shows Japanese title and eyebrow", () => {
  render(<SectionHeading eyebrow="おすすめ" title="今週の道の駅" />);
  expect(screen.getByText("おすすめ")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "今週の道の駅" })).toBeInTheDocument();
});
```

- [ ] **Step 2: テストが失敗することを確認する**

Run: `npm.cmd test -- src/components/layout/site-header.test.tsx src/components/home/featured-stations-section.test.tsx`
Expected: FAIL

- [ ] **Step 3: 共通 UI 部品と配色変数を追加する**

```tsx
export function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="grid gap-2">
      <p className="text-xs tracking-[0.28em] text-sky-deep">{eyebrow}</p>
      <h2 className="text-3xl font-semibold text-ink">{title}</h2>
    </div>
  );
}
```

- [ ] **Step 4: `globals.css` に空・道路・旅を感じるトークンを入れる**

```css
:root {
  --paper: #f7fbff;
  --sky-soft: #d9efff;
  --sky-deep: #2563a6;
  --sand: #f6ead8;
  --sun: #ffb85c;
}
```

- [ ] **Step 5: ヘッダーを観光サイト寄りに調整する**

```tsx
<p className="text-xs tracking-[0.3em] text-sky-deep">週末ドライブの入口</p>
<h1 className="text-2xl font-semibold text-ink">道の駅ガイド</h1>
```

- [ ] **Step 6: 対象テストを実行する**

Run: `npm.cmd test -- src/components/layout/site-header.test.tsx src/components/home/featured-stations-section.test.tsx`
Expected: PASS

- [ ] **Step 7: コミットする**

```bash
git add src/app/globals.css src/components/layout/site-header.tsx src/components/layout/site-header.test.tsx src/components/ui/section-heading.tsx src/components/ui/info-chip.tsx src/components/home/featured-stations-section.test.tsx
git commit -m "feat: add visual foundation for design refresh"
```

## Task 2: トップページを観光サイト寄りに再構成する

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/search/hero-search-form.tsx`
- Create: `src/components/home/hero-visual.tsx`
- Create: `src/components/home/featured-stations-section.tsx`
- Create: `src/components/home/featured-events-section.tsx`
- Create: `src/components/home/prefecture-entry-section.tsx`
- Create: `src/lib/content/home-highlights.ts`
- Create: `src/components/home/featured-stations-section.test.tsx`
- Create: `src/components/home/featured-events-section.test.tsx`

- [ ] **Step 1: おすすめセクションの失敗テストを書く**

```tsx
test("shows recommended station cards", () => {
  render(<FeaturedStationsSection items={[{ title: "道の駅 富士", prefecture: "静岡県" }]} />);
  expect(screen.getByText("道の駅 富士")).toBeInTheDocument();
});
```

- [ ] **Step 2: イベントセクションの失敗テストを書く**

```tsx
test("shows featured event items", () => {
  render(<FeaturedEventsSection items={[{ title: "春のうまいもの市", dateLabel: "3月下旬" }]} />);
  expect(screen.getByText("春のうまいもの市")).toBeInTheDocument();
});
```

- [ ] **Step 3: テストが失敗することを確認する**

Run: `npm.cmd test -- src/components/home/featured-stations-section.test.tsx src/components/home/featured-events-section.test.tsx`
Expected: FAIL

- [ ] **Step 4: トップ用の静的データを追加する**

```ts
export const featuredStations = [
  { title: "道の駅 富士", prefecture: "静岡県", blurb: "海と街の景色を味わえる人気スポット" },
];
```

- [ ] **Step 5: ヒーロー領域を写真風グラフィック付きにする**

```tsx
<section className="relative overflow-hidden rounded-[40px] bg-[linear-gradient(...)]">
  <HeroVisual />
  <HeroSearchForm />
</section>
```

- [ ] **Step 6: おすすめ道の駅と注目イベントをトップへ追加する**

```tsx
<FeaturedStationsSection items={featuredStations} />
<FeaturedEventsSection items={featuredEvents} />
```

- [ ] **Step 7: 都道府県入口セクションを追加する**

```tsx
<PrefectureEntrySection prefectures={["北海道", "静岡県", "福島県"]} />
```

- [ ] **Step 8: テストを実行する**

Run: `npm.cmd test -- src/components/home/featured-stations-section.test.tsx src/components/home/featured-events-section.test.tsx`
Expected: PASS

- [ ] **Step 9: コミットする**

```bash
git add src/app/page.tsx src/components/search/hero-search-form.tsx src/components/home/hero-visual.tsx src/components/home/featured-stations-section.tsx src/components/home/featured-events-section.tsx src/components/home/prefecture-entry-section.tsx src/lib/content/home-highlights.ts src/components/home/featured-stations-section.test.tsx src/components/home/featured-events-section.test.tsx
git commit -m "feat: refresh home page for travel inspiration"
```

## Task 3: 一覧カードと詳細ページを見やすく華やかにする

**Files:**
- Modify: `src/app/search/page.tsx`
- Modify: `src/components/stations/station-card.tsx`
- Modify: `src/components/stations/station-card.test.tsx`
- Modify: `src/components/stations/station-detail.tsx`
- Modify: `src/components/stations/station-detail.test.tsx`

- [ ] **Step 1: カードの表示拡張テストを書く**

```tsx
test("shows summary labels for station cards", () => {
  render(<StationCard station={{ name: "道の駅 富士", prefecture: "静岡県", address: "静岡県富士市", slug: "michinoeki-fuji", openingHours: "09:00-18:00", dataConfidence: "high" }} />);
  expect(screen.getByText(/営業時間/)).toBeInTheDocument();
  expect(screen.getByText(/信頼度/)).toBeInTheDocument();
});
```

- [ ] **Step 2: 詳細ページのセクション見出しテストを書く**

```tsx
test("shows station detail sections", () => {
  render(<StationDetail station={mockStation} />);
  expect(screen.getByRole("heading", { name: "駐車場" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "設備" })).toBeInTheDocument();
});
```

- [ ] **Step 3: テストが失敗することを確認する**

Run: `npm.cmd test -- src/components/stations/station-card.test.tsx src/components/stations/station-detail.test.tsx`
Expected: FAIL

- [ ] **Step 4: 一覧カードにビジュアル面と補助チップを追加する**

```tsx
<div className="rounded-t-2xl bg-[linear-gradient(...)] p-4">
  <p>{station.prefecture}</p>
</div>
<InfoChip label="信頼度" value="高" />
```

- [ ] **Step 5: 検索結果ページの見出しと余白を整える**

```tsx
<p>週末の行き先を探す</p>
<h1>{result.total}件の道の駅が見つかりました</h1>
```

- [ ] **Step 6: 詳細ページを案内ページ風の 2 カラム構成に調整する**

```tsx
<div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
  <section>基本情報</section>
  <aside>駐車場と設備</aside>
</div>
```

- [ ] **Step 7: テストを実行する**

Run: `npm.cmd test -- src/components/stations/station-card.test.tsx src/components/stations/station-detail.test.tsx`
Expected: PASS

- [ ] **Step 8: コミットする**

```bash
git add src/app/search/page.tsx src/components/stations/station-card.tsx src/components/stations/station-card.test.tsx src/components/stations/station-detail.tsx src/components/stations/station-detail.test.tsx
git commit -m "feat: polish search and station detail presentation"
```

## Task 4: ブラウザ確認と最終仕上げを行う

**Files:**
- Modify: `tests/e2e/home-search.spec.ts`
- Modify: `tests/e2e/station-detail.spec.ts`
- Modify: 必要なら `README.md`

- [ ] **Step 1: トップページ E2E を新 UI に合わせて更新する**

```ts
await page.getByRole("button", { name: "検索する" }).click();
await expect(page.getByText("今週のおすすめ道の駅")).toBeVisible();
```

- [ ] **Step 2: 詳細ページ E2E を新 UI に合わせて更新する**

```ts
await expect(page.getByRole("heading", { name: "道の駅 富士" })).toBeVisible();
await expect(page.getByText("駐車場")).toBeVisible();
```

- [ ] **Step 3: 単体テストを全部流す**

Run: `npm.cmd test`
Expected: PASS

- [ ] **Step 4: lint を流す**

Run: `npm.cmd run lint`
Expected: PASS

- [ ] **Step 5: E2E を流す**

Run: `npm.cmd run test:e2e`
Expected: PASS

- [ ] **Step 6: build を流す**

Run: `npm.cmd run build`
Expected: PASS

- [ ] **Step 7: 必要なら README の画面説明を更新する**

Run: `git diff -- README.md`
Expected: 変更が必要なら、トップのおすすめ・イベント導線が追記されている

- [ ] **Step 8: コミットする**

```bash
git add tests/e2e/home-search.spec.ts tests/e2e/station-detail.spec.ts README.md
git commit -m "chore: finalize design refresh verification"
```