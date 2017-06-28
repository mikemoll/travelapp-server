# TravelApp Schema

## Table of Contents
- [The Basics](#the-basics)
  - [Setting Up Your Schemas](#setting-up-your-schemas)
  - [The Person Table](#the-person-table)
  - [Table Documentation](#table-documentation)
  - [The Post Table](#the-post-table)
- [Database Functions](#database-functions)
  - [Set Returning Functions](#set-returning-functions)
  - [Triggers](#triggers)
- [Authentication and Authorization](#authentication-and-authorization)
  - [Storing Emails and Passwords](#storing-emails-and-passwords)
  - [Registering Users](#registering-users)
  - [Postgres Roles](#postgres-roles)
  - [JSON Web Tokens](#json-web-tokens)
  - [Logging In](#logging-in)
  - [Using the Authorized User](#using-the-authorized-user)
  - [Grants](#grants)
  - [Row Level Security](#row-level-security)
- [Conclusion](#conclusion)

## The Basics

### Schemas

```sql
create schema travelapp;
create schema travelapp_private;
```

### The Person Table

```sql
create table travelapp.person (
  id                  serial primary key,
  main_photo          text,
  cover_photo         text,
  first_name          text not null check (char_length(first_name) < 80),
  last_name           text check (char_length(last_name) < 80),
  user_profile_url    text,
  username            text,
  phone_number        text,
  location            text,
  birthdate           text,
  gender              text,
  relationship_status text,
  bio                 text check (char_length(bio) < 140),
  instagram           text,
  twitter             text,
  facebook            text,
  occupation          text,
  dream_job           text,
  where_i_live_now    text,
  places_lived        text,
  preferred_calendar  text,
  last_place_visited  text,
  next_trip_booked    text,
  top_10_dream_places text,
  spoken_languages    text,
  interests           text,
  education           text,
  home_town           text,
  mutual_friends      text,
  groups              text,
  type_of_traveler    text,
  contacts            text,
  created_at          timestamp default now()
);
```

### Table Documentation

```sql
comment on table travelapp.person is 'A user of the TravelApp.';
comment on column travelapp.person.id is 'The primary unique identifier for the person.';
comment on column travelapp.person.main_photo is 'The persons main photo.';
comment on column travelapp.person.cover_photo is 'the persons cover photo.';
comment on column travelapp.person.first_name is 'The person’s first name.';
comment on column travelapp.person.last_name is 'The person’s last name.';
comment on column travelapp.person.user_profile_url is 'The person’s user profile url.';
comment on column travelapp.person.username is 'The person’s username.';
comment on column travelapp.person.phone_number is 'The person’s phone number.';
comment on column travelapp.person.location is 'The person’s location.';
comment on column travelapp.person.birthdate is 'The person’s birthdate.';
comment on column travelapp.person.gender is 'The person’s gender.';
comment on column travelapp.person.relationship_status is 'The person’s relationship status.';
comment on column travelapp.person.bio is 'The person’s biography.';
comment on column travelapp.person.instagram is 'The person’s instagram profile url.';
comment on column travelapp.person.twitter is 'The person’s twitter profile url.';
comment on column travelapp.person.facebook is 'The person’s facebook profile url.';
comment on column travelapp.person.occupation is 'The person’s occupation profile url.';
comment on column travelapp.person.dream_job is 'The person’s dream job.';
comment on column travelapp.person.where_i_live_now is 'The person’s current place of residence.';
comment on column travelapp.person.places_lived is 'The person’s previous places of residence.';
comment on column travelapp.person.preferred_calendar is 'The person’s preferred calendar.';
comment on column travelapp.person.last_place_visited is 'The person’s last place of visit.';
comment on column travelapp.person.next_trip_booked is 'The person’s next planned trip.';
comment on column travelapp.person.top_10_dream_places is 'The person’s top 10 dream places.';
comment on column travelapp.person.spoken_languages is 'The person’s spoken languages.';
comment on column travelapp.person.interests is 'The person’s interests and hobbies.';
comment on column travelapp.person.education is 'The person’s education.';
comment on column travelapp.person.home_town is 'The person’s hometown.';
comment on column travelapp.person.mutual_friends is 'The person’s mutual friends.';
comment on column travelapp.person.groups is 'The person’s groups.';
comment on column travelapp.person.type_of_traveler is 'The person’s type of traveler.';
comment on column travelapp.person.contacts is 'The person’s contacts.';
comment on column travelapp.person.created_at is 'The time this person was created.';
```

### The Trip Table

```sql
create table travelapp.trip (
  id                  serial primary key,
  organizer_id        integer not null references travelapp.person(id),
  public_url          text,
  name                text,
  type                text,
  description         text not null check (char_length(description) < 280),
  start_date          text,
  end_date            text,
  multi_city_trip     text,
  city                text,
  travel_buddies      text,
  travel_method       text,
  where_staying       text,
  accommodation_dates text,
  activities          text,
  events              text,
  suggestions         text,
  wishlist            text,
  notes               text,
  calendar            text,
  block_list          text,
  budget              text,
  inventory           text,
  chat                text,
  attire_dress_code   text,
  created_at          timestamp default now()
);

comment on table travelapp.trip is 'A trip organized by a user.';
comment on column travelapp.trip.id is 'The primary key for the trip.';
comment on column travelapp.trip.organizer_id is 'The id of the organizer user.';
comment on column travelapp.trip.public_url is 'The trip’s public URL.';
comment on column travelapp.trip.name is 'The trip’s name.';
comment on column travelapp.trip.type is 'The type of a trip.';
comment on column travelapp.trip.description is 'The trip’s description.';
comment on column travelapp.trip.start_date is 'The trip’s start date.';
comment on column travelapp.trip.end_date is 'The trip’s end date.';
comment on column travelapp.trip.multi_city_trip is 'Is the trip a multi-city trip?';
comment on column travelapp.trip.city is 'The trip’s city(s).';
comment on column travelapp.trip.travel_buddies is 'The trip’s travel buddies.';
comment on column travelapp.trip.travel_method is 'The trip’s travel methods.';
comment on column travelapp.trip.where_staying is 'The trip’s staying details.';
comment on column travelapp.trip.accommodation_dates is 'The trip’s accommodation dates.';
comment on column travelapp.trip.activities is 'The trip’s activities.';
comment on column travelapp.trip.events is 'The trip’s events.';
comment on column travelapp.trip.suggestions is 'The trip’s suggestions.';
comment on column travelapp.trip.wishlist is 'The trip’s wishlist.';
comment on column travelapp.trip.notes is 'The trip’s notes.';
comment on column travelapp.trip.calendar is 'The trip’s calendar.';
comment on column travelapp.trip.block_list is 'The trip’s block-list.';
comment on column travelapp.trip.budget is 'The trip’s budget.';
comment on column travelapp.trip.inventory is 'The trip’s inventory.';
comment on column travelapp.trip.chat is 'The trip’s chat.';
comment on column travelapp.trip.attire_dress_code is 'The trip’s attire & dress code.';
comment on column travelapp.trip.created_at is 'The time this trip was created.';
```

### The Activity Table

```sql
create table travelapp.activity (
  id                    serial primary key,
  organizer_id          integer not null references travelapp.person(id),
  name                  text, 
  type                  text,
  date                  text,
  time                  text,
  price                 text,
  location              text,
  description           text not null check (char_length(description) < 280),
  notes                 text,
  invitees              text,
  not_coming            text,
  attendees             text,
  wishlist              text,
  trip_associated       text,
  supplies              text,
  attire_dress_code     text,
  multi_day_event       text,
  post_activity_reviews text,
  created_at            timestamp default now()
);

comment on table travelapp.activity is 'An activity created by a user.';
comment on column travelapp.activity.id is 'The primary key for the activity.';
comment on column travelapp.activity.organizer_id is 'The id of the organizer user.';
comment on column travelapp.activity.name is 'The activity’s name.';
comment on column travelapp.activity.type is 'The activity’s type.';
comment on column travelapp.activity.date is 'The activity’s date.';
comment on column travelapp.activity.time is 'The activity’s time.';
comment on column travelapp.activity.price is 'The activity’s price.';
comment on column travelapp.activity.location is 'The activity’s location.';
comment on column travelapp.activity.description is 'The activity’s description.';
comment on column travelapp.activity.notes is 'The activity’s notes.';
comment on column travelapp.activity.invitees is 'The activity’s invitees.';
comment on column travelapp.activity.not_coming is 'The activity’s not coming.';
comment on column travelapp.activity.attendees is 'The activity’s attendees.';
comment on column travelapp.activity.wishlist is 'The activity’s wishlist.';
comment on column travelapp.activity.trip_associated is 'The activity’s trip associated.';
comment on column travelapp.activity.supplies is 'The activity’s supplies.';
comment on column travelapp.activity.attire_dress_code is 'The activity’s attire & dress code.';
comment on column travelapp.activity.multi_day_event is 'Is the activity a multi day event.';
comment on column travelapp.activity.post_activity_reviews is 'The activity’s post reviews.';
comment on column travelapp.activity.created_at is 'The time this activity was created.';
```

### The Events Table

```sql
create table travelapp.event (
  id                serial primary key,
  organizer_id      integer not null references travelapp.person(id),
  name              text, 
  type              text,
  date              text,
  time              text,
  price             text,
  location          text,
  description       text not null check (char_length(description) < 280),
  notes             text,
  invitees          text,
  not_coming        text,
  attendees         text,
  wishlist          text,
  trip_associated   text,
  supplies          text,
  attire_dress_code text,
  multi_day_event   text,
  created_at        timestamp default now()
);

comment on table travelapp.event is 'An event created by a user.';
comment on column travelapp.event.id is 'The primary key for the post.';
comment on column travelapp.event.organizer_id is 'The id of the organizer user.';
comment on column travelapp.event.name is 'The event’s name.';
comment on column travelapp.event.type is 'The event’s type.';
comment on column travelapp.event.date is 'The event’s date.';
comment on column travelapp.event.time is 'The event’s time.';
comment on column travelapp.event.price is 'The event’s price.';
comment on column travelapp.event.location is 'The event’s location.';
comment on column travelapp.event.description is 'The event’s description.';
comment on column travelapp.event.notes is 'The event’s notes.';
comment on column travelapp.event.invitees is 'The event’s invitees.';
comment on column travelapp.event.not_coming is 'The event’s not coming.';
comment on column travelapp.event.attendees is 'The event’s attendees.';
comment on column travelapp.event.wishlist is 'The event’s wishlist.';
comment on column travelapp.event.trip_associated is 'The event’s trip associated.';
comment on column travelapp.event.supplies is 'The event’s supplies.';
comment on column travelapp.event.attire_dress_code is 'The event’s attire & dress code.';
comment on column travelapp.event.multi_day_event is 'Is the event a multi day event.';
comment on column travelapp.event.created_at is 'The time this event was created.';
```

## Computed Fields

```sql
create function travelapp.person_full_name(person travelapp.person) returns text as $$
  select person.first_name || ' ' || person.last_name
$$ language sql stable;

comment on function travelapp.person_full_name(travelapp.person) is 'A person’s full name which is a concatenation of their first and last name.';
```

```sql
create function travelapp.trip_summary(
  trip travelapp.trip,
  length int default 50,
  omission text default '…'
) returns text as $$
  select case
    when trip.description is null then null
    else substr(trip.description, 0, length) || omission
  end
$$ language sql stable;

comment on function travelapp.trip_summary(travelapp.trip, int, text) is 'A truncated version of the description for summaries.';
```

```sql
create function travelapp.activity_summary(
  activity travelapp.activity,
  length int default 50,
  omission text default '…'
) returns text as $$
  select case
    when activity.description is null then null
    else substr(activity.description, 0, length) || omission
  end
$$ language sql stable;

comment on function travelapp.activity_summary(travelapp.activity, int, text) is 'A truncated version of the description for summaries.';
```

```sql
create function travelapp.event_summary(
  event travelapp.event,
  length int default 50,
  omission text default '…'
) returns text as $$
  select case
    when event.description is null then null
    else substr(event.description, 0, length) || omission
  end
$$ language sql stable;

comment on function travelapp.event_summary(travelapp.event, int, text) is 'A truncated version of the description for summaries.';
```

```sql
create function travelapp.person_latest_trip(person travelapp.person) returns travelapp.trip as $$
  select trip.*
  from travelapp.trip as trip
  where trip.organizer_id = person.id
  order by created_at desc
  limit 1
$$ language sql stable;

comment on function travelapp.person_latest_trip(travelapp.person) is 'Get’s the latest trip organized by the person.';
```

```sql
create function travelapp.person_latest_activity(person travelapp.person) returns travelapp.activity as $$
  select activity.*
  from travelapp.activity as activity
  where activity.organizer_id = person.id
  order by created_at desc
  limit 1
$$ language sql stable;

comment on function travelapp.person_latest_activity(travelapp.person) is 'Get’s the latest activity organized by the person.';
```

```sql
create function travelapp.person_latest_event(person travelapp.person) returns travelapp.event as $$
  select event.*
  from travelapp.event as event
  where event.organizer_id = person.id
  order by created_at desc
  limit 1
$$ language sql stable;

comment on function travelapp.person_latest_event(travelapp.person) is 'Get’s the latest event organized by the person.';
```

### Searches

```sql
create function travelapp.search_trips(search text) returns setof travelapp.trip as $$
  select trip.*
  from travelapp.trip as trip
  where trip.description ilike ('%' || search || '%') or trip.name ilike ('%' || search || '%')
$$ language sql stable;

comment on function travelapp.search_trips(text) is 'Returns trips containing a given search term.';
```

```sql
create function travelapp.search_activities(search text) returns setof travelapp.activity as $$
  select activity.*
  from travelapp.activity as activity
  where activity.description ilike ('%' || search || '%') or activity.name ilike ('%' || search || '%')
$$ language sql stable;

comment on function travelapp.search_activities(text) is 'Returns activities containing a given search term.';
```

```sql
create function travelapp.search_events(search text) returns setof travelapp.event as $$
  select event.*
  from travelapp.event as event
  where event.description ilike ('%' || search || '%') or event.name ilike ('%' || search || '%')
$$ language sql stable;

comment on function travelapp.search_events(text) is 'Returns events containing a given search term.';
```

### Triggers

```sql
alter table travelapp.person add column updated_at timestamp default now();
alter table travelapp.trip add column updated_at timestamp default now();
alter table travelapp.activity add column updated_at timestamp default now();
alter table travelapp.event add column updated_at timestamp default now();
```

```sql
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

create trigger trip_updated_at before update
  on travelapp.trip
  for each row
  execute procedure travelapp_private.set_updated_at();
  
create trigger activity_updated_at before update
  on travelapp.activity
  for each row
  execute procedure travelapp_private.set_updated_at();
    
create trigger event_updated_at before update
  on travelapp.event
  for each row
  execute procedure travelapp_private.set_updated_at();
```


* * *

## Authentication and Authorization

### Storing Emails and Passwords

```sql
create table travelapp_private.person_account (
  person_id        integer primary key references travelapp.person(id) on delete cascade,
  email            text not null unique check (email ~* '^.+@.+\..+$'),
  password_hash    text not null
);

comment on table travelapp_private.person_account is 'Private information about a person’s account.';
comment on column travelapp_private.person_account.person_id is 'The id of the person associated with this account.';
comment on column travelapp_private.person_account.email is 'The email address of the person.';
comment on column travelapp_private.person_account.password_hash is 'An opaque hash of the person’s password.';
```

### Registering Users

```sql
create extension if not exists "pgcrypto";
```

```sql
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
```

### Postgres Roles

```sql
create role travelapp_postgraphql login password 'WzTvpViyx7hOR9LTrO4zF2OEs2Lzc8ynX1gawnzr90ZS';
```

```bash
postgraphql -c postgres://travelapp_postgraphql:WzTvpViyx7hOR9LTrO4zF2OEs2Lzc8ynX1gawnzr90ZS@localhost:5432/mydb
```

```sql
create role travelapp_anonymous;
grant travelapp_anonymous to travelapp_postgraphql;
```

```bash
postgraphql \
  --connection postgres://travelapp_postgraphql:WzTvpViyx7hOR9LTrO4zF2OEs2Lzc8ynX1gawnzr90ZS@localhost:5432/mydb \
  --default-role travelapp_anonymous
```

```sql
create role travelapp_person;
grant travelapp_person to travelapp_postgraphql;
```

### JSON Web Tokens

 ```sql
set local jwt.claims.a to 1;
set local jwt.claims.b to 2;
set local jwt.claims.c to 3;
```

 ```sql
select current_setting('jwt.claims.a');
```

 ```sql
set local role to 'travelapp_person'
set local jwt.claims.role to 'travelapp_person'
```

### Logging In

```sql
create type travelapp.jwt_token as (
  role text,
  person_id integer
);
```

```sql
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
```

```plpgsql
select a.* into account
from travelapp_private.person_account as a
where a.email = $1;
```

```plpgsql
if account.password_hash = crypt(password, account.password_hash) then
  return ('travelapp_person', account.person_id)::travelapp.jwt_token;
else
  return null;
end if;
```

### Using the Authorized User

```sql
create function travelapp.current_person() returns travelapp.person as $$
  select *
  from travelapp.person
  where id = current_setting('jwt.claims.person_id')::integer
$$ language sql stable;

comment on function travelapp.current_person() is 'Gets the person who was identified by our JWT.';
```

### Grants

```sql
-- after schema creation and before function creation
alter default privileges revoke execute on functions from public;

grant usage on schema travelapp to travelapp_anonymous, travelapp_person;

grant select on table travelapp.person to travelapp_anonymous, travelapp_person;
grant update, delete on table travelapp.person to travelapp_person;

grant select on table travelapp.trip to travelapp_anonymous, travelapp_person;
grant insert, update, delete on table travelapp.trip to travelapp_person;
grant usage on sequence travelapp.trip_id_seq to travelapp_person;

grant select on table travelapp.activity to travelapp_anonymous, travelapp_person;
grant insert, update, delete on table travelapp.activity to travelapp_person;
grant usage on sequence travelapp.activity_id_seq to travelapp_person;

grant select on table travelapp.event to travelapp_anonymous, travelapp_person;
grant insert, update, delete on table travelapp.event to travelapp_person;
grant usage on sequence travelapp.event_id_seq to travelapp_person;

grant execute on function travelapp.person_full_name(travelapp.person) to travelapp_anonymous, travelapp_person;

grant execute on function travelapp.trip_summary(travelapp.trip, integer, text) to travelapp_anonymous, travelapp_person;
grant execute on function travelapp.person_latest_trip(travelapp.person) to travelapp_anonymous, travelapp_person;
grant execute on function travelapp.search_trips(text) to travelapp_anonymous, travelapp_person;

grant execute on function travelapp.activity_summary(travelapp.activity, integer, text) to travelapp_anonymous, travelapp_person;
grant execute on function travelapp.person_latest_activity(travelapp.person) to travelapp_anonymous, travelapp_person;
grant execute on function travelapp.search_activities(text) to travelapp_anonymous, travelapp_person;

grant execute on function travelapp.event_summary(travelapp.event, integer, text) to travelapp_anonymous, travelapp_person;
grant execute on function travelapp.person_latest_event(travelapp.person) to travelapp_anonymous, travelapp_person;
grant execute on function travelapp.search_events(text) to travelapp_anonymous, travelapp_person;

grant execute on function travelapp.authenticate(text, text) to travelapp_anonymous, travelapp_person;
grant execute on function travelapp.current_person() to travelapp_anonymous, travelapp_person;

grant execute on function travelapp.register_person(text, text, text, text) to travelapp_anonymous;
```

```sql
alter table travelapp.person enable row level security;
alter table travelapp.trip enable row level security;
alter table travelapp.activity enable row level security;
alter table travelapp.event enable row level security;
```

```sql
create policy select_person on travelapp.person for select
  using (true);

create policy select_trip on travelapp.trip for select
  using (true);

create policy select_activity on travelapp.activity for select
  using (true);

create policy select_event on travelapp.event for select
  using (true);
```

```sql
create policy update_person on travelapp.person for update to travelapp_person
  using (id = current_setting('jwt.claims.person_id')::integer);

create policy delete_person on travelapp.person for delete to travelapp_person
  using (id = current_setting('jwt.claims.person_id')::integer);
```

```sql
create policy insert_trip on travelapp.trip for insert to travelapp_person
  with check (organizer_id = current_setting('jwt.claims.person_id')::integer);

create policy update_trip on travelapp.trip for update to travelapp_person
  using (organizer_id = current_setting('jwt.claims.person_id')::integer);

create policy delete_trip on travelapp.trip for delete to travelapp_person
  using (organizer_id = current_setting('jwt.claims.person_id')::integer);
```

```sql
create policy insert_activity on travelapp.activity for insert to travelapp_person
  with check (organizer_id = current_setting('jwt.claims.person_id')::integer);

create policy update_activity on travelapp.activity for update to travelapp_person
  using (organizer_id = current_setting('jwt.claims.person_id')::integer);

create policy delete_activity on travelapp.activity for delete to travelapp_person
  using (organizer_id = current_setting('jwt.claims.person_id')::integer);
```

```sql
create policy insert_event on travelapp.event for insert to travelapp_person
  with check (organizer_id = current_setting('jwt.claims.person_id')::integer);

create policy update_event on travelapp.event for update to travelapp_person
  using (organizer_id = current_setting('jwt.claims.person_id')::integer);

create policy delete_event on travelapp.event for delete to travelapp_person
  using (organizer_id = current_setting('jwt.claims.person_id')::integer);
```

```bash
postgraphql \
  --connection postgres://travelapp_postgraphql:WzTvpViyx7hOR9LTrO4zF2OEs2Lzc8ynX1gawnzr90ZS@localhost:5432 \
  --schema travelapp \
  --default-role travelapp_anonymous \
  --secret FavM5nxm8uHdc5A5kSK4dOZbinr1GKGoxtOMhwPihZg72VUVDoi8ponM1QQCVkVB1UZ38G4h3r75H7oKiVy4gcBUUbRgv9uNMc5 \
  --token travelapp.jwt_token
```

* * *

