export const SOURCE_PRIORITY = {
  mlit: { trustScore: 100, type: "official" },
  prefecture: { trustScore: 90, type: "official" },
  stationOfficial: { trustScore: 85, type: "official" },
  aggregatorA: { trustScore: 60, type: "secondary" },
  aggregatorB: { trustScore: 60, type: "secondary" },
  aggregatorC: { trustScore: 55, type: "secondary" },
} as const;

export type KnownSourceName = keyof typeof SOURCE_PRIORITY;

export type SourceMetadata = {
  trustScore: number;
  type: "official" | "secondary";
};

const FALLBACK_SOURCE: SourceMetadata = {
  trustScore: 40,
  type: "secondary",
};

export function getSourceMetadata(sourceName: string): SourceMetadata {
  return SOURCE_PRIORITY[sourceName as KnownSourceName] ?? FALLBACK_SOURCE;
}