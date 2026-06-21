-- ============================================================
-- YASHA Database Schema
-- Run this in Supabase → SQL Editor → New Query
-- ============================================================

-- Users table
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  referral_code text unique,
  referred_by uuid references users(id),
  payoneer_email text,
  wise_email text,
  role text default 'user' check (role in ('user', 'admin')),
  created_at timestamp with time zone default now()
);

-- Wallets table
create table if not exists wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade unique not null,
  available_balance numeric(12,2) default 0,
  pending_balance numeric(12,2) default 0,
  total_earned numeric(12,2) default 0
);

-- Cashback transactions
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  platform text not null check (platform in ('shopee', 'lazada', 'aliexpress')),
  order_id text,
  order_value numeric(12,2),
  commission_earned numeric(12,2),
  cashback_amount numeric(12,2),
  status text default 'pending' check (status in ('pending', 'confirmed', 'paid', 'rejected')),
  created_at timestamp with time zone default now(),
  confirmed_at timestamp with time zone
);

-- Withdrawal requests
create table if not exists withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade not null,
  amount numeric(12,2) not null check (amount >= 500),
  method text not null check (method in ('payoneer', 'wise')),
  status text default 'pending' check (status in ('pending', 'completed', 'rejected')),
  payout_reference text,
  requested_at timestamp with time zone default now(),
  completed_at timestamp with time zone
);

-- Affiliate link clicks
create table if not exists clicks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  platform text,
  product_id text,
  affiliate_url text,
  clicked_at timestamp with time zone default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table users enable row level security;
alter table wallets enable row level security;
alter table transactions enable row level security;
alter table withdrawals enable row level security;
alter table clicks enable row level security;

-- Users can read/update their own row
create policy "users_own" on users for all using (auth.uid() = id);

-- Wallets: own row only
create policy "wallets_own" on wallets for all using (auth.uid() = user_id);

-- Transactions: own rows only
create policy "tx_own" on transactions for select using (auth.uid() = user_id);

-- Withdrawals: own rows only
create policy "withdrawals_own" on withdrawals for select using (auth.uid() = user_id);

-- ============================================================
-- Helper RPC: add to pending balance atomically
-- ============================================================
create or replace function increment_pending(uid uuid, amount numeric)
returns void language plpgsql security definer as $$
begin
  update wallets set pending_balance = pending_balance + amount where user_id = uid;
end;
$$;
