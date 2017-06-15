-- This file was automatically generated from the `TUTORIAL.md` which
-- contains a complete explanation of how this schema works and why certain
-- decisions were made. If you are looking for a comprehensive tutorial,
-- definetly check it out as this file is a little tough to read.
--
-- If you want to contribute to this file, please change the
-- `TUTORIAL.md` file and then rebuild this file :)

begin;

create schema travelapp;
create schema travelapp_private;

create table travelapp.person (
  id               serial primary key,
  first_name       text not null check (char_length(first_name) < 80),
  last_name        text check (char_length(last_name) < 80),
  about            text,
  created_at       timestamp default now()
);

comment on table travelapp.person is 'A user of the forum.';
comment on column travelapp.person.id is 'The primary unique identifier for the person.';
comment on column travelapp.person.first_name is 'The person’s first name.';
comment on column travelapp.person.last_name is 'The person’s last name.';
comment on column travelapp.person.about is 'A short description about the user, written by the user.';
comment on column travelapp.person.created_at is 'The time this person was created.';

create type travelapp.post_topic as enum (
  'discussion',
  'inspiration',
  'help',
  'showcase'
);

create table travelapp.post (
  id               serial primary key,
  author_id        integer not null references travelapp.person(id),
  headline         text not null check (char_length(headline) < 280),
  body             text,
  topic            travelapp.post_topic,
  created_at       timestamp default now()
);

comment on table travelapp.post is 'A forum post written by a user.';
comment on column travelapp.post.id is 'The primary key for the post.';
comment on column travelapp.post.headline is 'The title written by the user.';
comment on column travelapp.post.author_id is 'The id of the author user.';
comment on column travelapp.post.topic is 'The topic this has been posted in.';
comment on column travelapp.post.body is 'The main body text of our post.';
comment on column travelapp.post.created_at is 'The time this post was created.';

create function travelapp.person_full_name(person travelapp.person) returns text as $$
  select person.first_name || ' ' || person.last_name
$$ language sql stable;

comment on function travelapp.person_full_name(travelapp.person) is 'A person’s full name which is a concatenation of their first and last name.';

create function travelapp.post_summary(
  post travelapp.post,
  length int default 50,
  omission text default '…'
) returns text as $$
  select case
    when post.body is null then null
    else substr(post.body, 0, length) || omission
  end
$$ language sql stable;

comment on function travelapp.post_summary(travelapp.post, int, text) is 'A truncated version of the body for summaries.';

create function travelapp.person_latest_post(person travelapp.person) returns travelapp.post as $$
  select post.*
  from travelapp.post as post
  where post.author_id = person.id
  order by created_at desc
  limit 1
$$ language sql stable;

comment on function travelapp.person_latest_post(travelapp.person) is 'Get’s the latest post written by the person.';

create function travelapp.search_posts(search text) returns setof travelapp.post as $$
  select post.*
  from travelapp.post as post
  where post.headline ilike ('%' || search || '%') or post.body ilike ('%' || search || '%')
$$ language sql stable;

comment on function travelapp.search_posts(text) is 'Returns posts containing a given search term.';

alter table travelapp.person add column updated_at timestamp default now();
alter table travelapp.post add column updated_at timestamp default now();

create function travelapp_private.set_updated_at() returns trigger as $$
begin
  new.updated_at := current_timestamp;
  return new;
end;
$$ language plpgsql;

create trigger person_updated_at before update
  on travelapp.person
  for each row
  execute procedure travelapp_private.set_updated_at();

create trigger post_updated_at before update
  on travelapp.post
  for each row
  execute procedure travelapp_private.set_updated_at();

create table travelapp_private.person_account (
  person_id        integer primary key references travelapp.person(id) on delete cascade,
  email            text not null unique check (email ~* '^.+@.+\..+$'),
  password_hash    text not null
);

comment on table travelapp_private.person_account is 'Private information about a person’s account.';
comment on column travelapp_private.person_account.person_id is 'The id of the person associated with this account.';
comment on column travelapp_private.person_account.email is 'The email address of the person.';
comment on column travelapp_private.person_account.password_hash is 'An opaque hash of the person’s password.';

create extension if not exists "pgcrypto";

create function travelapp.register_person(
  first_name text,
  last_name text,
  email text,
  password text
) returns travelapp.person as $$
declare
  person travelapp.person;
begin
  insert into travelapp.person (first_name, last_name) values
    (first_name, last_name)
    returning * into person;

  insert into travelapp_private.person_account (person_id, email, password_hash) values
    (person.id, email, crypt(password, gen_salt('bf')));

  return person;
end;
$$ language plpgsql strict security definer;

comment on function travelapp.register_person(text, text, text, text) is 'Registers a single user and creates an account in our forum.';

create role travelapp_postgraphql login password 'WzTvpViyx7hOR9LTrO4zF2OEs2Lzc8ynX1gawnzr90ZS';

create role travelapp_anonymous;
grant travelapp_anonymous to travelapp_postgraphql;

create role travelapp_person;
grant travelapp_person to travelapp_postgraphql;

create type travelapp.jwt_token as (
  role text,
  person_id integer
);

create function travelapp.authenticate(
  email text,
  password text
) returns travelapp.jwt_token as $$
declare
  account travelapp_private.person_account;
begin
  select a.* into account
  from travelapp_private.person_account as a
  where a.email = $1;

  if account.password_hash = crypt(password, account.password_hash) then
    return ('travelapp_person', account.person_id)::travelapp.jwt_token;
  else
    return null;
  end if;
end;
$$ language plpgsql strict security definer;

comment on function travelapp.authenticate(text, text) is 'Creates a JWT token that will securely identify a person and give them certain permissions.';

create function travelapp.current_person() returns travelapp.person as $$
  select *
  from travelapp.person
  where id = current_setting('jwt.claims.person_id')::integer
$$ language sql stable;

comment on function travelapp.current_person() is 'Gets the person who was identified by our JWT.';

-- after schema creation and before function creation
alter default privileges revoke execute on functions from public;

grant usage on schema travelapp to travelapp_anonymous, travelapp_person;

grant select on table travelapp.person to travelapp_anonymous, travelapp_person;
grant update, delete on table travelapp.person to travelapp_person;

grant select on table travelapp.post to travelapp_anonymous, travelapp_person;
grant insert, update, delete on table travelapp.post to travelapp_person;
grant usage on sequence travelapp.post_id_seq to travelapp_person;

grant execute on function travelapp.person_full_name(travelapp.person) to travelapp_anonymous, travelapp_person;
grant execute on function travelapp.post_summary(travelapp.post, integer, text) to travelapp_anonymous, travelapp_person;
grant execute on function travelapp.person_latest_post(travelapp.person) to travelapp_anonymous, travelapp_person;
grant execute on function travelapp.search_posts(text) to travelapp_anonymous, travelapp_person;
grant execute on function travelapp.authenticate(text, text) to travelapp_anonymous, travelapp_person;
grant execute on function travelapp.current_person() to travelapp_anonymous, travelapp_person;

grant execute on function travelapp.register_person(text, text, text, text) to travelapp_anonymous;

alter table travelapp.person enable row level security;
alter table travelapp.post enable row level security;

create policy select_person on travelapp.person for select
  using (true);

create policy select_post on travelapp.post for select
  using (true);

create policy update_person on travelapp.person for update to travelapp_person
  using (id = current_setting('jwt.claims.person_id')::integer);

create policy delete_person on travelapp.person for delete to travelapp_person
  using (id = current_setting('jwt.claims.person_id')::integer);

create policy insert_post on travelapp.post for insert to travelapp_person
  with check (author_id = current_setting('jwt.claims.person_id')::integer);

create policy update_post on travelapp.post for update to travelapp_person
  using (author_id = current_setting('jwt.claims.person_id')::integer);

create policy delete_post on travelapp.post for delete to travelapp_person
  using (author_id = current_setting('jwt.claims.person_id')::integer);


commit;
