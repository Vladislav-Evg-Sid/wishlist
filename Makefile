include .env

# ==============================
# Variables
# ==============================

SERVER_DIR := ./server

DEV_COMPOSE_FILE := ./docker-compose-develop.yml
TEST_COMPOSE_FILE := ./docker-compose-testing.yml
TEST_ENV_FILE := $(SERVER_DIR)/.env.test

DEV_COMPOSE := docker compose -f $(DEV_COMPOSE_FILE)
TEST_COMPOSE := docker compose --env-file $(TEST_ENV_FILE) -f $(TEST_COMPOSE_FILE)

DB_CONTAINER := wishlist-db
DB_TEST_CONTAINER := wishlist-db-test
REDIS_CONTAINER := wishlist-redis

DB_USER := postgres
DB_NAME := wishlist

BACKUP_DIR := ./backups


# ==============================
# Help
# ==============================

.PHONY: help
help:
ifeq ($(OS),Windows_NT)
	@chcp 65001 > nul
endif
	@echo Команды для запуска:
	@echo = Разработка:
	@echo -- run-dev:          запуск в режиме разработки
	@echo -- stop-dev:         остановка контейнеров в режиме разработки
	@echo -- db-create-backup: создать бэкап базы
	@echo = Тестирование:
	@echo -- test-unit:        запуск unit-тестов
	@echo -- test-integration: запуск интеграционных тестов
	@echo -- test-all:         запуск всех тестов
	@echo -- run-dev-test:     запуск БД с миграциями для интеграционных тестов
	@echo -- stop-dev-test:    остановка контейнеров для интеграционных тестов
	@echo = Подключения:
	@echo -- connect-db:       подключение к БД
	@echo -- connect-db-test:  подключение к тестовой БД
	@echo -- connect-redis:    подключение к Redis


# ==============================
# Development
# ==============================

.PHONY: run-dev stop-dev db-create-backup

run-dev:
	$(DEV_COMPOSE) up --build --watch

stop-dev:
	$(DEV_COMPOSE) stop

db-create-backup: BACKUP_TIMESTAMP := $(shell node -e "process.stdout.write(new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, ''))")
db-create-backup: BACKUP_FILE := $(BACKUP_DIR)/wishlist_$(BACKUP_TIMESTAMP).backup
db-create-backup:
	@node -e "require('fs').mkdirSync('$(BACKUP_DIR)', { recursive: true })"
	docker exec $(DB_CONTAINER) \
		pg_dump -U $(DB_USER) -d $(DB_NAME) -F c \
		> "$(BACKUP_FILE)"
	@echo Backup created: $(BACKUP_FILE)

db-restore-backup:
ifndef FILE
	$(error FILE is required. Usage: make db-restore-backup FILE=./backups/wishlist_xxx.backup)
endif
	docker exec -i $(DB_CONTAINER) \
		pg_restore \
		-U $(DB_USER) \
		-d $(DB_NAME) \
		--clean \
		--if-exists \
		--no-owner \
		< "$(FILE)"
	@echo Backup restored: $(FILE)


# ==============================
# Tests
# ==============================

.PHONY: run-dev-test stop-dev-test test-unit test-integration test-all

test-unit:
	cd $(SERVER_DIR) && npm run test:unit

test-integration: run-dev-test
	cd $(SERVER_DIR) && npm run test:integration
	$(MAKE) stop-dev-test

test-all: run-dev-test
	cd $(SERVER_DIR) && npm run test
	$(MAKE) stop-dev-test

run-dev-test:
	$(TEST_COMPOSE) up -d db-test
	$(TEST_COMPOSE) run --rm --build db-migrate

stop-dev-test:
	$(TEST_COMPOSE) stop


# ==============================
# Connections
# ==============================

.PHONY: connect-db connect-db-test connect-redis

connect-db:
	docker exec -it $(DB_CONTAINER) \
		psql -U $(DB_USER) -d $(DB_NAME)

connect-db-test:
	docker exec -it $(DB_TEST_CONTAINER) \
		sh -c 'exec psql -U "$$POSTGRES_USER" -d "$$POSTGRES_DB"'

connect-redis:
	docker exec -it $(REDIS_CONTAINER) redis-cli