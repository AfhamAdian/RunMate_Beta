CREATE OR REPLACE FUNCTION after_insert_user()
RETURNS TRIGGER AS $$
DECLARE
    new_point_id INT;
BEGIN
    SELECT COALESCE(MAX(point_id), 0) + 1 INTO new_point_id FROM points;

    INSERT INTO points (point_id, point_track_count, point_streak, point_distance)
    VALUES (new_point_id, NULL, NULL, NULL); 

    UPDATE users
    SET point_id = new_point_id
    WHERE user_id = NEW.user_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_insert_user
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION after_insert_user();