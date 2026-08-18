# Hostel Management

Smart technology solutions for modern businesses — hostel management platforms, enterprise software and custom business systems built in Dhaka since 2019.

## Tech Stack

- **Frontend:** React, TypeScript, Tailwind CSS, TanStack Router + Start
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Build:** Vite

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Database Setup

Run the SQL in `supabase/full_database.sql` in your Supabase SQL Editor to create all tables, RLS policies, and seed data.

## Environment Variables

Copy `.env.example` to `.env` and fill in your Supabase credentials:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=your_publishable_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```
