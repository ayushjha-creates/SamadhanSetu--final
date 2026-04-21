-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  phone TEXT,
  birthdate TEXT,
  role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'cityofficial', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location JSONB NOT NULL,
  image_url TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'rejected')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  by TEXT DEFAULT 'anonymous',
  user_id UUID REFERENCES users(id),
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  message TEXT,
  anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reels table
CREATE TABLE IF NOT EXISTS reels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  user_id UUID REFERENCES users(id),
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reels ENABLE ROW LEVEL SECURITY;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_user_id ON reports(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_group_id ON chat_messages(group_id);

-- Insert demo accounts
INSERT INTO users (email, password, full_name, username, phone, birthdate, role)
VALUES 
  ('admin@samadhan.gov', '$2a$10$Cue8GjW4kzDpAQT/02QmyeWk0VsP4BGRVK5XN1MiQBz9JRd12/1xG', 'Admin User', 'admin', '1234567890', '1990-01-01', 'admin'),
  ('official@bhopal.gov', '$2a$10$Ri/SlqyGifsxKsC8znTxY.og1RqZ4YhXdPUG5Gr/NJkYXDt0o19xu', 'City Official', 'cityofficial', '9876543210', '1985-05-15', 'cityofficial')
ON CONFLICT (email) DO NOTHING;

SELECT 'Database setup complete!' as status;