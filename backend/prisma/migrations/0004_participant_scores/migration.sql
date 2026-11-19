-- Add participant ownership to criterion responses without deleting legacy rows.
ALTER TABLE "evaluation_criterion_responses"
  ADD COLUMN "participantId" TEXT;

ALTER TABLE "evaluation_criterion_responses"
  ADD CONSTRAINT "evaluation_criterion_responses_participantId_fkey"
  FOREIGN KEY ("participantId") REFERENCES "evaluation_participants"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "evaluation_criterion_responses_participantId_idx"
  ON "evaluation_criterion_responses"("participantId");

-- Existing rows remain the legacy consolidated response (participantId NULL).
-- Remove the previous single-response constraint before allowing one response per participant.
DROP INDEX IF EXISTS "evaluation_criterion_responses_comparisonId_attributeId_key";

-- New participant-owned rows are unique by comparison, criterion and participant.
CREATE UNIQUE INDEX "evaluation_criterion_responses_comparisonId_attributeId_participantId_key"
  ON "evaluation_criterion_responses"("comparisonId", "attributeId", "participantId");
