include .env

.PHONY: run-dev stop-dev run-dev-test stop-dev-test help connect-db connect-redis

help:
	@chcp 65001 > nul
	@echo Команды для запуска:
	@echo -- run-dev:       запуск в режиме разработки
	@echo -- stop-dev:      остановка контейнеров в режиме разработки
	@echo -- run-dev-tets:  запуск для интеграционных тестов
	@echo -- stop-dev-test: остановка контейнеров для интеграционных тестов
	@echo -- connect-db:    подключение к БД
	@echo -- connect-redis: подключение к Redis

run-dev:
	docker compose -f ./docker-compose-develop.yml up --build --watch

stop-dev:
	docker compose -f ./docker-compose-develop.yml stop

run-dev-test:
	docker compose --env-file ./server/.env.test -f ./docker-compose-testing.yml up -d --build

stop-dev-test:
	docker compose --env-file ./server/.env.test -f ./docker-compose-testing.yml stop

connect-db:
	docker exec -it wishlist-db psql -U postgres -d wishlist

connect-redis:
	docker exec -it wishlist-redis redis-cli
