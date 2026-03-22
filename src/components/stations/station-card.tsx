export type StationCardProps = {
  station: {
    slug: string;
    name: string;
    prefecture: string;
    address: string;
    openingHours?: string | null;
    dataConfidence?: string | null;
  };
};

function formatConfidence(value?: string | null) {
  if (value === "high") return "高";
  if (value === "medium") return "中";
  if (value === "low") return "低";

  return value ?? "未確認";
}

export function StationCard({ station }: StationCardProps) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white/80 p-5 shadow-sm">
      <a className="block no-underline" href={`/stations/${station.slug}`}>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-moss">{station.prefecture}</p>
        <h2 className="mt-2 text-xl font-semibold text-ink">{station.name}</h2>
        <p className="mt-2 text-sm text-black/70">{station.address}</p>
        {station.openingHours ? <p className="mt-3 text-sm text-black/70">営業時間: {station.openingHours}</p> : null}
        {station.dataConfidence ? <p className="mt-2 text-xs uppercase tracking-[0.16em] text-clay">信頼度: {formatConfidence(station.dataConfidence)}</p> : null}
      </a>
    </article>
  );
}
