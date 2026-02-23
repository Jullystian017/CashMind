-- Create a function to increment goal current_amount
create or replace function public.increment_goal_current_amount(goal_id uuid, inc_amount bigint)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.goals
  set current_amount = current_amount + inc_amount
  where id = goal_id;
end;
$$;
