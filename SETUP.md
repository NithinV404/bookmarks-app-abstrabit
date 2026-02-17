# Bookmarks App Setup Guide

A full-stack bookmarks application built with Next.js, Supabase, and Google OAuth authentication.

## Features

- 🔐 Google OAuth authentication via NextAuth.js
- 📚 Create, read, update, and delete bookmarks
- 🔒 Private/public bookmark visibility
- 🎨 Beautiful UI with Tailwind CSS
- ⚡ Real-time updates with SWR
- 🗄️ Supabase PostgreSQL database

## Prerequisites

- Node.js 18+ installed
- A Supabase account
- A Google Cloud Console account

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is created, go to **Project Settings** → **API**
3. Copy your **Project URL** and **anon public** key
4. Go to the **SQL Editor** in your Supabase dashboard
5. Run the following SQL to create the bookmarks table:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  user_email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_email for faster queries
CREATE INDEX idx_bookmarks_user_email ON bookmarks(user_email);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their own bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON bookmarks
  FOR SELECT
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create policy to allow users to insert their own bookmarks
CREATE POLICY "Users can insert their own bookmarks"
  ON bookmarks
  FOR INSERT
  WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create policy to allow users to update their own bookmarks
CREATE POLICY "Users can update their own bookmarks"
  ON bookmarks
  FOR UPDATE
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Create policy to allow users to delete their own bookmarks
CREATE POLICY "Users can delete their own bookmarks"
  ON bookmarks
  FOR DELETE
  USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');
```

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (for development)
   - `https://your-production-domain.com/api/auth/callback/google` (for production)
7. Copy your **Client ID** and **Client Secret**

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in the values in `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth Configuration  
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key_here
```

3. Generate a NEXTAUTH_SECRET:

```bash
openssl rand -base64 32
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Click "Sign in with Google" to authenticate
2. Add bookmarks with title, URL, and privacy setting
3. Edit or delete existing bookmarks
4. Toggle the "Private" checkbox to make bookmarks visible only to you

## Project Structure

```
bookmarks-app-abstrabit/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth configuration
│   │   └── bookmarks/                   # Bookmark API routes
│   ├── components/
│   │   ├── AddBookmarkForm.tsx         # Form to add bookmarks
│   │   ├── BookmarksList.tsx           # Display bookmarks grid
│   │   └── SignOutButton.tsx           # Logout button
│   ├── dashboard/page.tsx              # Main app page
│   ├── login/page.tsx                  # Login page
│   └── layout.tsx                      # Root layout
├── src/lib/supabase.ts                 # Supabase client setup
└── .env.local                          # Environment variables
```

## Technologies Used

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type safety
- **Supabase** - Backend as a Service (PostgreSQL database)
- **NextAuth.js** - Authentication
- **SWR** - Data fetching and caching
- **Tailwind CSS** - Styling
- **Google OAuth** - User authentication

## Troubleshooting

### "Unauthorized" errors
- Make sure you're signed in
- Check that your Supabase RLS policies are correctly set up

### OAuth redirect errors
- Verify your redirect URIs in Google Cloud Console match your app URL
- Ensure NEXTAUTH_URL is set correctly

### Database connection issues
- Confirm your Supabase URL and anon key are correct
- Check that your Supabase project is active

## Deployment

For production deployment (e.g., on Vercel):

1. Add environment variables in your hosting platform
2. Update the Google OAuth authorized redirect URI
3. Update the NEXTAUTH_URL to your production domain

## License

MIT
