-- Fix existing users who don't have profiles
-- Run this after running the main schema.sql

-- Insert profiles for existing auth.users who don't have profiles yet
INSERT INTO profiles (id, email, full_name)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', '')
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE p.id IS NULL;

-- Verify the fix
SELECT 
  au.id,
  au.email,
  p.id as profile_id,
  p.email as profile_email
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
