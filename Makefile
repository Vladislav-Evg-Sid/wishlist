include .env

.PHONY: run-dev run-dev-test help connect-db connect-redis

help:
	@chcp 65001 > nul
	@echo Команды для запуска:
	@echo -- run-dev:       запуск в режиме разработки
	@echo -- run-dev-tets:  запуск для интеграционных тестов
	@echo -- connect-db:    подключение к БД
	@echo -- connect-redis: подключение к Redis

run-dev:
	docker compose -f .\docker-compose-develop.yml up --build --watch

run-dev-test:
	docker compose --env-file .\server\.env.test -f .\docker-compose-testing.yml up -d --build

connect-db:
	docker exec -it wishlist-db psql -U postgres -d wishlist

connect-redis:
	docker exec -it wishlist-redis redis-cli
