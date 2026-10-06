create type public.app_role as enum ('admin','user');
create table public.user_roles (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade not null, role app_role not null, unique(user_id, role));
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "own roles readable" on public.user_roles for select to authenticated using (auth.uid() = user_id);

create or replace function public.has_role(_user_id uuid, _role app_role) returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.grant_owner_admin() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if lower(new.email) = 'souov.hasan373@gmail.com' then
    insert into public.user_roles(user_id, role) values (new.id, 'admin') on conflict do nothing;
  end if;
  return new;
end $$;
create trigger on_auth_user_created_admin after insert on auth.users for each row execute function public.grant_owner_admin();

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 160),
  category text not null default 'General',
  excerpt text not null default '',
  content text not null default '',
  cover_url text,
  pdf_url text,
  pdf_name text,
  author_id uuid,
  created_at timestamptz not null default now()
);
grant select on public.blog_posts to anon, authenticated;
grant insert, update, delete on public.blog_posts to authenticated;
grant all on public.blog_posts to service_role;
alter table public.blog_posts enable row level security;
create policy "posts public read" on public.blog_posts for select to anon, authenticated using (true);
create policy "admin insert posts" on public.blog_posts for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admin update posts" on public.blog_posts for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin delete posts" on public.blog_posts for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.blog_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  author_name text not null check (char_length(author_name) between 1 and 60),
  body text not null check (char_length(body) between 1 and 1000),
  created_at timestamptz not null default now()
);
grant select, insert on public.blog_comments to anon, authenticated;
grant delete on public.blog_comments to authenticated;
grant all on public.blog_comments to service_role;
alter table public.blog_comments enable row level security;
create policy "comments public read" on public.blog_comments for select to anon, authenticated using (true);
create policy "anyone can comment" on public.blog_comments for insert to anon, authenticated with check (true);
create policy "admin delete comments" on public.blog_comments for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.blog_reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  kind text not null check (kind in ('like','love','insightful','fire')),
  visitor_id text not null check (char_length(visitor_id) between 8 and 64),
  created_at timestamptz not null default now(),
  unique(post_id, kind, visitor_id)
);
grant select, insert on public.blog_reactions to anon, authenticated;
grant all on public.blog_reactions to service_role;
alter table public.blog_reactions enable row level security;
create policy "reactions public read" on public.blog_reactions for select to anon, authenticated using (true);
create policy "anyone can react" on public.blog_reactions for insert to anon, authenticated with check (true);

create policy "blog media public read" on storage.objects for select using (bucket_id = 'blog-media');
create policy "admin upload blog media" on storage.objects for insert to authenticated with check (bucket_id = 'blog-media' and public.has_role(auth.uid(),'admin'));
create policy "admin delete blog media" on storage.objects for delete to authenticated using (bucket_id = 'blog-media' and public.has_role(auth.uid(),'admin'));

insert into public.blog_posts (title, category, excerpt, content) values (
 'Why I am learning system design as a student',
 'System Design',
 'Notes on why I care about what happens beneath the interface — and how I am approaching it step by step.',
 E'Most of my early projects worked fine for one user on one laptop. The interesting questions started when I asked: what if a thousand people used this at once?\n\nThat question pulled me toward system design — caching, databases, queues, and the trade-offs between them. I am still a student, so I am learning by building small projects and breaking them on purpose.\n\nIn upcoming posts I will share what I learn along the way: diagrams, mistakes, and the small wins.'
);