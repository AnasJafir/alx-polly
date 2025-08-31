# Database Setup Guide

This guide will help you set up the Supabase database schema for the ALX Polling app.

## Prerequisites

1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. Access to your Supabase SQL editor

## Setup Steps

### Step 1: Access SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Create Database Schema

1. Copy the contents of `schema.sql`
2. Paste it into the SQL editor
3. Click **Run** to execute the schema creation

**Important Notes:**
- The schema includes Row Level Security (RLS) policies
- Custom types and functions are created automatically
- Triggers for `updated_at` timestamps are set up
- The `handle_new_user()` function automatically creates profiles for new users

### Step 3: Verify Schema Creation

After running the schema, you should see:
- 5 tables: `profiles`, `polls`, `poll_options`, `votes`, `poll_shares`
- Custom types: `poll_status`, `poll_type`
- Functions: `update_updated_at_column()`, `get_poll_results()`
- Triggers and indexes

### Step 4: Insert Sample Data (Optional)

1. Copy the contents of `sample-data.sql`
2. Paste it into a new SQL query
3. Click **Run** to insert sample polls and options

**Note:** Sample data requires at least one user profile to exist. If you haven't created any users yet, you can skip this step or modify the user IDs.

## Database Structure

### Tables Overview

#### `profiles`
- Extends Supabase `auth.users`
- Stores user profile information
- Automatically created when users sign up

#### `polls`
- Main poll information
- Supports different poll types (single choice, multiple choice, ranking)
- Configurable voting rules and expiration

#### `poll_options`
- Individual options for each poll
- Ordered by `order_index` field
- Supports descriptions for each option

#### `votes`
- Records user votes
- Prevents duplicate votes per user per option
- Supports multiple votes per poll if configured

#### `poll_shares`
- Tracks how polls are shared
- Supports different share types (link, QR, embed)
- Useful for analytics

### Key Features

#### Row Level Security (RLS)
- **Profiles**: Users can only access their own profile
- **Polls**: Public polls are viewable by everyone, private polls only by creators
- **Votes**: Users can only manage their own votes
- **Options**: Viewable based on poll visibility

#### Automatic Timestamps
- `created_at` and `updated_at` are automatically managed
- Triggers update `updated_at` on every record modification

#### Data Integrity
- Foreign key constraints ensure referential integrity
- Cascade deletes clean up related data
- Unique constraints prevent duplicate votes

#### Performance
- Indexes on frequently queried fields
- Optimized queries for poll results
- Efficient filtering and pagination support

## Custom Functions

### `get_poll_results(poll_uuid)`
Returns formatted poll results with vote counts and percentages:
```sql
SELECT * FROM get_poll_results('poll-uuid-here');
```

### `handle_new_user()`
Automatically creates a profile when a new user signs up.

## Environment Variables

Ensure these are set in your `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Testing the Setup

1. **Create a user account** through your app
2. **Check the profiles table** - should have a new record
3. **Create a poll** through your app
4. **Verify data** appears in `polls` and `poll_options` tables
5. **Test voting** functionality
6. **Check results** using the `get_poll_results` function

## Troubleshooting

### Common Issues

#### "relation does not exist"
- Ensure you ran the schema.sql file completely
- Check that all tables were created successfully

#### "permission denied"
- Verify RLS policies are in place
- Check that the user is authenticated
- Ensure proper user context in queries

#### "function does not exist"
- The `get_poll_results` function should be created automatically
- Re-run the schema.sql if missing

### Reset Database

If you need to start over:
```sql
-- Drop all tables (WARNING: This will delete all data)
DROP TABLE IF EXISTS poll_shares, votes, poll_options, polls, profiles CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS poll_status, poll_type CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column(), get_poll_results(UUID), handle_new_user() CASCADE;

-- Re-run schema.sql
```

## Next Steps

After setting up the database:

1. **Update your app** to use the new database functions
2. **Test CRUD operations** for polls and votes
3. **Implement real-time updates** using Supabase subscriptions
4. **Add analytics** using the poll_shares table
5. **Optimize queries** based on your usage patterns

## Support

If you encounter issues:
1. Check the Supabase logs in your dashboard
2. Verify RLS policies are working correctly
3. Test queries directly in the SQL editor
4. Check the browser console for client-side errors
