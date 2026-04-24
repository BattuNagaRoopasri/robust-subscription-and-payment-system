-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enum types
create type user_role as enum ('subscriber', 'admin');
create type subscription_status as enum ('active', 'inactive', 'past_due', 'canceled');
create type draw_status as enum ('pending', 'simulated', 'published');
create type match_type as enum ('5_match', '4_match', '3_match');
create type verification_status as enum ('pending_upload', 'pending_review', 'approved', 'rejected');
create type payment_status as enum ('pending', 'paid');

-- Charities Table
create table public.charities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  image_url text,
  is_featured boolean default false,
  total_raised decimal(12,2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Users Table
create table public.users (
  id uuid primary key references auth.users on delete cascade,
  email text not null unique,
  full_name text,
  role user_role default 'subscriber'::user_role,
  subscription_status subscription_status default 'inactive'::subscription_status,
  stripe_customer_id text,
  charity_id uuid references public.charities on delete set null,
  charity_contribution_percentage decimal(5,2) default 10.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Scores Table
create table public.scores (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.users on delete cascade,
  score integer not null check (score >= 1 and score <= 45),
  date_played date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, date_played) -- Only one score entry permitted per date
);

-- Draws Table
create table public.draws (
  id uuid primary key default uuid_generate_v4(),
  month text not null unique, -- e.g. '2023-10'
  status draw_status default 'pending'::draw_status,
  winning_numbers integer[],
  total_prize_pool decimal(12,2) default 0.00,
  jackpot_rollover decimal(12,2) default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Draw Entries (Snapshot of user scores for a specific draw)
create table public.draw_entries (
  id uuid primary key default uuid_generate_v4(),
  draw_id uuid not null references public.draws on delete cascade,
  user_id uuid not null references public.users on delete cascade,
  scores integer[] not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (draw_id, user_id)
);

-- Winners Table
create table public.winners (
  id uuid primary key default uuid_generate_v4(),
  draw_id uuid not null references public.draws on delete cascade,
  user_id uuid not null references public.users on delete cascade,
  match_type match_type not null,
  prize_amount decimal(12,2) not null,
  verification_status verification_status default 'pending_upload'::verification_status,
  proof_image_url text,
  payment_status payment_status default 'pending'::payment_status,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)

-- Users: Users can read/update their own profile. Admins can read/update all.
alter table public.users enable row level security;

create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

-- Scores: Users can read/insert/update/delete their own scores.
alter table public.scores enable row level security;

create policy "Users can manage their own scores" on public.scores
  for all using (auth.uid() = user_id);

-- Charities: Anyone can read charities. Admins can insert/update/delete.
alter table public.charities enable row level security;

create policy "Anyone can view charities" on public.charities
  for select using (true);

-- Draws: Anyone can view published draws.
alter table public.draws enable row level security;

create policy "Anyone can view published draws" on public.draws
  for select using (status = 'published');

-- Winners: Users can view their own winning records. Anyone can view published winners (could be public).
alter table public.winners enable row level security;

create policy "Users can view their own wins" on public.winners
  for select using (auth.uid() = user_id);

create policy "Users can update their own win proof" on public.winners
  for update using (auth.uid() = user_id);
