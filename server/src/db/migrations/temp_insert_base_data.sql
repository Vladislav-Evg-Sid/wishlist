INSERT INTO public.users(
	id, username, password_hash)
	VALUES ('00000000-0000-0000-0000-000000000000', 'Влад', 'test');

INSERT INTO public.groups(
	title, creator_id)
	VALUES
	('друзья, Боровский', '00000000-0000-0000-0000-000000000000'),
	('друзья, Тюмень', '00000000-0000-0000-0000-000000000000');