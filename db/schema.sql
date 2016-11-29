DROP TABLE IF EXISTS users;


CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_digest VARCHAR(255)
);

DROP TABLE IF EXISTS druginfo;

CREATE TABLE druginfo (
  brand_name VARCHAR(255),
  rx_date VARCHAR(10),
  refill INT,
  refill_date VARCHAR(10),
  prescribing_dr VARCHAR(255),
  expiration_date VARCHAR(10),
  quantity INT,
  no_of_pills INT,
  inst_no_tabs INT,
  inst_tabs_daily INT,
  users_email VARCHAR(255),
  users_id INT

)
