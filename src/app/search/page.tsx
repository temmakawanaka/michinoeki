import { listStationPrefectures } from "@/lib/stations/list-station-prefectures";
import { PrefectureFilter } from "@/components/search/prefecture-filter";
import { StationCard } from "@/components/stations/station-card";
import { searchStations } from "@/lib/stations/search-stations";

type SearchPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const prefecture = typeof params.prefecture === "string" ? params.prefecture : undefined;
  const [result, allPrefectures] = await Promise.all([searchStations({ q, prefecture }), listStationPrefectures()]);
  const availablePrefectures = prefecture && !allPrefectures.includes(prefecture) ? [...allPrefectures, prefecture].sort() : allPrefectures;

  return (
    <section className="mx-auto grid max-w-6xl gap-6 py-10">
      <div className="grid gap-3">
        <p className="text-sm uppercase tracking-[0.24em] text-moss">検索結果</p>
        <h1 className="text-3xl font-semibold text-ink">{result.total}件の道の駅が見つかりました</h1>
        <p className="text-sm text-black/65">検索キーワード: {q || "すべての道の駅"}</p>
        <PrefectureFilter prefectures={availablePrefectures} query={q} selected={prefecture} />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {result.items.map((station) => (
          <StationCard key={station.slug} station={station} />
        ))}
      </div>
    </section>
  );
}
