CREATE DATABASE demo_db;
SHOW DATABASES;
USE demo_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    email VARCHAR(100) UNIQUE,
    gender VARCHAR(20),
    job_title VARCHAR(100)
);

ALTER TABLE users AUTO_INCREMENT = 1;

TRUNCATE TABLE users;

SHOW tables;

DESCRIBE users;

select * from users;