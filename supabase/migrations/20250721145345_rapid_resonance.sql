-- ChatGPT Clone Database Schema
-- Run this file to set up your PostgreSQL database

-- Create database (run this separately if needed)
-- CREATE DATABASE chatgpt_clone;

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at);

-- Insert sample data (optional)
INSERT INTO chats (title) VALUES ('Welcome Chat');
INSERT INTO messages (chat_id, role, content) 
SELECT id, 'user', 'Hello! Can you help me with something?'
FROM chats WHERE title = 'Welcome Chat';
INSERT INTO messages (chat_id, role, content) 
SELECT id, 'assistant', 'Hello! I''d be happy to help you. What would you like to know or discuss?'
FROM chats WHERE title = 'Welcome Chat';