create or replace function public.block_non_owner_signup()
returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  if lower(new.email) <> 'sourov.hasan373e@gmail.com' then
    raise exception 'Sign-ups are closed. Only the site owner can have an account.';
  end if;
  return new;
end $$;
create or replace function public.grant_owner_admin()
returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  if lower(new.email) = 'sourov.hasan373e@gmail.com' then
    insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
drop trigger if exists on_auth_user_created_admin on auth.users;
create trigger on_auth_user_block_signup before insert on auth.users
for each row execute function public.block_non_owner_signup();
create trigger on_auth_user_created_admin after insert on auth.users
for each row execute function public.grant_owner_admin();