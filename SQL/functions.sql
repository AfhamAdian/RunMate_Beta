--function for inserting user
CREATE OR REPLACE FUNCTION insert_user(
    p_user_name VARCHAR,
    p_user_email VARCHAR,
    p_user_password VARCHAR,
    p_user_phone INT
)
RETURNS INT AS $$
DECLARE
    new_user_id INT;
BEGIN
    -- Generate a new user ID
    SELECT COALESCE(MAX(user_id), 0) + 1 INTO new_user_id FROM users;

    -- Insert the user into the users table with hashed password
    INSERT INTO users (user_id, user_name, user_email, user_password, point_id, record_id, user_phone)
    VALUES (
        new_user_id,
        p_user_name,
        p_user_email,
		p_user_password,
        NULL,
        NULL,
		p_user_phone
    );

    -- Return the new user ID
    RETURN 1;
EXCEPTION
    WHEN OTHERS THEN
        -- Handle exceptions
        RAISE NOTICE 'An error occurred: %', SQLERRM;
        RETURN 2;
END;
$$ LANGUAGE plpgsql;