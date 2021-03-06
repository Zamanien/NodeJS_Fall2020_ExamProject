
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

--Create table inside DBUsers for storing refreshTokens
CREATE TABLE refreshTokens ( 
  token CHAR(255) UNIQUE,
  id int(64),
  FOREIGN KEY (id) REFERENCES users(id)
);

--Insert Test data if wanted
INSERT INTO users (id, username, email, password) VALUES
(1, 'testUser1', 'test1@gmail.com', '123123123'),
(2, 'testUser2', 'test2@gmail.com', '321321321');


-- Display test data
select * from users;


-- Create new user - avoid using root -- 
CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';

-- Grant privileges. (Don't grant all privileges). In this case; INSERT, UPDATE, DELETE, SELECT --
GRANT INSERT ON database_name TO 'newuser'@'localhost':

-- Revoke privileges --
REVOKE INSERT ON database_name FROM 'newuser'@'localhost':

-- Flush privileges -- 
FLUSH PRIVILEGES; 


