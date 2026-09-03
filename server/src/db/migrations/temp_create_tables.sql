CREATE TABLE IF NOT EXISTS public.users
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    username text COLLATE pg_catalog."default" NOT NULL,
    password_hash text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone,
    CONSTRAINT users_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.groups
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text COLLATE pg_catalog."default" NOT NULL,
    creator_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT group_pkey PRIMARY KEY (id),
    CONSTRAINT "group-creator" FOREIGN KEY (creator_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.group_member
(
    group_id uuid NOT NULL,
    member_id uuid NOT NULL,
    CONSTRAINT "pk-gm" PRIMARY KEY (group_id, member_id),
    CONSTRAINT "gm-group" FOREIGN KEY (group_id)
        REFERENCES public.groups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "gm-user" FOREIGN KEY (member_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS public.wishlist
(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title text COLLATE pg_catalog."default" NOT NULL,
    group_id uuid NOT NULL,
    creator_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    is_deleted boolean NOT NULL DEFAULT false,
    CONSTRAINT wishlist_pkey PRIMARY KEY (id),
    CONSTRAINT "wishlist-creator" FOREIGN KEY (creator_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "wishlist-group" FOREIGN KEY (group_id)
        REFERENCES public.groups (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TYPE statuses AS ENUM (
    'Новая',
    'Завершена'
);

CREATE TABLE IF NOT EXISTS public.card
(
    id integer GENERATED ALWAYS AS IDENTITY,
    title text COLLATE pg_catalog."default" NOT NULL,
    wishlist_id uuid NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    status statuses NOT NULL,
    creator_id uuid NOT NULL,
    CONSTRAINT card_pkey PRIMARY KEY (id),
    CONSTRAINT "card-creator" FOREIGN KEY (creator_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "card-wishlist" FOREIGN KEY (wishlist_id)
        REFERENCES public.wishlist (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);