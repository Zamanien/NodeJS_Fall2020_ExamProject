
-- Create & use database if doesn't exit
DROP DATABASE IF EXISTS DBUsers;
CREATE DATABASE DBUsers; 
USE DBUsers;

-- Create table inside DB - DBUsers
CREATE TABLE users (
    id int (10) NOT NULL AUTO_INCREMENT, 
    username varchar (64) UNIQUE, 
    password CHAR(255),
    email varchar(64),
    PRIMARY KEY (id)
);

--Insert Test data if wanted
INSERT INTO users (id, username, email, password) VALUES
(1, 'testUser1', 'test1@gmail.com', '123123123'),
(2, 'testUser2', 'test2@gmail.com', '321321321');


-- Display test data
select * from users;
