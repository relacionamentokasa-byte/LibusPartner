CREATE TABLE "evaluation_participant_signatures" (
  "id" TEXT NOT NULL,
  "evaluationId" TEXT NOT NULL,
  "participantId" TEXT NOT NULL,
  "signature" TEXT NOT NULL,
  "signerName" TEXT NOT NULL,
  "signerRole" TEXT NOT NULL,
  "signerDocument" TEXT,
  "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "evaluation_participant_signatures_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "evaluation_participant_signatures_evaluationId_participantId_key" ON "evaluation_participant_signatures"("evaluationId", "participantId");
CREATE INDEX "evaluation_participant_signatures_participantId_idx" ON "evaluation_participant_signatures"("participantId");

ALTER TABLE "evaluation_participant_signatures" ADD CONSTRAINT "evaluation_participant_signatures_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "evaluations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "evaluation_participant_signatures" ADD CONSTRAINT "evaluation_participant_signatures_participantId_fkey" FOREIGN KEY ("participantId") REFERENCES "evaluation_participants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
