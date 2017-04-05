DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS druginfo;
DROP TABLE IF EXISTS fdainfo;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255)
);



CREATE TABLE druginfo (
  id SERIAL PRIMARY KEY,
  drug_name VARCHAR(255),
  rx_date VARCHAR(25),
  pickup_date VARCHAR(25),
  exp_date VARCHAR(25),
  prescribing_dr VARCHAR(255),
  dr_phone VARCHAR(25),
  users_email VARCHAR(255),
  users_id INTEGER

);

CREATE TABLE fdainfo (
  id SERIAL PRIMARY KEY,
  brand_name VARCHAR(255),
  openfda_url VARCHAR(255)

);
