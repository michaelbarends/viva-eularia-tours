-- Convert duration to startTime and endTime
ALTER TABLE "Stop" ADD COLUMN "startTime" TEXT;
ALTER TABLE "Stop" ADD COLUMN "endTime" TEXT;

-- Update existing records with default values
UPDATE "Stop" SET 
  "startTime" = '09:00',
  "endTime" = '10:00'
WHERE "startTime" IS NULL OR "endTime" IS NULL;

-- Make the new columns non-nullable
ALTER TABLE "Stop" ALTER COLUMN "startTime" SET NOT NULL;
ALTER TABLE "Stop" ALTER COLUMN "endTime" SET NOT NULL;

-- Drop the duration column
ALTER TABLE "Stop" DROP COLUMN "duration";
