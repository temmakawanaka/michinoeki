type StationDetailProps = {
  station: {
    slug: string;
    name: string;
    prefecture: string;
    address: string;
    openingHours?: string | null;
    closingDays?: string | null;
    dataConfidence?: string | null;
    parking?: {
      regularCars?: number | null;
      accessibleCars?: number | null;
      largeVehicles?: number | null;
    } | null;
    facilities?: {
      hasShop?: boolean;
      hasWifi?: boolean;
    } | null;
    sourceRecords: Array<{
      id: string;
      sourceName: string;
      sourceType: string;
      trustScore: number;
    }>;
  };
};

export function StationDetail({ station }: StationDetailProps) {
  return (
    <section className="mx-auto grid max-w-5xl gap-8 py-10">
      <div className="grid gap-3 rounded-3xl border border-black/10 bg-white/80 p-8 shadow-sm">
        <p className="text-sm uppercase tracking-[0.24em] text-moss">{station.prefecture}</p>
        <h1 className="text-4xl font-semibold text-ink">{station.name}</h1>
        <p className="text-base leading-7 text-black/75">{station.address}</p>
        <div className="grid gap-2 text-sm text-black/75 md:grid-cols-2">
          <p>Opening Hours: {station.openingHours ?? "Unconfirmed"}</p>
          <p>Closed: {station.closingDays ?? "Unconfirmed"}</p>
          <p>Confidence: {station.dataConfidence ?? "unknown"}</p>
          <p>Sources: {station.sourceRecords.length}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">Parking</h2>
          <ul className="mt-3 grid gap-2 text-sm text-black/75">
            <li>Regular: {station.parking?.regularCars ?? "-"}</li>
            <li>Accessible: {station.parking?.accessibleCars ?? "-"}</li>
            <li>Large Vehicles: {station.parking?.largeVehicles ?? "-"}</li>
          </ul>
        </article>

        <article className="rounded-3xl border border-black/10 bg-white/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">Facilities</h2>
          <ul className="mt-3 grid gap-2 text-sm text-black/75">
            <li>Shop: {station.facilities?.hasShop ? "Yes" : "No"}</li>
            <li>Wi-Fi: {station.facilities?.hasWifi ? "Yes" : "No"}</li>
          </ul>
        </article>
      </div>
    </section>
  );
}