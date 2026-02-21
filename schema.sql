-- Profiles table to extend auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create a trigger to automatically create a profile entry when a new user signs up
-- This is a standard Supabase/PostgREST pattern
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users is removed due to permissions. 
-- Profile creation will be handled in application logic or via a separate admin process.

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_ne TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Posts table
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug_en TEXT UNIQUE NOT NULL,
    slug_ne TEXT UNIQUE,
    title_en TEXT NOT NULL,
    title_ne TEXT,
    excerpt_en TEXT,
    excerpt_ne TEXT,
    content_en TEXT,
    content_ne TEXT,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    category_id UUID REFERENCES public.categories(id),
    author_id UUID REFERENCES public.profiles(id),
    featured_image TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Categories: Everyone can read
CREATE POLICY "Enable read access for all users" ON "public"."categories"
AS PERMISSIVE FOR SELECT
TO public
USING (true);

-- Posts: Everyone can read PUBLISHED posts
CREATE POLICY "Enable read access for published posts" ON "public"."posts"
AS PERMISSIVE FOR SELECT
TO public
USING (status = 'published');

-- Posts: Authenticated users (Admin/Editor) can read ALL posts
CREATE POLICY "Enable read access for authenticated users" ON "public"."posts"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (true);

-- Posts: Authenticated users can INSERT/UPDATE/DELETE (Simplistic for now)
CREATE POLICY "Enable insert for authenticated users" ON "public"."posts"
AS PERMISSIVE FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users" ON "public"."posts"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Enable delete for authenticated users" ON "public"."posts"
AS PERMISSIVE FOR DELETE
TO authenticated
USING (true);

-- Profiles: Users can read their own profile
CREATE POLICY "Users can read own profile" ON "public"."profiles"
AS PERMISSIVE FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Profiles: Users can update their own profile
CREATE POLICY "Users can update own profile" ON "public"."profiles"
AS PERMISSIVE FOR UPDATE
TO authenticated
USING (auth.uid() = id);
