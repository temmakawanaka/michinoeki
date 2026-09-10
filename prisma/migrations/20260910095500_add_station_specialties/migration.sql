-- CreateTable
CREATE TABLE "public"."StationSpecialty" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "priceLabel" TEXT,
    "salesPlace" TEXT,
    "season" TEXT,
    "officialUrl" TEXT,
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "trustScore" INTEGER,
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StationSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StationSpecialty_stationId_idx" ON "public"."StationSpecialty"("stationId");

-- CreateIndex
CREATE INDEX "StationSpecialty_category_idx" ON "public"."StationSpecialty"("category");

-- CreateIndex
CREATE INDEX "StationSpecialty_name_idx" ON "public"."StationSpecialty"("name");

-- AddForeignKey
ALTER TABLE "public"."StationSpecialty" ADD CONSTRAINT "StationSpecialty_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
