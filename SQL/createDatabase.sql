create table tracks (
    track_id INT PRIMARY KEY,
    track_name VARCHAR(255),
    track_data JSONB NOT NULL,
    track_duration INT,
    track_distance INT
);

create table products (
    product_id INT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_redeem_points INT NOT NULL,
    product_description TEXT,
    product_image VARCHAR(255)
);


create table achievement_list(
    achievement_id INT PRIMARY KEY,
    acheivement_criteria_track_count INT,
    achievement_criteria_streak INT,
    achievement_criteria_distance INT,
    achievement_name VARCHAR(255),
    achievement_description TEXT,
    achievement_image VARCHAR(255)
);

create table records (
    record_id INT PRIMARY KEY,
    record_date TIMESTAMP default CURRENT_TIMESTAMP,
    record_distance INT,
    record_duration INT,
    record_track_data JSONB NOT NULL
);

create table points(
    point_id INT PRIMARY KEY,
    point_track_count INT,
    point_streak INT,
    point_distance INT
);

create table users(
    user_id INT PRIMARY KEY,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_password VARCHAR(255),
    point_id INT REFERENCES points(point_id) ON DELETE CASCADE,
    record_id INT REFERENCES records(record_id) ON DELETE CASCADE
);



create table approval_list(
    approval_id INT PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    approval_track_name VARCHAR(255),
    approval_track_data JSONB NOT NULL,
    approval_track_duration INT,
    approval_track_distance INT,
	approval_request_time TIMESTAMP default CURRENT_TIMESTAMP,
	approval_status VARCHAR(255)
);


create table user_achievement(
    user_achievement_id INT PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    achievement_id INT REFERENCES achievement_list(achievement_id) ON DELETE CASCADE,
    user_achievement_date TIMESTAMP default CURRENT_TIMESTAMP
);


create table user_product(
    user_product_id INT PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id)  ON DELETE CASCADE,
    user_product_date TIMESTAMP default CURRENT_TIMESTAMP
);


ALTER TABLE users
ADD COLUMN first_name VARCHAR(255),
ADD COLUMN last_name VARCHAR(255);

ALTER TABLE users
ADD COLUMN user_phone INT;

-- Add UNIQUE constraint to user_email column
ALTER TABLE users
ADD CONSTRAINT unique_user_email UNIQUE (user_email);


