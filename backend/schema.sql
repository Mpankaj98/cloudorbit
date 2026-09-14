-- Run this once against your Amazon RDS (PostgreSQL) database
-- e.g. psql -h <RDS_HOST> -U <RDS_USER> -d <RDS_DATABASE> -f schema.sql

CREATE TABLE IF NOT EXISTS leads (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(160) NOT NULL,
  phone       VARCHAR(20)  NOT NULL,
  profession  VARCHAR(30)  NOT NULL,
  course      VARCHAR(60)  NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Safe to re-run against a database created before email/profession existed —
-- backfills existing rows with '' so the NOT NULL constraint can be added.
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email VARCHAR(160) NOT NULL DEFAULT '';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS profession VARCHAR(30) NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
