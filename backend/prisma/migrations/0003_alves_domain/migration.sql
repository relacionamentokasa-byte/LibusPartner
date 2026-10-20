CREATE TABLE IF NOT EXISTS "alves_clients" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "document" TEXT NOT NULL DEFAULT '',
  "phone" TEXT NOT NULL DEFAULT '',
  "whatsapp" TEXT NOT NULL DEFAULT '',
  "email" TEXT NOT NULL DEFAULT '',
  "address" JSONB NOT NULL,
  "notes" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "alves_clients_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "alves_clients_name_idx" ON "alves_clients"("name");
CREATE INDEX IF NOT EXISTS "alves_clients_document_idx" ON "alves_clients"("document");

CREATE TABLE IF NOT EXISTS "alves_proposals" (
  "id" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "originId" TEXT,
  "clientId" TEXT NOT NULL,
  "projectName" TEXT NOT NULL,
  "workAddress" TEXT NOT NULL,
  "responsible" TEXT NOT NULL,
  "issueDate" TIMESTAMP(3) NOT NULL,
  "expirationDate" TIMESTAMP(3) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'rascunho',
  "showRoomValues" BOOLEAN NOT NULL DEFAULT true,
  "rooms" JSONB NOT NULL,
  "commercialConditions" JSONB NOT NULL,
  "approval" JSONB,
  "publicToken" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "alves_proposals_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "alves_proposals_publicToken_key" ON "alves_proposals"("publicToken");
CREATE UNIQUE INDEX IF NOT EXISTS "alves_proposals_number_version_key" ON "alves_proposals"("number", "version");
CREATE INDEX IF NOT EXISTS "alves_proposals_status_idx" ON "alves_proposals"("status");
CREATE INDEX IF NOT EXISTS "alves_proposals_clientId_idx" ON "alves_proposals"("clientId");

CREATE TABLE IF NOT EXISTS "alves_contracts" (
  "id" TEXT NOT NULL,
  "number" TEXT NOT NULL,
  "proposalId" TEXT NOT NULL,
  "proposalNumber" TEXT NOT NULL,
  "proposalVersion" INTEGER NOT NULL,
  "clientId" TEXT NOT NULL,
  "projectName" TEXT NOT NULL,
  "workAddress" TEXT NOT NULL,
  "totalValue" DECIMAL(14,2) NOT NULL,
  "paymentTerms" TEXT NOT NULL,
  "deliveryDays" INTEGER NOT NULL,
  "warrantyMonths" INTEGER NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'aguardando_assinatura',
  "clauses" JSONB NOT NULL,
  "publicToken" TEXT NOT NULL,
  "signature" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "alves_contracts_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "alves_contracts_number_key" ON "alves_contracts"("number");
CREATE UNIQUE INDEX IF NOT EXISTS "alves_contracts_publicToken_key" ON "alves_contracts"("publicToken");
CREATE INDEX IF NOT EXISTS "alves_contracts_clientId_idx" ON "alves_contracts"("clientId");
CREATE INDEX IF NOT EXISTS "alves_contracts_proposalId_idx" ON "alves_contracts"("proposalId");

CREATE TABLE IF NOT EXISTS "alves_configurations" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "companyData" JSONB NOT NULL,
  "standardClauses" JSONB NOT NULL,
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "alves_configurations_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'alves_proposals_originId_fkey') THEN
    ALTER TABLE "alves_proposals"
      ADD CONSTRAINT "alves_proposals_originId_fkey"
      FOREIGN KEY ("originId") REFERENCES "alves_proposals"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'alves_proposals_clientId_fkey') THEN
    ALTER TABLE "alves_proposals"
      ADD CONSTRAINT "alves_proposals_clientId_fkey"
      FOREIGN KEY ("clientId") REFERENCES "alves_clients"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'alves_contracts_proposalId_fkey') THEN
    ALTER TABLE "alves_contracts"
      ADD CONSTRAINT "alves_contracts_proposalId_fkey"
      FOREIGN KEY ("proposalId") REFERENCES "alves_proposals"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'alves_contracts_clientId_fkey') THEN
    ALTER TABLE "alves_contracts"
      ADD CONSTRAINT "alves_contracts_clientId_fkey"
      FOREIGN KEY ("clientId") REFERENCES "alves_clients"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;
