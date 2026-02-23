-- Add goal_id to transactions table
alter table public.transactions 
add column goal_id uuid references public.goals(id) on delete set null;

create index transactions_goal_id_idx on public.transactions(goal_id);
