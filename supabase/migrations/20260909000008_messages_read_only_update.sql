-- Fix: the "recipient marks a message read" UPDATE policy from migration
-- 0005 had `with check (sender_id = messages.sender_id)` -- in an RLS check
-- clause, an unqualified column and the same column qualified by the table
-- name both resolve to the NEW row (Postgres RLS has no OLD/NEW distinction
-- the way trigger bodies do), so that check is a tautology: it compares the
-- new row's sender_id to itself and always passes. As written, either
-- participant in a conversation could rewrite the OTHER person's message
-- body/sender_id/sent_at while "marking it read", not just flip read_at.
--
-- A trigger is the correct way to allow updating exactly one column under
-- RLS: pin every other column back to its old value regardless of what the
-- UPDATE statement asked for, so only read_at can actually change.
create or replace function public.messages_protect_columns()
returns trigger
language plpgsql
as $$
begin
  new.conversation_id := old.conversation_id;
  new.sender_id := old.sender_id;
  new.body := old.body;
  new.attachment_url := old.attachment_url;
  new.sent_at := old.sent_at;
  return new;
end;
$$;

create trigger messages_protect_columns_trigger
  before update on public.messages
  for each row execute function public.messages_protect_columns();

drop policy "recipient marks a message read" on public.messages;
create policy "recipient marks a message read" on public.messages
  for update using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id and (c.coach_id = auth.uid() or c.member_id = auth.uid())
    )
  ) with check (true); -- real protection is the trigger above, not this check
