include .env

SERVER_DIR=server

.PHONY: run-dev
run-dev:
	docker compose -f .\docker-compose-develop.yml up --build --watch

.PHONY: run-dev-test
run-dev-test:
	docker compose --env-file .\server\.env.test -f .\docker-compose-testing.yml up -d --build
