CREATE TABLE composition_versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  composition_id INT NOT NULL,
  version INT NOT NULL,
  changes JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(36) NOT NULL,
  FOREIGN KEY (composition_id) REFERENCES compositions(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);