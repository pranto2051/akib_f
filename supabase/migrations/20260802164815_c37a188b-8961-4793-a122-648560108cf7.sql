insert into public.profiles (id, name, email, is_active)
values ('04748d7d-5efc-48ae-9c4c-47de3f693604', 'Demo Admin', 'admin@hostelmanagement.demo', true)
on conflict (id) do nothing;

insert into public.user_roles (user_id, role)
values ('04748d7d-5efc-48ae-9c4c-47de3f693604', 'super_admin')
on conflict (user_id, role) do nothing;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email)
  on conflict (id) do nothing;
  return new;
end; $$;