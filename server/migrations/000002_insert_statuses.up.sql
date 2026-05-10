ALTER SEQUENCE status_id_seq RESTART WITH 1;

INSERT INTO public.statuses(description) VALUES
    ('Запланировано'),
    ('В процессе'),
    ('Завершено'),
    ('Заброшено')
