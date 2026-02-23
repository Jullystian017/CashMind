-- Create handle_updated_at function if it doesn't exist
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Add updated_at to goals table if it doesn't exist
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='goals' and column_name='updated_at') then
    alter table public.goals add column updated_at timestamptz not null default now();
  end if;
end $$;

-- Enable RLS (already in initial_schema but harmless to repeat or ensures it's on)
alter table public.goals enable row level security;

-- Policies (using do block to avoid error if exists, checking both common naming patterns)
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where tablename = 'goals' 
    and (policyname = 'Users can manage own goals' or policyname = 'Users can manage their own goals')
  ) then
    create policy "Users can manage own goals"
      on public.goals
      for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;


-- Drop existing trigger if it exists to avoid error, then create it
drop trigger if exists set_goals_updated_at on public.goals;
create trigger set_goals_updated_at
  before update on public.goals
  for each row
  execute function public.handle_updated_at();

-- Also ensure profiles table uses handle_updated_at since it was missing
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();


