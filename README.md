# Smart Bookmark App

A production-ready Bookmark Manager built with Next.js 14+ (App Router), Supabase, and Tailwind CSS.

## Features

- **Authentication**: Google OAuth via Supabase Auth.
- **Bookmark Management**: Add, View, and Delete bookmarks.
- **Realtime**: Changes sync instantly across tabs/devices.
- **Security**: Row Level Security (RLS) ensures users only access their own data.
- **Responsive UI**: Modern, clean interface with dark mode support.

## Architecture

- **Frontend**: Next.js App Router (Server Components for initial data, Client Components for interactivity).
- **Backend/Database**: Supabase (PostgreSQL) with Realtime enabled.
- **Styling**: Tailwind CSS v4.

## Setup Instructions

### 1. Prerequisites

- Node.js 18+
- A Supabase Project

### 2. Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```
2. Fill in your Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Database Setup

Run the following SQL in your Supabase SQL Editor to create the table and policies:

```sql
-- Create the bookmarks table
create table bookmarks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table bookmarks enable row level security;

-- Create policies
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can create their own bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- Enable Realtime
alter publication supabase_realtime add table bookmarks;
```

### 4. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app.

## RLS Policies

Data security is handled at the database level using Postgres RLS:
- `SELECT`: Users can only see rows where `user_id` matches their auth UID.
- `INSERT`: Users can only insert rows where `user_id` matches their auth UID.
- `DELETE`: Users can only delete rows where `user_id` matches their auth UID.

## Realtime Implementation

Realtime updates are achieved using Supabase's `subscribe()` method on the client side (`src/components/BookmarkList.tsx`).
- The app listens for `INSERT`, `UPDATE`, and `DELETE` events on (`schema: public`, `table: bookmarks`).
- When an event occurs, the local state is updated immediately, and `router.refresh()` is called to re-validate server components if needed.

## Deployment on Vercel

1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel project settings.
4. Deploy!

## Notes & Solutions

- **Next.js & Supabase**: Used `@supabase/ssr` for modern cookie-based auth handling in Next.js App Router.
- **Tailwind v4**: Configured using the new CSS-first approach in `app/globals.css`.
- **Middleware**: Configured to refresh sessions and protect routes, ensuring smooth auth experience.
