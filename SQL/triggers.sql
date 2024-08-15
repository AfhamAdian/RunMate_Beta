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



---------- 2 ----------
CREATE OR REPLACE FUNCTION insert_into_tracks()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.approval_status = 'approve' AND OLD.approval_status = 'pending' THEN
        INSERT INTO tracks (track_id,track_name, track_data, track_duration, track_distance)
        VALUES ( COALESCE((SELECT MAX(track_id) FROM tracks), 0) + 1 ,NEW.approval_track_name, NEW.approval_track_data, NEW.approval_track_duration, NEW.approval_track_distance);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER approval_status_change
BEFORE UPDATE ON approval_list
FOR EACH ROW
WHEN (OLD.approval_status IS DISTINCT FROM NEW.approval_status)
EXECUTE FUNCTION insert_into_tracks();