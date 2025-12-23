-- Initialization script for DEV environment

USE app_dev;

-- Create info table
CREATE TABLE IF NOT EXISTS info (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message VARCHAR(255) NOT NULL
);

-- Insert sample data for DEV
INSERT INTO info (message) VALUES ('Hello from DEV');
INSERT INTO info (message) VALUES ('Development environment is ready!');