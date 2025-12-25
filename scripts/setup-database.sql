-- Create the database
CREATE DATABASE IF NOT EXISTS email_review_assistant;

USE email_review_assistant;

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    technical_knowledge INT NOT NULL CHECK (technical_knowledge BETWEEN 1 AND 5),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert some sample data (optional)
INSERT INTO clients (id, name, technical_knowledge, description) VALUES
('sample-1', 'John Smith', 2, 'Non-technical manager who needs simple explanations'),
('sample-2', 'Sarah Johnson', 4, 'IT professional with good technical understanding'),
('sample-3', 'Mike Chen', 5, 'Senior developer with advanced technical expertise');
