import { prisma } from "../src/lib/db";
import { importStationsFromFiles } from "../src/lib/importers/import-stations";

async function main() {
  const filePaths = process.argv.slice(2);

  if (filePaths.length === 0) {
    throw new Error("Pass at least one source file path. Example: tsx scripts/import-stations.ts data/sources/sample-source-a.json");
  }

  const result = await importStationsFromFiles(filePaths);

  console.log(`Imported ${result.importedStations} stations from ${result.importedSourceRecords} source records.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });