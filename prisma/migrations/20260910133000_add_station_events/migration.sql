CREATE TABLE "public"."StationEvent" (
    "id" TEXT NOT NULL,
    "stationId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "type" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "priority" INTEGER NOT NULL DEFAULT 0,
    "imageUrl" TEXT,
    "officialUrl" TEXT,
    "sourceName" TEXT,
    "sourceUrl" TEXT,
    "trustScore" INTEGER,
    "observedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StationEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StationEvent_stationId_idx" ON "public"."StationEvent"("stationId");
CREATE INDEX "StationEvent_type_idx" ON "public"."StationEvent"("type");
CREATE INDEX "StationEvent_startsAt_idx" ON "public"."StationEvent"("startsAt");
CREATE INDEX "StationEvent_priority_idx" ON "public"."StationEvent"("priority");

ALTER TABLE "public"."StationEvent"
ADD CONSTRAINT "StationEvent_stationId_fkey"
FOREIGN KEY ("stationId") REFERENCES "public"."Station"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
