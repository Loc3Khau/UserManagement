USE quanlyuserpython;

CREATE TABLE Users (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(100) NOT NULL,
  email           VARCHAR(150) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  date_of_birth   DATE,
  gender          ENUM('nam', 'nữ'),
  address         VARCHAR(255),
  phone_number    VARCHAR(15),
  avatar_url      VARCHAR(255),
  role            ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  status          ENUM('active', 'locked') NOT NULL DEFAULT 'active',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);