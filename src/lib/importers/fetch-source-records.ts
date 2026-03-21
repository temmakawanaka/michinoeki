import { readFile } from "node:fs/promises";
import path from "node:path";

import { rawStationRecordSchema, sourceFileSchema, type RawStationRecord } from "./station-import-schema";

export async function fetchSourceRecords(filePaths: string[]) {
  const records: RawStationRecord[] = [];

  for (const filePath of filePaths) {
    const absolutePath = path.resolve(process.cwd(), filePath);
    const parsed = sourceFileSchema.parse(JSON.parse(await readFile(absolutePath, "utf8")));
    const items = Array.isArray(parsed) ? parsed : parsed.records;

    records.push(...items.map((item) => rawStationRecordSchema.parse(item)));
  }

  return records;
}