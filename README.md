# wishlist
## Запуск проекта
1. Скопировать файл `.env.example`, поменять название на `.env`
2. Изменить параметра под необходимые
3. Для запуска в режиме разработки пропишите: `make run-dev`
4. Для запуска в режиме продакшена пропишите: `make run-prod`

## Работа с миграциями:
1. Установить зависимость для работы с миграциями: `go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest`
2. Проверить доступность: `migrate -version`
3. Использовать Makefile для работы с миграциями:
    1. `make migrate-create name=""` - создание новой миграции. После необходимо отредактировать файлы
    2. `make migrate-up` - применить все миграции
    3. `make migrate-down` - откатить 1 миграцию
    4. `make migrate-version` - проверить текущую версию

## Swagger:
1. Установить зависимость для создания свагера: `go install github.com/swaggo/swag/cmd/swag@latest`
2. Запустить скрипт для создания свагера: `make swagger`
3. Смотреть swagger можно по URL `http://{host}:{port}/swagger/index.html`
