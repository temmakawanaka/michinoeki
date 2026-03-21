# 道の駅ディレクトリ MVP 実装計画

> **エージェント向け:** この計画の実装では `superpowers:subagent-driven-development` の利用を推奨します。あるいは `superpowers:executing-plans` を使って、このチェックボックス形式 (`- [ ]`) の手順を順に実行してください。

**ゴール:** 全国の道の駅を対象に、検索、一覧表示、詳細ページを備えた最初の公開 MVP を、PostgreSQL 上の構造化された道の駅マスタを土台に構築する。

**アーキテクチャ:** Next.js を単一アプリとして使い、サーバーサイド描画ページと Route Handler を実装する。データは Prisma 経由で PostgreSQL に保存し、MVP では基本的な検索と詳細表示を提供する。取り込み処理では、複数の道の駅情報ソースを取得・正規化・比較し、信頼度ルールに基づいて採用値を決める。

**技術スタック:** Next.js App Router, TypeScript, React, Tailwind CSS, Prisma ORM, PostgreSQL, Docker Compose, Vitest, React Testing Library, Playwright, Zod, ESLint

---

## 前提

- このリポジトリはまだほぼ空なので、初期セットアップも計画に含める。
- 開発環境から PostgreSQL を使い、ローカルでは Docker Compose で起動する。
- MVP では全国データを扱える構造を先に作り、データの網羅率は段階的に上げる。
- 国や自治体などの一次ソースを最優先し、それ以外のサイトは補助ソースとして扱う。
- 値の採用は「ソースの信頼度」と「複数ソース間の一致度」の両方で判断する。
- テスト例の文字列は、端末の文字コード問題を避けるため ASCII ベースにしている。実際の画面文言は日本語で構わない。

## 技術選定理由

### Next.js App Router

- 検索結果ページと詳細ページを SSR で素直に作りやすい。
- API Route も同じリポジトリ内で持てるので、MVP の構成がシンプルになる。
- 画面、API、メタデータを分散させずに進められる。

### TypeScript

- フロントエンドとバックエンドで型を共有できる。
- データ項目が多い道の駅ドメインでは、型の明示がそのままバグ防止になる。
- 取り込み処理や正規化ロジックでも型の恩恵が大きい。

### React

- 検索フォーム、一覧カード、詳細表示などの UI を部品として整理しやすい。
- 将来的に管理画面や投稿画面へ広げるときも再利用しやすい。

### PostgreSQL

- 最初から本番を見据えたリレーショナル DB を使える。
- 構造化カラムと JSONB を併用でき、ソース比較結果や証跡を持ちやすい。
- 将来、全文検索や拡張機能を使いたくなった場合にも伸びしろがある。

### Prisma

- スキーマをコードとして管理できる。
- PostgreSQL の migration を安全に扱いやすい。
- 型付きクエリで道の駅マスタやソース証跡を扱いやすい。

### Docker Compose

- ローカルで PostgreSQL をすぐ立ち上げられる。
- 開発者が増えても環境差分を小さくできる。
- 今回のように「SQLite に逃げず最初から Postgres」をやる前提と相性がよい。

### Tailwind CSS

- MVP の UI を速く組み立てやすい。
- デザインシステムが未確定でも、クラスベースで調整しやすい。

### Zod

- API 入力値や取り込み元データのバリデーションを明確に書ける。
- 正規化前後の境界を明示しやすい。

### Vitest / React Testing Library / Playwright

- Vitest: 正規化ロジック、検索ロジック、採用ルールの単体テストを高速に回せる。
- RTL: フォームやカード UI の振る舞いを軽く検証できる。
- Playwright: 検索から詳細表示までの MVP 導線をブラウザで保証できる。

## 想定ファイル構成

### ルート設定とツール類

- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `eslint.config.js`
- Create: `playwright.config.ts`
- Create: `vitest.config.ts`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `docker-compose.yml`

### アプリ本体とルーティング

- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Create: `src/app/search/page.tsx`
- Create: `src/app/stations/[stationSlug]/page.tsx`
- Create: `src/app/api/search/route.ts`

### ドメインとデータアクセス

- Create: `src/lib/db.ts`
- Create: `src/lib/env.ts`
- Create: `src/lib/stations/search-stations.ts`
- Create: `src/lib/stations/get-station-by-slug.ts`
- Create: `src/lib/stations/station-query-schema.ts`
- Create: `src/lib/stations/station-mappers.ts`

### UI コンポーネント

- Create: `src/components/search/hero-search-form.tsx`
- Create: `src/components/search/prefecture-filter.tsx`
- Create: `src/components/stations/station-card.tsx`
- Create: `src/components/stations/station-detail.tsx`
- Create: `src/components/layout/site-header.tsx`

### データベースとシードデータ

- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `prisma/migrations/`
- Create: `data/stations/sample-stations.json`
- Create: `data/sources/sample-source-a.json`
- Create: `data/sources/sample-source-b.json`
- Create: `data/sources/sample-source-c.json`

### 複数ソース取り込み処理

- Create: `scripts/import-stations.ts`
- Create: `src/lib/importers/source-priority.ts`
- Create: `src/lib/importers/station-import-schema.ts`
- Create: `src/lib/importers/fetch-source-records.ts`
- Create: `src/lib/importers/normalize-station-record.ts`
- Create: `src/lib/importers/merge-station-sources.ts`
- Create: `src/lib/importers/normalize-station-record.test.ts`
- Create: `src/lib/importers/merge-station-sources.test.ts`

### テスト

- Create: `src/lib/stations/search-stations.test.ts`
- Create: `src/lib/stations/get-station-by-slug.test.ts`
- Create: `src/app/api/search/route.test.ts`
- Create: `src/components/layout/site-header.test.tsx`
- Create: `src/components/stations/station-card.test.tsx`
- Create: `tests/e2e/home-search.spec.ts`
- Create: `tests/e2e/station-detail.spec.ts`

### ドキュメント

- Modify: `README.md`

## Task 1: プロジェクトの土台と Postgres 開発環境を作る

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.js`
- Create: `tailwind.config.ts`
- Create: `eslint.config.js`
- Create: `playwright.config.ts`
- Create: `vitest.config.ts`
- Create: `.env.example`
- Create: `.gitignore`
- Create: `docker-compose.yml`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/components/layout/site-header.tsx`
- Create: `src/components/layout/site-header.test.tsx`

- [ ] **Step 1: アプリ外枠のスモークテストを書く**

```tsx
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "./site-header";

test("renders site title", () => {
  render(<SiteHeader />);
  expect(screen.getByText("Michi no Eki Guide")).toBeInTheDocument();
});
```

- [ ] **Step 2: 未実装で失敗することを確認する**

Run: `npm test -- src/components/layout/site-header.test.tsx`
Expected: FAIL

- [ ] **Step 3: Next.js + TypeScript + Tailwind の基本ファイルを作る**

```json
{
  "name": "michinoeki",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "db:up": "docker compose up -d",
    "db:down": "docker compose down"
  }
}
```

- [ ] **Step 4: Postgres 用の Docker Compose を追加する**

```yaml
services:
  postgres:
    image: postgres:17
    environment:
      POSTGRES_DB: michinoeki
      POSTGRES_USER: michinoeki
      POSTGRES_PASSWORD: michinoeki
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
volumes:
  postgres-data:
```

- [ ] **Step 5: グローバルレイアウトを実装する**

```tsx
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>
        <SiteHeader />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: テストと lint を通す**

Run: `npm test -- src/components/layout/site-header.test.tsx`
Expected: PASS

Run: `npm run lint`
Expected: PASS

- [ ] **Step 7: ここまでをコミットする**

```bash
git add package.json next.config.ts tsconfig.json postcss.config.js tailwind.config.ts eslint.config.js playwright.config.ts vitest.config.ts .env.example .gitignore docker-compose.yml src/app/layout.tsx src/app/globals.css src/components/layout/site-header.tsx src/components/layout/site-header.test.tsx
git commit -m "chore: bootstrap app and postgres dev environment"
```

## Task 2: 道の駅マスタとソース証跡のデータモデルを定義する

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `src/lib/stations/get-station-by-slug.ts`
- Create: `src/lib/stations/get-station-by-slug.test.ts`
- Create: `data/stations/sample-stations.json`
- Create: `prisma/seed.ts`

- [ ] **Step 1: スラッグ検索の失敗テストを書く**

```ts
import { getStationBySlug } from "./get-station-by-slug";

test("returns a station by slug", async () => {
  const station = await getStationBySlug("michinoeki-fuji");
  expect(station?.name).toBe("Michi-no-Eki Fuji");
  expect(station?.sourceRecords.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: 未実装で失敗することを確認する**

Run: `npm test -- src/lib/stations/get-station-by-slug.test.ts`
Expected: FAIL

- [ ] **Step 3: Prisma スキーマを定義する**

```prisma
model Station {
  id              String                @id @default(cuid())
  slug            String                @unique
  name            String
  prefecture      String
  address         String
  latitude        Float?
  longitude       Float?
  openingHours    String?
  closingDays     String?
  websiteUrl      String?
  dataConfidence  String?
  sourceRecords   StationSourceRecord[]
  parking         ParkingCapacity?
  facilities      StationFacilities?
}

model StationSourceRecord {
  id              String   @id @default(cuid())
  stationId       String
  sourceName      String
  sourceType      String
  sourceUrl       String?
  rawPayload      Json
  extractedName   String?
  extractedValue  Json?
  trustScore      Int
  observedAt      DateTime @default(now())
  station         Station  @relation(fields: [stationId], references: [id], onDelete: Cascade)
}
```

- [ ] **Step 4: 駐車場、設備、ソース証跡を含む seed データを追加する**

```ts
await prisma.station.create({
  data: {
    slug: "michinoeki-fuji",
    name: "Michi-no-Eki Fuji",
    prefecture: "Shizuoka",
    address: "669-1 Gokanjima, Fuji, Shizuoka",
    dataConfidence: "high",
    sourceRecords: {
      create: [{ sourceName: "mlit", sourceType: "official", trustScore: 100, rawPayload: {} }],
    },
  },
});
```

- [ ] **Step 5: `getStationBySlug` を関連データ込みで実装する**

```ts
export async function getStationBySlug(slug: string) {
  return prisma.station.findUnique({
    where: { slug },
    include: { facilities: true, parking: true, sourceRecords: true },
  });
}
```

- [ ] **Step 6: migration、seed、テストを実行する**

Run: `npm run db:up`
Expected: PostgreSQL container starts

Run: `npm run db:migrate -- --name init_station_master`
Expected: Prisma migration succeeds

Run: `npm run db:seed`
Expected: Sample data is inserted

Run: `npm test -- src/lib/stations/get-station-by-slug.test.ts`
Expected: PASS

- [ ] **Step 7: ここまでをコミットする**

```bash
git add prisma/schema.prisma prisma/seed.ts src/lib/db.ts src/lib/stations/get-station-by-slug.ts src/lib/stations/get-station-by-slug.test.ts data/stations/sample-stations.json prisma/migrations
git commit -m "feat: add station master and source evidence model"
```

## Task 3: 検索クエリと API を作る

**Files:**
- Create: `src/lib/stations/station-query-schema.ts`
- Create: `src/lib/stations/station-mappers.ts`
- Create: `src/lib/stations/search-stations.ts`
- Create: `src/lib/stations/search-stations.test.ts`
- Create: `src/app/api/search/route.ts`
- Create: `src/app/api/search/route.test.ts`

- [ ] **Step 1: 検索ユースケースの失敗テストを書く**

```ts
import { searchStations } from "./search-stations";

test("filters by keyword and prefecture", async () => {
  const result = await searchStations({ q: "Fuji", prefecture: "Shizuoka" });
  expect(result.total).toBe(1);
  expect(result.items[0]?.slug).toBe("michinoeki-fuji");
});
```

- [ ] **Step 2: 未実装で失敗することを確認する**

Run: `npm test -- src/lib/stations/search-stations.test.ts`
Expected: FAIL

- [ ] **Step 3: Zod で検索パラメータを定義する**

```ts
export const stationQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
  prefecture: z.string().trim().optional(),
});
```

- [ ] **Step 4: Prisma 検索を実装する**

```ts
const where = {
  AND: [
    prefecture ? { prefecture } : {},
    q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { prefecture: { contains: q, mode: "insensitive" } },
            { address: { contains: q, mode: "insensitive" } },
          ],
        }
      : {},
  ],
};
```

- [ ] **Step 5: 検索 API Route を追加する**

```ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = stationQuerySchema.parse({
    q: searchParams.get("q") ?? "",
    prefecture: searchParams.get("prefecture") ?? undefined,
  });

  return Response.json(await searchStations(query));
}
```

- [ ] **Step 6: ドメイン層と API 層のテストを通す**

Run: `npm test -- src/lib/stations/search-stations.test.ts src/app/api/search/route.test.ts`
Expected: PASS

- [ ] **Step 7: ここまでをコミットする**

```bash
git add src/lib/stations/station-query-schema.ts src/lib/stations/station-mappers.ts src/lib/stations/search-stations.ts src/lib/stations/search-stations.test.ts src/app/api/search/route.ts src/app/api/search/route.test.ts
git commit -m "feat: add station search api"
```

## Task 4: トップページと検索結果一覧を作る

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/search/page.tsx`
- Create: `src/components/search/hero-search-form.tsx`
- Create: `src/components/search/prefecture-filter.tsx`
- Create: `src/components/stations/station-card.tsx`
- Create: `src/components/stations/station-card.test.tsx`

- [ ] **Step 1: 駅カードの失敗テストを書く**

```tsx
import { render, screen } from "@testing-library/react";
import { StationCard } from "./station-card";

test("shows basic station summary", () => {
  render(
    <StationCard station={{ slug: "michinoeki-fuji", name: "Michi-no-Eki Fuji", prefecture: "Shizuoka", address: "669-1 Gokanjima, Fuji, Shizuoka" }} />,
  );

  expect(screen.getByText("Michi-no-Eki Fuji")).toBeInTheDocument();
});
```

- [ ] **Step 2: 未実装で失敗することを確認する**

Run: `npm test -- src/components/stations/station-card.test.tsx`
Expected: FAIL

- [ ] **Step 3: 検索フォームと駅カードを実装する**

```tsx
<form action="/search">
  <input name="q" placeholder="Search by station, prefecture, or address" />
  <button type="submit">Search</button>
</form>
```

- [ ] **Step 4: サーバーサイド検索結果ページを実装する**

```tsx
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const result = await searchStations({ q: searchParams.q ?? "", prefecture: searchParams.prefecture });
  return <section>{result.items.map((station) => <StationCard key={station.slug} station={station} />)}</section>;
}
```

- [ ] **Step 5: テストを通す**

Run: `npm test -- src/components/stations/station-card.test.tsx`
Expected: PASS

- [ ] **Step 6: 手動で検索導線を確認する**

Run: `npm run dev`
Expected: `/search` に遷移して結果一覧が出る

- [ ] **Step 7: ここまでをコミットする**

```bash
git add src/app/page.tsx src/app/search/page.tsx src/components/search/hero-search-form.tsx src/components/search/prefecture-filter.tsx src/components/stations/station-card.tsx src/components/stations/station-card.test.tsx
git commit -m "feat: add search pages"
```

## Task 5: 道の駅詳細ページを作る

**Files:**
- Create: `src/app/stations/[stationSlug]/page.tsx`
- Create: `src/components/stations/station-detail.tsx`
- Modify: `src/lib/stations/get-station-by-slug.ts`
- Modify: `src/lib/stations/get-station-by-slug.test.ts`
- Create: `tests/e2e/station-detail.spec.ts`

- [ ] **Step 1: 詳細データ表示の失敗テストを追加する**

```ts
test("returns parking, facilities, and source evidence", async () => {
  const station = await getStationBySlug("michinoeki-fuji");
  expect(station?.sourceRecords.length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: 必要なら失敗を確認する**

Run: `npm test -- src/lib/stations/get-station-by-slug.test.ts`
Expected: FAIL

- [ ] **Step 3: 詳細表示コンポーネントを実装する**

```tsx
<section>
  <h1>{station.name}</h1>
  <p>{station.address}</p>
  <p>{station.dataConfidence}</p>
</section>
```

- [ ] **Step 4: 動的ルートページを追加する**

```tsx
const station = await getStationBySlug(params.stationSlug);
if (!station) notFound();
return <StationDetail station={station} />;
```

- [ ] **Step 5: E2E テストを書く**

```ts
test("opens a station detail page from search results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Search" }).fill("Fuji");
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByRole("link", { name: "Michi-no-Eki Fuji" }).click();
  await expect(page.getByRole("heading", { name: "Michi-no-Eki Fuji" })).toBeVisible();
});
```

- [ ] **Step 6: 単体テストと E2E を通す**

Run: `npm test -- src/lib/stations/get-station-by-slug.test.ts`
Expected: PASS

Run: `npm run test:e2e -- tests/e2e/station-detail.spec.ts`
Expected: PASS

- [ ] **Step 7: ここまでをコミットする**

```bash
git add src/app/stations/[stationSlug]/page.tsx src/components/stations/station-detail.tsx src/lib/stations/get-station-by-slug.ts src/lib/stations/get-station-by-slug.test.ts tests/e2e/station-detail.spec.ts
git commit -m "feat: add station detail page"
```

## Task 6: 複数ソース比較で道の駅データを取り込む

**Files:**
- Create: `src/lib/importers/source-priority.ts`
- Create: `src/lib/importers/station-import-schema.ts`
- Create: `src/lib/importers/fetch-source-records.ts`
- Create: `src/lib/importers/normalize-station-record.ts`
- Create: `src/lib/importers/merge-station-sources.ts`
- Create: `src/lib/importers/normalize-station-record.test.ts`
- Create: `src/lib/importers/merge-station-sources.test.ts`
- Create: `scripts/import-stations.ts`
- Modify: `prisma/seed.ts`
- Modify: `README.md`

- [ ] **Step 1: 正規化処理の失敗テストを書く**

```ts
test("normalizes raw source records into comparable station fields", () => {
  const normalized = normalizeStationRecord({
    sourceName: "mlit",
    station_name: "Michi-no-Eki Fuji",
    prefecture_name: "Shizuoka",
    address_line: "669-1 Gokanjima, Fuji, Shizuoka",
  });

  expect(normalized.name).toBe("Michi-no-Eki Fuji");
});
```

- [ ] **Step 2: 採用ルールの失敗テストを書く**

```ts
test("prefers official source unless multiple trusted sources agree on another value", () => {
  const merged = mergeStationSources([
    { sourceName: "mlit", trustScore: 100, fields: { openingHours: "09:00-18:00" } },
    { sourceName: "aggregator-a", trustScore: 60, fields: { openingHours: "09:00-18:00" } },
    { sourceName: "aggregator-b", trustScore: 60, fields: { openingHours: "09:00-18:00" } },
  ]);

  expect(merged.openingHours.value).toBe("09:00-18:00");
  expect(merged.openingHours.confidence).toBe("high");
});
```

- [ ] **Step 3: ソース信頼度テーブルを定義する**

```ts
export const SOURCE_PRIORITY = {
  mlit: { trustScore: 100, type: "official" },
  prefecture: { trustScore: 90, type: "official" },
  stationOfficial: { trustScore: 85, type: "official" },
  aggregator: { trustScore: 60, type: "secondary" },
};
```

- [ ] **Step 4: 生データの正規化を実装する**

```ts
export function normalizeStationRecord(input: RawStationRecord) {
  return {
    sourceName: input.sourceName,
    name: input.station_name,
    prefecture: input.prefecture_name,
    address: input.address_line,
    openingHours: input.opening_hours ?? null,
  };
}
```

- [ ] **Step 5: 複数ソースの比較・採用ロジックを実装する**

```ts
export function mergeStationSources(records: NormalizedStationRecord[]) {
  // official source first, then agreement count, then trust score
}
```

- [ ] **Step 6: 取り込みスクリプトを実装する**

```ts
const grouped = groupByStationName(records);
for (const group of grouped) {
  const merged = mergeStationSources(group);
  await prisma.station.upsert({ ... });
  await prisma.stationSourceRecord.createMany({ data: group.map(toSourceRecordRow) });
}
```

- [ ] **Step 7: テストとサンプル取り込みを実行する**

Run: `npm test -- src/lib/importers/normalize-station-record.test.ts src/lib/importers/merge-station-sources.test.ts`
Expected: PASS

Run: `npx tsx scripts/import-stations.ts data/sources/sample-source-a.json data/sources/sample-source-b.json data/sources/sample-source-c.json`
Expected: 複数ソースを比較して station と source evidence が保存される

- [ ] **Step 8: README に運用方針を書く**

Run: `git diff -- README.md`
Expected: Docker 起動、Postgres 接続、複数ソース比較ルールが明記されている

- [ ] **Step 9: ここまでをコミットする**

```bash
git add src/lib/importers/source-priority.ts src/lib/importers/station-import-schema.ts src/lib/importers/fetch-source-records.ts src/lib/importers/normalize-station-record.ts src/lib/importers/merge-station-sources.ts src/lib/importers/normalize-station-record.test.ts src/lib/importers/merge-station-sources.test.ts scripts/import-stations.ts prisma/seed.ts README.md
git commit -m "feat: add multi-source station import pipeline"
```

## Task 7: 最終確認と MVP の仕上げ

**Files:**
- Modify: `README.md`
- Modify: 必要なら軽微な修正を入れる既存ファイル
- Test: `src/lib/stations/search-stations.test.ts`
- Test: `src/lib/stations/get-station-by-slug.test.ts`
- Test: `src/app/api/search/route.test.ts`
- Test: `src/components/stations/station-card.test.tsx`
- Test: `tests/e2e/home-search.spec.ts`
- Test: `tests/e2e/station-detail.spec.ts`

- [ ] **Step 1: トップページ検索の E2E を追加する**

```ts
test("searches from the homepage", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search by station, prefecture, or address").fill("Shizuoka");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/search/);
});
```

- [ ] **Step 2: 単体テストを全部流す**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: lint を流す**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: E2E テストを全部流す**

Run: `npm run test:e2e`
Expected: PASS

- [ ] **Step 5: 本番ビルドを確認する**

Run: `npm run build`
Expected: PASS

- [ ] **Step 6: README を最終調整する**

Run: `git diff -- README.md`
Expected: Docker 起動、migration、seed、複数ソース比較、検索確認手順が明確に書かれている

- [ ] **Step 7: ここまでをコミットする**

```bash
git add README.md tests/e2e/home-search.spec.ts tests/e2e/station-detail.spec.ts
git commit -m "docs: finalize michinoeki mvp setup guide"
```

## 実装中に再判断する項目

- 国土交通省以外に、都道府県、各道の駅公式、民間集約サイトのどこまでを初回対象にするか
- 値の採用ルールを「公式優先固定」にするか、「複数一致で上書き可」にするか
- 住所や営業時間のように変化しやすい項目と、登録日や道路名のように固定寄りな項目で採用ルールを分けるか
- 将来的に取得ジョブを定期実行する基盤をどこで持つか
