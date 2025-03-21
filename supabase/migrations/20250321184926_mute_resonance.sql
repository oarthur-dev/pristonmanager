/*
  # Initial Schema Setup for Priston Tale Panel

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `game_character_id` (text, for MSSQL reference)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `clans`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `leader_id` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `clan_members`
      - `clan_id` (uuid, references clans)
      - `profile_id` (uuid, references profiles)
      - `role` (text)
      - `joined_at` (timestamp)

    - `support_tickets`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  game_character_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read any profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Clans table
CREATE TABLE IF NOT EXISTS clans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  leader_id uuid REFERENCES profiles NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read clans"
  ON clans
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clan leader can update clan"
  ON clans
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = leader_id);

-- Clan members table
CREATE TABLE IF NOT EXISTS clan_members (
  clan_id uuid REFERENCES clans ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (clan_id, profile_id)
);

ALTER TABLE clan_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read clan members"
  ON clan_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Clan leader can manage members"
  ON clan_members
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM clans
      WHERE id = clan_members.clan_id
      AND leader_id = auth.uid()
    )
  );

-- Support tickets table
CREATE TABLE IF NOT EXISTS support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own tickets"
  ON support_tickets
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can create tickets"
  ON support_tickets
  FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_clans_updated_at
  BEFORE UPDATE ON clans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();