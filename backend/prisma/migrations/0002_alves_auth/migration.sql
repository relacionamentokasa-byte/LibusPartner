CREATE TABLE IF NOT EXISTS "alves_users" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'GESTOR',
  "active" BOOLEAN NOT NULL DEFAULT true,
  "resetPasswordToken" TEXT,
  "resetPasswordExpires" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "alves_users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "alves_users_email_key" ON "alves_users"("email");

ALTER TABLE "audit_logs" ADD COLUMN IF NOT EXISTS "alvesUserId" TEXT;
CREATE INDEX IF NOT EXISTS "audit_logs_alvesUserId_idx" ON "audit_logs"("alvesUserId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'audit_logs_alvesUserId_fkey'
  ) THEN
    ALTER TABLE "audit_logs"
      ADD CONSTRAINT "audit_logs_alvesUserId_fkey"
      FOREIGN KEY ("alvesUserId") REFERENCES "alves_users"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
