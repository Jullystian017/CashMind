-- Split Bills
create table public.split_bills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  total_amount bigint not null default 0,
  payer text not null default 'you' check (payer in ('you', 'friend')),
  status text not null default 'active' check (status in ('active', 'settled')),
  created_at timestamptz not null default now()
);

create index split_bills_user_id_idx on public.split_bills(user_id);

alter table public.split_bills enable row level security;

create policy "Users can manage own split bills"
  on public.split_bills for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Split Participants
create table public.split_participants (
  id uuid primary key default gen_random_uuid(),
  split_bill_id uuid not null references public.split_bills(id) on delete cascade,
  name text not null default '',
  amount bigint not null default 0,
  is_paid boolean not null default false,
  created_at timestamptz not null default now()
);

create index split_participants_bill_id_idx on public.split_participants(split_bill_id);

alter table public.split_participants enable row level security;

-- Participants inherit bill ownership for RLS
create policy "Users can view own bill participants"
  on public.split_participants for select
  using (
    exists (
      select 1 from public.split_bills
      where split_bills.id = split_participants.split_bill_id
        and split_bills.user_id = auth.uid()
    )
  );

create policy "Users can insert own bill participants"
  on public.split_participants for insert
  with check (
    exists (
      select 1 from public.split_bills
      where split_bills.id = split_participants.split_bill_id
        and split_bills.user_id = auth.uid()
    )
  );

create policy "Users can update own bill participants"
  on public.split_participants for update
  using (
    exists (
      select 1 from public.split_bills
      where split_bills.id = split_participants.split_bill_id
        and split_bills.user_id = auth.uid()
    )
  );

create policy "Users can delete own bill participants"
  on public.split_participants for delete
  using (
    exists (
      select 1 from public.split_bills
      where split_bills.id = split_participants.split_bill_id
        and split_bills.user_id = auth.uid()
    )
  );
