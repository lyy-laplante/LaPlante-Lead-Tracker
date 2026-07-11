CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  contact_info text,
  property_address text,
  source text NOT NULL DEFAULT 'phone'
    CHECK (source IN ('website', 'phone', 'email', 'referral', 'other')),
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'waiting', 'scheduled', 'lost')),
  last_contact_date date,
  next_follow_up_date date,
  notes text
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_set_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

CREATE INDEX leads_next_follow_up_idx ON leads (next_follow_up_date);
CREATE INDEX leads_status_idx ON leads (status);
