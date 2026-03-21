# Michinoeki Directory MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first public MVP of the michinoeki service: a nationwide station directory with search, result listing, and detail pages backed by a structured station master database.

**Architecture:** Use a single Next.js application with server-rendered pages and route handlers, backed by a relational database managed through Prisma. Model station master data in a normalized way so the MVP can ship with basic search and detail pages now, while leaving room for future updates, facilities filtering, and community features.

**Tech Stack:** Next.js App Router, TypeScript, React, Tailwind CSS, Prisma ORM, SQLite for local development, Vitest, React Testing Library, Playwright, Zod, ESLint

---

## Assumptions

- This repository is still greenfield, so the plan includes initial scaffolding.
- The first implementation should optimize for developer speed and correctness over production-scale infrastructure.
- Local development will use SQLite. If production later needs PostgreSQL, the Prisma schema can be adapted after the MVP is validated.
- The first import should prove the shape of the data pipeline. It does not need perfect nationwide completeness on day one, but it must support nationwide records structurally.
- Test snippets use ASCII sample strings to avoid terminal encoding issues while the real product copy can stay Japanese.

## Proposed File Structure

### Root App and Tooling

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

### App Shell and Routes

- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Create: `src/app/search/page.tsx`
- Create: `src/app/stations/[stationSlug]/page.tsx`
- Create: `src/app/api/search/route.ts`

### Domain and Data Access

- Create: `src/lib/db.ts`
- Create: `src/lib/env.ts`
- Create: `src/lib/stations/search-stations.ts`
- Create: `src/lib/stations/get-station-by-slug.ts`
- Create: `src/lib/stations/station-query-schema.ts`
- Create: `src/lib/stations/station-mappers.ts`

### UI Components

- Create: `src/components/search/hero-search-form.tsx`
- Create: `src/components/search/prefecture-filter.tsx`
- Create: `src/components/stations/station-card.tsx`
- Create: `src/components/stations/station-detail.tsx`
- Create: `src/components/layout/site-header.tsx`

### Database and Seed Data

- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `prisma/migrations/`
- Create: `data/stations/sample-stations.json`

### Import Pipeline

- Create: `scripts/import-stations.ts`
- Create: `src/lib/importers/station-import-schema.ts`
- Create: `src/lib/importers/normalize-station-record.ts`
- Create: `src/lib/importers/normalize-station-record.test.ts`

### Tests

- Create: `src/lib/stations/search-stations.test.ts`
- Create: `src/lib/stations/get-station-by-slug.test.ts`
- Create: `src/app/api/search/route.test.ts`
- Create: `src/components/layout/site-header.test.tsx`
- Create: `src/components/stations/station-card.test.tsx`
- Create: `tests/e2e/home-search.spec.ts`
- Create: `tests/e2e/station-detail.spec.ts`

### Documentation

- Modify: `README.md`

## Task 1: Bootstrap the project skeleton

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
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/components/layout/site-header.tsx`
- Create: `src/components/layout/site-header.test.tsx`

- [ ] **Step 1: Write a smoke test for the app shell**

```tsx
import { render, screen } from "@testing-library/react";
import { SiteHeader } from "./site-header";

test("renders site title", () => {
  render(<SiteHeader />);
  expect(screen.getByText("Michi no Eki Guide")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify the project is not ready yet**

Run: `npm test -- src/components/layout/site-header.test.tsx`
Expected: FAIL because the project files and test runner are not configured yet

- [ ] **Step 3: Scaffold the Next.js + TypeScript + Tailwind project files**

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
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts"
  }
}
```

- [ ] **Step 4: Implement the global app shell**

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

- [ ] **Step 5: Add the passing unit test for the header**

Run: `npm test -- src/components/layout/site-header.test.tsx`
Expected: PASS

- [ ] **Step 6: Sanity-check linting**

Run: `npm run lint`
Expected: PASS with no lint errors

- [ ] **Step 7: Commit the bootstrap**

```bash
git add package.json next.config.ts tsconfig.json postcss.config.js tailwind.config.ts eslint.config.js playwright.config.ts vitest.config.ts .env.example .gitignore src/app/layout.tsx src/app/globals.css src/components/layout/site-header.tsx src/components/layout/site-header.test.tsx
git commit -m "chore: bootstrap nextjs app shell"
```

## Task 2: Define the station master data model

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `src/lib/stations/get-station-by-slug.ts`
- Create: `src/lib/stations/get-station-by-slug.test.ts`
- Create: `data/stations/sample-stations.json`
- Create: `prisma/seed.ts`

- [ ] **Step 1: Write the failing data access test for station lookup**

```ts
import { getStationBySlug } from "./get-station-by-slug";

test("returns a station by slug", async () => {
  const station = await getStationBySlug("michinoeki-fuji");
  expect(station?.name).toBe("Michi-no-Eki Fuji");
  expect(station?.facilities.hasShop).toBe(true);
});
```

- [ ] **Step 2: Run the lookup test and verify it fails**

Run: `npm test -- src/lib/stations/get-station-by-slug.test.ts`
Expected: FAIL because there is no schema, seed, or query function yet

- [ ] **Step 3: Define the Prisma schema**

```prisma
model Station {
  id                String           @id @default(cuid())
  slug              String           @unique
  name              String
  prefecture        String
  address           String
  latitude          Float?
  longitude         Float?
  phoneNumber       String?
  websiteUrl        String?
  registeredAt      DateTime?
  roadName          String?
  elevationMeters   Int?
  openingHours      String?
  closingDays       String?
  overview          String?
  signatureItem     String?
  recommendedMenu   String?
  souvenir          String?
  nearbySightseeing String?
  nearbyOnsen       String?
  stampLocation     String?
  stampHours        String?
  dataSource        String?
  lastVerifiedAt    DateTime?
  parking           ParkingCapacity?
  facilities        StationFacilities?
}
```

- [ ] **Step 4: Add related parking and facilities models plus a seed fixture**

```ts
await prisma.station.create({
  data: {
    slug: "michinoeki-fuji",
    name: "Michi-no-Eki Fuji",
    prefecture: "Shizuoka",
    address: "669-1 Gokanjima, Fuji, Shizuoka",
    facilities: { create: { hasShop: true, hasWifi: true } },
    parking: { create: { regularCars: 52, accessibleCars: 2, largeVehicles: 12 } },
  },
});
```

- [ ] **Step 5: Implement `getStationBySlug` with Prisma**

```ts
export async function getStationBySlug(slug: string) {
  return prisma.station.findUnique({
    where: { slug },
    include: { facilities: true, parking: true },
  });
}
```

- [ ] **Step 6: Run migration, seed, and test**

Run: `npm run db:migrate -- --name init_station_master`
Expected: Prisma migration succeeds

Run: `npm run db:seed`
Expected: Sample station data is inserted

Run: `npm test -- src/lib/stations/get-station-by-slug.test.ts`
Expected: PASS

- [ ] **Step 7: Commit the data model**

```bash
git add prisma/schema.prisma prisma/seed.ts src/lib/db.ts src/lib/stations/get-station-by-slug.ts src/lib/stations/get-station-by-slug.test.ts data/stations/sample-stations.json prisma/migrations
git commit -m "feat: add station master data model"
```

## Task 3: Build searchable station queries and API validation

**Files:**
- Create: `src/lib/stations/station-query-schema.ts`
- Create: `src/lib/stations/station-mappers.ts`
- Create: `src/lib/stations/search-stations.ts`
- Create: `src/lib/stations/search-stations.test.ts`
- Create: `src/app/api/search/route.ts`
- Create: `src/app/api/search/route.test.ts`

- [ ] **Step 1: Write the failing search use-case test**

```ts
import { searchStations } from "./search-stations";

test("filters by keyword and prefecture", async () => {
  const result = await searchStations({ q: "Fuji", prefecture: "Shizuoka" });
  expect(result.total).toBe(1);
  expect(result.items[0]?.slug).toBe("michinoeki-fuji");
});
```

- [ ] **Step 2: Run the search test to verify it fails**

Run: `npm test -- src/lib/stations/search-stations.test.ts`
Expected: FAIL because the query parser and search logic do not exist yet

- [ ] **Step 3: Add request validation with Zod**

```ts
export const stationQuerySchema = z.object({
  q: z.string().trim().optional().default(""),
  prefecture: z.string().trim().optional(),
});
```

- [ ] **Step 4: Implement the Prisma-backed search use case**

```ts
const where = {
  AND: [
    prefecture ? { prefecture } : {},
    q
      ? {
          OR: [
            { name: { contains: q } },
            { prefecture: { contains: q } },
            { address: { contains: q } },
          ],
        }
      : {},
  ],
};
```

- [ ] **Step 5: Add the search API route**

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

- [ ] **Step 6: Run unit tests for domain and route layers**

Run: `npm test -- src/lib/stations/search-stations.test.ts src/app/api/search/route.test.ts`
Expected: PASS

- [ ] **Step 7: Commit the search layer**

```bash
git add src/lib/stations/station-query-schema.ts src/lib/stations/station-mappers.ts src/lib/stations/search-stations.ts src/lib/stations/search-stations.test.ts src/app/api/search/route.ts src/app/api/search/route.test.ts
git commit -m "feat: add station search use case"
```

## Task 4: Build the landing page and results page

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/search/page.tsx`
- Create: `src/components/search/hero-search-form.tsx`
- Create: `src/components/search/prefecture-filter.tsx`
- Create: `src/components/stations/station-card.tsx`
- Create: `src/components/stations/station-card.test.tsx`

- [ ] **Step 1: Write the failing component test for station cards**

```tsx
import { render, screen } from "@testing-library/react";
import { StationCard } from "./station-card";

test("shows basic station summary", () => {
  render(
    <StationCard
      station={{
        slug: "michinoeki-fuji",
        name: "Michi-no-Eki Fuji",
        prefecture: "Shizuoka",
        address: "669-1 Gokanjima, Fuji, Shizuoka",
      }}
    />,
  );

  expect(screen.getByText("Michi-no-Eki Fuji")).toBeInTheDocument();
  expect(screen.getByText("Shizuoka")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the component test and verify it fails**

Run: `npm test -- src/components/stations/station-card.test.tsx`
Expected: FAIL because the component does not exist yet

- [ ] **Step 3: Implement the hero search form and station card**

```tsx
<form action="/search">
  <input name="q" placeholder="Search by station, prefecture, or address" />
  <button type="submit">Search</button>
</form>
```

- [ ] **Step 4: Implement the results page using the server-side search function**

```tsx
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const result = await searchStations({
    q: searchParams.q ?? "",
    prefecture: searchParams.prefecture,
  });

  return (
    <section>
      {result.items.map((station) => (
        <StationCard key={station.slug} station={station} />
      ))}
    </section>
  );
}
```

- [ ] **Step 5: Re-run the component tests**

Run: `npm test -- src/components/stations/station-card.test.tsx`
Expected: PASS

- [ ] **Step 6: Manually verify the search flow in the browser**

Run: `npm run dev`
Expected: The home page renders, form submission navigates to `/search`, and results are listed

- [ ] **Step 7: Commit the listing UI**

```bash
git add src/app/page.tsx src/app/search/page.tsx src/components/search/hero-search-form.tsx src/components/search/prefecture-filter.tsx src/components/stations/station-card.tsx src/components/stations/station-card.test.tsx
git commit -m "feat: add station directory search pages"
```

## Task 5: Build the station detail page

**Files:**
- Create: `src/app/stations/[stationSlug]/page.tsx`
- Create: `src/components/stations/station-detail.tsx`
- Modify: `src/lib/stations/get-station-by-slug.ts`
- Modify: `src/lib/stations/get-station-by-slug.test.ts`
- Create: `tests/e2e/station-detail.spec.ts`

- [ ] **Step 1: Extend the failing test to cover facility and parking output**

```ts
test("returns parking and facility data", async () => {
  const station = await getStationBySlug("michinoeki-fuji");
  expect(station?.parking?.regularCars).toBe(52);
  expect(station?.facilities?.hasWifi).toBe(true);
});
```

- [ ] **Step 2: Run the lookup test and confirm the new expectation fails if needed**

Run: `npm test -- src/lib/stations/get-station-by-slug.test.ts`
Expected: FAIL until related fields are mapped and displayed consistently

- [ ] **Step 3: Implement the detail presentation component**

```tsx
<section>
  <h1>{station.name}</h1>
  <p>{station.address}</p>
  <dl>
    <dt>Opening Hours</dt>
    <dd>{station.openingHours ?? "Unconfirmed"}</dd>
  </dl>
</section>
```

- [ ] **Step 4: Add the dynamic station page**

```tsx
const station = await getStationBySlug(params.stationSlug);

if (!station) {
  notFound();
}

return <StationDetail station={station} />;
```

- [ ] **Step 5: Add the end-to-end test for station navigation**

```ts
test("opens a station detail page from search results", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Search" }).fill("Fuji");
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByRole("link", { name: "Michi-no-Eki Fuji" }).click();
  await expect(page.getByRole("heading", { name: "Michi-no-Eki Fuji" })).toBeVisible();
});
```

- [ ] **Step 6: Run unit and e2e checks for the detail flow**

Run: `npm test -- src/lib/stations/get-station-by-slug.test.ts`
Expected: PASS

Run: `npm run test:e2e -- tests/e2e/station-detail.spec.ts`
Expected: PASS

- [ ] **Step 7: Commit the detail page**

```bash
git add src/app/stations/[stationSlug]/page.tsx src/components/stations/station-detail.tsx src/lib/stations/get-station-by-slug.ts src/lib/stations/get-station-by-slug.test.ts tests/e2e/station-detail.spec.ts
git commit -m "feat: add station detail page"
```

## Task 6: Add the import pipeline for structured station records

**Files:**
- Create: `src/lib/importers/station-import-schema.ts`
- Create: `src/lib/importers/normalize-station-record.ts`
- Create: `src/lib/importers/normalize-station-record.test.ts`
- Create: `scripts/import-stations.ts`
- Modify: `prisma/seed.ts`
- Modify: `README.md`

- [ ] **Step 1: Write the failing normalization test**

```ts
import { normalizeStationRecord } from "./normalize-station-record";

test("normalizes raw source data into station create input", () => {
  const normalized = normalizeStationRecord({
    station_name: "Michi-no-Eki Fuji",
    prefecture_name: "Shizuoka",
    address_line: "669-1 Gokanjima, Fuji, Shizuoka",
  });

  expect(normalized.slug).toBe("michinoeki-fuji");
  expect(normalized.prefecture).toBe("Shizuoka");
});
```

- [ ] **Step 2: Run the normalization test to confirm it fails**

Run: `npm test -- src/lib/importers/normalize-station-record.test.ts`
Expected: FAIL because the importer does not exist yet

- [ ] **Step 3: Define the raw-input schema and normalization rules**

```ts
export const rawStationSchema = z.object({
  station_name: z.string(),
  prefecture_name: z.string(),
  address_line: z.string(),
  website_url: z.string().optional(),
});
```

- [ ] **Step 4: Implement the import script**

```ts
const records = rawStationSchema.array().parse(JSON.parse(rawJson));

for (const record of records) {
  const data = normalizeStationRecord(record);
  await prisma.station.upsert({
    where: { slug: data.slug },
    update: data,
    create: data,
  });
}
```

- [ ] **Step 5: Run the importer against sample data**

Run: `npx tsx scripts/import-stations.ts data/stations/sample-stations.json`
Expected: The script completes and inserts or updates station rows

- [ ] **Step 6: Update the README with local setup and import instructions**

Run: `npm test -- src/lib/importers/normalize-station-record.test.ts`
Expected: PASS

- [ ] **Step 7: Commit the import workflow**

```bash
git add src/lib/importers/station-import-schema.ts src/lib/importers/normalize-station-record.ts src/lib/importers/normalize-station-record.test.ts scripts/import-stations.ts prisma/seed.ts README.md
git commit -m "feat: add station import pipeline"
```

## Task 7: Final verification and MVP polish

**Files:**
- Modify: `README.md`
- Modify: any touched file if small polish is required during verification
- Test: `src/lib/stations/search-stations.test.ts`
- Test: `src/lib/stations/get-station-by-slug.test.ts`
- Test: `src/app/api/search/route.test.ts`
- Test: `src/components/stations/station-card.test.tsx`
- Test: `tests/e2e/home-search.spec.ts`
- Test: `tests/e2e/station-detail.spec.ts`

- [ ] **Step 1: Add the home-page e2e spec if not already present**

```ts
test("searches from the homepage", async ({ page }) => {
  await page.goto("/");
  await page.getByPlaceholder("Search by station, prefecture, or address").fill("Shizuoka");
  await page.getByRole("button", { name: "Search" }).click();
  await expect(page).toHaveURL(/\/search/);
});
```

- [ ] **Step 2: Run the full unit test suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Run the full end-to-end suite**

Run: `npm run test:e2e`
Expected: PASS

- [ ] **Step 5: Run the production build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 6: Update README one last time with MVP scope and commands**

Run: `git diff -- README.md`
Expected: Shows clear local setup, test, seed, and import instructions

- [ ] **Step 7: Commit the verified MVP**

```bash
git add README.md tests/e2e/home-search.spec.ts tests/e2e/station-detail.spec.ts
git commit -m "docs: finalize michinoeki mvp setup guide"
```

## Open Decisions To Revisit During Implementation

- Whether to keep SQLite in the first deployed environment or switch to PostgreSQL before launch
- How to generate slugs for stations whose names do not map cleanly to ASCII
- Which nationwide source should become the canonical input for the first bulk import
- Whether prefecture filtering should remain query-string based only or also get dedicated navigation UI
