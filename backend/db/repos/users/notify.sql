CREATE OR REPLACE FUNCTION table_update_notify() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM pg_notify(TG_TABLE_NAME, json_build_object(
      'table', TG_TABLE_NAME,
      'new', row_to_json(NEW),
      'type', TG_OP
    )::text);
  ELSEIF TG_OP = 'UPDATE' THEN
    PERFORM pg_notify(TG_TABLE_NAME, json_build_object(
      'table', TG_TABLE_NAME,
      'new', row_to_json(NEW),
      'old', row_to_json(OLD),
      'type', TG_OP
    )::text);
  ELSEIF TG_OP = 'DELETE' THEN
    PERFORM pg_notify(TG_TABLE_NAME, json_build_object(
      'table', TG_TABLE_NAME,
      'old', row_to_json(OLD),
      'type', TG_OP
    )::text);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS notify_update ON users;
CREATE TRIGGER notify_update AFTER UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE table_update_notify();

DROP TRIGGER IF EXISTS notify_insert ON users;
CREATE TRIGGER notify_insert AFTER INSERT ON users FOR EACH ROW EXECUTE PROCEDURE table_update_notify();

DROP TRIGGER IF EXISTS notify_delete ON users;
CREATE TRIGGER notify_delete AFTER DELETE ON users FOR EACH ROW EXECUTE PROCEDURE table_update_notify();
