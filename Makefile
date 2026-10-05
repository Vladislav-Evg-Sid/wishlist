include .env

.PHONY: run-dev run-dev-test help

help:
	@chcp 65001 > nul
	@echo Команды для запуска:
	@echo -- run-dev: запуск в режиме разработки
	@echo -- run-dev-tets: запуск для интеграционных тестов

run-dev:
	docker compose -f .\docker-compose-develop.yml up --build --watch

run-dev-test:
	docker compose --env-file .\server\.env.test -f .\docker-compose-testing.yml up -d --build
