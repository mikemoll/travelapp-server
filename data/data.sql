begin;

insert into travelapp.person (id, first_name, last_name, bio, created_at) values
  (1, 'Sara', 'Powell', null, '2015-07-03T14:11:30Z'),
  (2, 'Andrea', 'Fox', null, '1999-04-04T21:21:42Z'),
  (3, 'Stephen', 'Banks', null, '2003-12-09T04:39:10Z'),
  (4, 'Kathy', null, null, '2001-11-03T15:37:15Z'),
  (5, 'Kenneth', 'Williams', null, '2002-08-16T19:03:47Z'),
  (6, 'Ann', 'Peterson', null, '2013-09-24T15:05:29Z'),
  (7, 'Gloria', 'Lee', 'Curabitur in libero ut massa volutpat convallis.', '2007-04-23T12:56:09Z'),
  (8, 'Douglas', null, null, '2008-07-10T21:49:16Z'),
  (9, 'Jeffrey', 'Palmer', null, '2000-07-28T22:33:20Z'),
  (10, 'Robert', 'Fisher', 'Suspendisse potenti. Cras in purus eu magna vulputate luctus. Vivamus vestibulum sagittis sapien.', '2000-06-12T09:11:56Z');

alter sequence travelapp.person_id_seq restart with 11;

insert into travelapp_private.person_account (person_id, email, password_hash) values
  (1, 'spowell0@noaa.gov', '$2a$06$.Ryt.S6xCN./QmTx3r9Meu/nsk.4Ypfuj.o9qIqv4p3iipCWY45Bi'), -- Password: 'iFbWWlc'
  (2, 'afox1@npr.org', '$2a$06$FS4C7kwDs6tSrrjh0TITLuQ/pAjUHuCH0TBukHC.2m5n.Z1HxApRO'), -- Password: 'fjHtKk2FxCh0'
  (3, 'sbanks2@blog.com', '$2a$06$i7AoCg3pbAOmf8J2w/lGpukUfDuRdfyUrR/mN7I0x.AYZb3Ak6DYS'), -- Password: '3RLdPN9'
  (4, 'kaustin3@nyu.edu', '$2a$06$YJJ.vNqGcrKcX4ZtPl1nG.crDhCCoA6t5tWXkAokvprG4nytdWNli'), -- Password: 'jQZ8mYjUNH'
  (5, 'kwilliams4@paypal.com', '$2a$06$Mx2dB7Y1yfL7WhCg0JHNLetBeIgsOqxRbKBOPc1Kv66lYEfbPghzi'), -- Password: '3Uostu'
  (6, 'apeterson5@webnode.com', '$2a$06$wCdceaTUqf9fxp/j6hswk.pWp9aY7N2HMQeNKb2TJZMUm.i8IZ.3G'), -- Password: 'u2TZDkfHSm'
  (7, 'glee6@arizona.edu', '$2a$06$WQiZeChX8yUR14DAshXKd.W6cwz0tsvf49IaNhmM65FkFJVr8GEgW'), -- Password: 'VEHWMCcfuMJ'
  (8, 'drodriguez7@mashable.com', '$2a$06$8Wa.RA33V4MrCIKQ1rAJIu7HMJSLjTZLcZY1zrlU4fZrJOIVFtvQS'), -- Password: 'TEYkGd'
  (9, 'jpalmer8@washingtonpost.com', '$2a$06$q3H4ngUMZ9ADz3utyzGRX.6pWrzmPurqEjKtm7qzbYJrmSEYrsYvu'), -- Password: 'yYh7KDQ2'
  (10, 'rfisher9@nytimes.com', '$2a$06$lvLbqB8u.BVnqa8Zmy5E0.1LgSyKJkBnRYztVu3gO.hE6kCIsx2YK'); -- Password: 'tAVD3Yvi2'

--insert into travelapp.trip (id, organizer_id, description, name, type, created_at) values
--  (1, 1, 'Ameliorated optimal emulation', E'Aenean lectus. Pellentesque eget nunc.', null, '2011-06-01T09:27:57Z'),
--  (2, 6, 'Open-source non-volatile protocol', E'In hac habitasse platea dictumst.', null, '2001-02-18T16:35:03Z'),

--alter sequence travelapp.trip_id_seq restart with 3;

commit;
