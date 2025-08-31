-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE poll_status AS ENUM ('active', 'closed', 'draft');
CREATE TYPE poll_type AS ENUM ('single_choice', 'multiple_choice', 'ranking');

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create polls table
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  question TEXT NOT NULL,
  poll_type poll_type DEFAULT 'single_choice',
  status poll_status DEFAULT 'active',
  is_public BOOLEAN DEFAULT true,
  allow_multiple_votes BOOLEAN DEFAULT false,
  max_votes_per_option INTEGER DEFAULT 1,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll_options table
CREATE TABLE poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  text TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
  voter_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, option_id, voter_id)
);

-- Create poll_shares table for tracking shared polls
CREATE TABLE poll_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  share_type TEXT DEFAULT 'link', -- 'link', 'qr', 'embed'
  share_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_polls_created_by ON polls(created_by);
CREATE INDEX idx_polls_status ON polls(status);
CREATE INDEX idx_polls_created_at ON polls(created_at);
CREATE INDEX idx_polls_is_public ON polls(is_public);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);
CREATE INDEX idx_votes_voter_id ON votes(voter_id);
CREATE INDEX idx_poll_shares_poll_id ON poll_shares(poll_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON polls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for polls
CREATE POLICY "Anyone can view public polls" ON polls
  FOR SELECT USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Users can create polls" ON polls
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own polls" ON polls
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own polls" ON polls
  FOR DELETE USING (auth.uid() = created_by);

-- RLS Policies for poll_options
CREATE POLICY "Anyone can view poll options for public polls" ON poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND (polls.is_public = true OR polls.created_by = auth.uid())
    )
  );

CREATE POLICY "Poll creators can manage options" ON poll_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.created_by = auth.uid()
    )
  );

-- RLS Policies for votes
CREATE POLICY "Anyone can view votes for public polls" ON votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = votes.poll_id 
      AND (polls.is_public = true OR polls.created_by = auth.uid())
    )
  );

CREATE POLICY "Authenticated users can vote" ON votes
  FOR INSERT WITH CHECK (auth.uid() = voter_id);

CREATE POLICY "Users can update their own votes" ON votes
  FOR UPDATE USING (auth.uid() = voter_id);

CREATE POLICY "Users can delete their own votes" ON votes
  FOR DELETE USING (auth.uid() = voter_id);

-- RLS Policies for poll_shares
CREATE POLICY "Anyone can view poll shares" ON poll_shares
  FOR SELECT USING (true);

CREATE POLICY "Poll creators can manage shares" ON poll_shares
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_shares.poll_id 
      AND polls.created_by = auth.uid()
    )
  );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to call handle_new_user when a user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to get poll results
CREATE OR REPLACE FUNCTION get_poll_results(poll_uuid UUID)
RETURNS TABLE (
  option_id UUID,
  option_text TEXT,
  vote_count BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    po.id,
    po.text,
    COALESCE(v.vote_count, 0) as vote_count,
    CASE 
      WHEN (SELECT COUNT(*) FROM votes WHERE poll_id = poll_uuid) = 0 THEN 0
      ELSE ROUND(
        (COALESCE(v.vote_count, 0)::NUMERIC / 
         (SELECT COUNT(*) FROM votes WHERE poll_id = poll_uuid)::NUMERIC) * 100, 2
      )
    END as percentage
  FROM poll_options po
  LEFT JOIN (
    SELECT option_id, COUNT(*) as vote_count
    FROM votes
    WHERE poll_id = poll_uuid
    GROUP BY option_id
  ) v ON po.id = v.option_id
  WHERE po.poll_id = poll_uuid
  ORDER BY po.order_index, po.created_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
