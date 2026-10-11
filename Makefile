include .env

.PHONY: help
help:
	@echo Команды для запуска:
	@echo = Разработка:
	@echo -- run-dev:       запуск в режиме разработки
	@echo -- stop-dev:      остановка контейнеров в режиме разработки
	@echo = Тестрование:
	@echo -- test-unit:     запуск unit-тестов
	@echo -- run-dev-tets:  запуск для интеграционных тестов
	@echo -- stop-dev-test: остановка контейнеров для интеграционных тестов
	@echo = Подключения:
	@echo -- connect-db:    подключение к БД
	@echo -- connect-redis: подключение к Redis

.PHONY: run-dev stop-dev
run-dev:
	docker compose -f ./docker-compose-develop.yml up --build --watch

stop-dev:
	docker compose -f ./docker-compose-develop.yml stop

.PHONY: run-dev-test stop-dev-test test-unit
test-unit:
	cd ./server && npm run test:unit

run-dev-test:
	docker compose --env-file ./server/.env.test -f ./docker-compose-testing.yml up -d --build

stop-dev-test:
	docker compose --env-file ./server/.env.test -f ./docker-compose-testing.yml stop

.PHONY: connect-db connect-redis
connect-db:
	docker exec -it wishlist-db psql -U postgres -d wishlist

connect-redis:
	docker exec -it wishlist-redis redis-cli
