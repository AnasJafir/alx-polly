# Authentication Setup Guide

This guide will help you set up Supabase authentication for your ALX Polling app.

## Prerequisites

1. A Supabase account and project
2. Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Create a new project
3. Wait for the project to be set up

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - Anon (public) key

## Step 3: Set Environment Variables

Create a `.env.local` file in your project root with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Configure Authentication

1. In your Supabase dashboard, go to Authentication > Settings
2. Configure your site URL (e.g., `http://localhost:3000` for development)
3. Add redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/auth/login`
   - `http://localhost:3000/auth/register`

## Step 5: Enable Email Authentication

1. Go to Authentication > Providers
2. Ensure Email provider is enabled
3. Configure email templates if desired

## Step 6: Test the Setup

1. Run `npm run dev`
2. Navigate to `/auth/register` to create an account
3. Check your email for confirmation
4. Sign in at `/auth/login`

## Features

- ✅ User registration with email confirmation
- ✅ User login/logout
- ✅ Protected routes
- ✅ Authentication context
- ✅ Automatic session management
- ✅ Middleware for route protection

## Protected Routes

The following routes require authentication:
- `/polls/create` - Create new polls

## Components

- `AuthProvider` - Provides authentication context
- `ProtectedRoute` - Wraps protected content
- `LoginForm` - User login form
- `RegisterForm` - User registration form
- `Navigation` - Updated with auth status

## Troubleshooting

- Ensure environment variables are set correctly
- Check Supabase project settings
- Verify email provider is enabled
- Check browser console for errors
