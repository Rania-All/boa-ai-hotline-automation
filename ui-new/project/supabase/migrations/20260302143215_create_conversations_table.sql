/*
  # Create conversations table for chatbot history

  1. New Tables
    - `conversations`
      - `id` (uuid, primary key)
      - `question` (text) - User's question
      - `answer` (text) - Bot's response
      - `confidence` (numeric) - Confidence score (0-1)
      - `created_at` (timestamptz) - Timestamp of conversation
      - `session_id` (text) - Session identifier for grouping conversations
  
  2. Security
    - Enable RLS on `conversations` table
    - Add policy for public insert access (chatbot is public-facing)
    - Add policy for public read access to view history
*/

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  confidence numeric DEFAULT 0,
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public to insert conversations"
  ON conversations
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public to read conversations"
  ON conversations
  FOR SELECT
  TO anon
  USING (true);

CREATE INDEX idx_conversations_session ON conversations(session_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at DESC);