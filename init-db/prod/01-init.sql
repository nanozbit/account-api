

-- Initialization script for PROD environment

USE app_prod;

-- Create info table
CREATE TABLE IF NOT EXISTS info (
  id INT PRIMARY KEY AUTO_INCREMENT,
  message VARCHAR(255) NOT NULL
);

-- Insert sample data for PROD
INSERT INTO info (message) VALUES ('Hello from PROD');
INSERT INTO info (message) VALUES ('Production environment is live!');