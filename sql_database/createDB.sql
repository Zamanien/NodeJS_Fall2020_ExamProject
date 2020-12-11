
-- Create & use database if doesn't exit
DROP DATABASE IF EXISTS DBUsers;
CREATE DATABASE Users CHARACTER SET utf8 COLLATE utf8_general_ci;
USE DBUsers;

-- Create table inside DB - DBUsers
CREATE TABLE users (
    id int (10) NOT NULL AUTO_INCREMENT, 
    usernamme varchar (64) UNIQUE, 
    password CHAR(64),
    email varchar(64),
    PRIMARY KEY (id)
)

INSERT INTO users (id, username, email, password) VALUES
(1, 'testUser1', 'test1@gmail.com', '123123123'),
(2, 'testUser2', 'test2@gmail.com', '321321321');


select * from users;
