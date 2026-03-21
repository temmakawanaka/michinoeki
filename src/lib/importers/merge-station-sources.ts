import type { ConfidenceLevel, NormalizedStationRecord } from "./normalize-station-record";

type Candidate<T> = {
  value: T;
  sourceName: string;
  sourceType: "official" | "secondary";
  trustScore: number;
};

type CandidateGroup<T> = {
  value: T;
  sourceNames: string[];
  officialSupport: number;
  trustedAgreementCount: number;
  totalTrustScore: number;
  maxTrustScore: number;
};

export type MergedField<T> = {
  value: T | null;
  confidence: ConfidenceLevel;
  sources: string[];
};

export type MergedStationRecord = {
  slug: string;
  name: MergedField<string>;
  prefecture: MergedField<string>;
  address: MergedField<string>;
  openingHours: MergedField<string>;
  closingDays: MergedField<string>;
  websiteUrl: MergedField<string>;
  parking: {
    regularCars: MergedField<number>;
    accessibleCars: MergedField<number>;
    largeVehicles: MergedField<number>;
  };
  facilities: {
    hasShop: MergedField<boolean>;
    hasWifi: MergedField<boolean>;
  };
  dataConfidence: ConfidenceLevel;
  sourceRecords: NormalizedStationRecord[];
};

const CONFIDENCE_ORDER: Record<ConfidenceLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

function buildGroups<T>(candidates: Candidate<T>[]) {
  const groups = new Map<string, CandidateGroup<T>>();

  for (const candidate of candidates) {
    const key = JSON.stringify(candidate.value);
    const current = groups.get(key);

    if (current) {
      current.sourceNames.push(candidate.sourceName);
      current.officialSupport += candidate.sourceType === "official" ? 1 : 0;
      current.trustedAgreementCount += candidate.trustScore >= 60 ? 1 : 0;
      current.totalTrustScore += candidate.trustScore;
      current.maxTrustScore = Math.max(current.maxTrustScore, candidate.trustScore);
      continue;
    }

    groups.set(key, {
      value: candidate.value,
      sourceNames: [candidate.sourceName],
      officialSupport: candidate.sourceType === "official" ? 1 : 0,
      trustedAgreementCount: candidate.trustScore >= 60 ? 1 : 0,
      totalTrustScore: candidate.trustScore,
      maxTrustScore: candidate.trustScore,
    });
  }

  return [...groups.values()].sort((left, right) => {
    const leftScore = left.totalTrustScore + (left.officialSupport > 0 ? 80 : 0) + (left.trustedAgreementCount >= 2 ? 100 : 0);
    const rightScore = right.totalTrustScore + (right.officialSupport > 0 ? 80 : 0) + (right.trustedAgreementCount >= 2 ? 100 : 0);

    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }

    if (right.trustedAgreementCount !== left.trustedAgreementCount) {
      return right.trustedAgreementCount - left.trustedAgreementCount;
    }

    return right.maxTrustScore - left.maxTrustScore;
  });
}

function resolveConfidence<T>(group: CandidateGroup<T>): ConfidenceLevel {
  if (group.officialSupport > 0 || group.trustedAgreementCount >= 2) {
    return "high";
  }

  if (group.sourceNames.length >= 2 || group.maxTrustScore >= 85) {
    return "medium";
  }

  return "low";
}

// eslint-disable-next-line no-unused-vars
function pickField<T>(records: NormalizedStationRecord[], selector: (record: NormalizedStationRecord) => T | null): MergedField<T> {
  const candidates: Candidate<T>[] = [];

  for (const record of records) {
    const value = selector(record);

    if (value === null || value === undefined) {
      continue;
    }

    candidates.push({
      value,
      sourceName: record.sourceName,
      sourceType: record.sourceType,
      trustScore: record.trustScore,
    });
  }

  if (candidates.length === 0) {
    return {
      value: null,
      confidence: "low",
      sources: [],
    };
  }

  const [winner] = buildGroups(candidates);

  return {
    value: winner.value,
    confidence: resolveConfidence(winner),
    sources: winner.sourceNames,
  };
}

function minConfidence(levels: ConfidenceLevel[]) {
  return levels.reduce((lowest, current) => {
    if (CONFIDENCE_ORDER[current] < CONFIDENCE_ORDER[lowest]) {
      return current;
    }

    return lowest;
  }, "high" as ConfidenceLevel);
}

export function mergeStationSources(records: NormalizedStationRecord[]): MergedStationRecord {
  if (records.length === 0) {
    throw new Error("mergeStationSources requires at least one record.");
  }

  const slug = pickField(records, (record) => record.slug).value ?? records[0].slug;
  const name = pickField(records, (record) => record.name);
  const prefecture = pickField(records, (record) => record.prefecture);
  const address = pickField(records, (record) => record.address);
  const openingHours = pickField(records, (record) => record.openingHours);
  const closingDays = pickField(records, (record) => record.closingDays);
  const websiteUrl = pickField(records, (record) => record.websiteUrl);
  const regularCars = pickField(records, (record) => record.parking.regularCars);
  const accessibleCars = pickField(records, (record) => record.parking.accessibleCars);
  const largeVehicles = pickField(records, (record) => record.parking.largeVehicles);
  const hasShop = pickField(records, (record) => record.facilities.hasShop);
  const hasWifi = pickField(records, (record) => record.facilities.hasWifi);

  return {
    slug,
    name,
    prefecture,
    address,
    openingHours,
    closingDays,
    websiteUrl,
    parking: {
      regularCars,
      accessibleCars,
      largeVehicles,
    },
    facilities: {
      hasShop,
      hasWifi,
    },
    dataConfidence: minConfidence([name.confidence, prefecture.confidence, address.confidence]),
    sourceRecords: records,
  };
}