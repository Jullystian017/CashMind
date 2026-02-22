-- Create budgets table
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  category text not null,
  "limit" bigint not null default 0,
  month_year text not null, -- format: YYYY-MM
  created_at timestamptz not null default now(),
  unique(user_id, category, month_year)
);

create index budgets_user_id_idx on public.budgets(user_id);
create index budgets_month_year_idx on public.budgets(month_year);

alter table public.budgets enable row level security;

create policy "Users can manage own budgets"
  on public.budgets for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
