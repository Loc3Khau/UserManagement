USE quanlyuserpython;

CREATE TABLE account_activity_logs (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  target_user_id  INT NOT NULL,
  admin_id        INT NOT NULL,
  action          ENUM('lock', 'unlock') NOT NULL,
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (target_user_id) REFERENCES accounts(id),
  FOREIGN KEY (admin_id) REFERENCES accounts(id)
);