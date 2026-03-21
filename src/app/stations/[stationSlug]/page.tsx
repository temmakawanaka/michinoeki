import { notFound } from "next/navigation";

import { StationDetail } from "@/components/stations/station-detail";
import { getStationBySlug } from "@/lib/stations/get-station-by-slug";

type StationPageProps = {
  params: Promise<{ stationSlug: string }>;
};

export default async function StationPage({ params }: StationPageProps) {
  const { stationSlug } = await params;
  const station = await getStationBySlug(stationSlug);

  if (!station) {
    notFound();
  }

  return <StationDetail station={station} />;
}