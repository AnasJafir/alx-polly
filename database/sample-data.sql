-- Sample data for testing the polling app
-- This should be run after the schema.sql file

-- Insert sample polls (these will be created by users, but here for testing)
INSERT INTO polls (id, title, description, question, poll_type, status, is_public, created_by) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Favorite Programming Language',
  'What is your preferred programming language for web development?',
  'Which programming language do you enjoy using most for web development?',
  'single_choice',
  'active',
  true,
  (SELECT id FROM profiles LIMIT 1)
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Best Framework for 2024',
  'Vote for the most promising web framework this year',
  'Which web framework do you think will dominate in 2024?',
  'single_choice',
  'active',
  true,
  (SELECT id FROM profiles LIMIT 1)
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Learning Priorities',
  'Help us understand what topics the community wants to learn',
  'What would you like to learn more about in the next 3 months?',
  'multiple_choice',
  'active',
  true,
  (SELECT id FROM profiles LIMIT 1)
);

-- Insert poll options for "Favorite Programming Language"
INSERT INTO poll_options (poll_id, text, description, order_index) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'JavaScript/TypeScript',
  'The most popular language for web development',
  1
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Python',
  'Great for backend and data science',
  2
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Go',
  'Fast, simple, and efficient',
  3
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Rust',
  'Memory safety and performance',
  4
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Other',
  'Let us know your preference',
  5
);

-- Insert poll options for "Best Framework for 2024"
INSERT INTO poll_options (poll_id, text, description, order_index) VALUES
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Next.js',
  'React framework with great developer experience',
  1
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Vue.js',
  'Progressive JavaScript framework',
  2
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Svelte',
  'Compile-time framework',
  3
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Angular',
  'Full-featured framework by Google',
  4
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Solid.js',
  'Reactive JavaScript library',
  5
);

-- Insert poll options for "Learning Priorities"
INSERT INTO poll_options (poll_id, text, description, order_index) VALUES
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Advanced React Patterns',
  'Hooks, context, and state management',
  1
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Backend Development',
  'Node.js, databases, and APIs',
  2
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'DevOps & Deployment',
  'CI/CD, Docker, and cloud platforms',
  3
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Testing & Quality',
  'Unit testing, integration testing, and TDD',
  4
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Performance Optimization',
  'Web vitals, caching, and optimization',
  5
);

-- Insert some sample votes (these would normally be created by users voting)
-- Note: You'll need to replace the voter_id with actual user IDs from your profiles table
INSERT INTO votes (poll_id, option_id, voter_id) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM poll_options WHERE poll_id = '550e8400-e29b-41d4-a716-446655440001' AND text = 'JavaScript/TypeScript'),
  (SELECT id FROM profiles LIMIT 1)
),
(
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM poll_options WHERE poll_id = '550e8400-e29b-41d4-a716-446655440001' AND text = 'Python'),
  (SELECT id FROM profiles LIMIT 1)
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM poll_options WHERE poll_id = '550e8400-e29b-41d4-a716-446655440002' AND text = 'Next.js'),
  (SELECT id FROM profiles LIMIT 1)
);

-- Insert sample poll shares
INSERT INTO poll_shares (poll_id, shared_by, share_type, share_url) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  (SELECT id FROM profiles LIMIT 1),
  'link',
  'https://yourdomain.com/polls/550e8400-e29b-41d4-a716-446655440001'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  (SELECT id FROM profiles LIMIT 1),
  'qr',
  'https://yourdomain.com/polls/550e8400-e29b-41d4-a716-446655440002'
);
