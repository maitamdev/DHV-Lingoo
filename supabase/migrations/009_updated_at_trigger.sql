-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS 
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;  LANGUAGE plpgsql;
CREATE TRIGGER profiles_updated BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
