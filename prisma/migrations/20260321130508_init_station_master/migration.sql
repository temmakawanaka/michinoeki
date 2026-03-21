-- CreateTable
CREATE TABLE "public"."Station" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefecture" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "openingHours" TEXT,
    "closingDays" TEXT,
    "websiteUrl" TEXT,
    "dataConfidence" TEXT,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StationSourceRecord" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "sourceName" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "rawPayload" JSONB NOT NULL,
    "extractedName" TEXT,
    "extractedValue" JSONB,
    "trustScore" INTEGER NOT NULL,
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StationSourceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ParkingCapacity" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "regularCars" INTEGER,
    "accessibleCars" INTEGER,
    "largeVehicles" INTEGER,

    CONSTRAINT "ParkingCapacity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StationFacilities" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "hasShop" BOOLEAN NOT NULL DEFAULT false,
    "hasWifi" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "StationFacilities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Station_slug_key" ON "public"."Station"("slug");

-- CreateIndex
CREATE INDEX "StationSourceRecord_stationId_idx" ON "public"."StationSourceRecord"("stationId");

-- CreateIndex
CREATE UNIQUE INDEX "ParkingCapacity_stationId_key" ON "public"."ParkingCapacity"("stationId");

-- CreateIndex
CREATE UNIQUE INDEX "StationFacilities_stationId_key" ON "public"."StationFacilities"("stationId");

-- AddForeignKey
ALTER TABLE "public"."StationSourceRecord" ADD CONSTRAINT "StationSourceRecord_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ParkingCapacity" ADD CONSTRAINT "ParkingCapacity_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StationFacilities" ADD CONSTRAINT "StationFacilities_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "public"."Station"("id") ON DELETE CASCADE ON UPDATE CASCADE;
