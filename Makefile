include .env

MIGRATIONS_PATH=server/migrations
SERVER_DIR=server
APP_ENTRY=cmd/app/main.go
SWAGGER_OUT=internal/rest/swagger


DATABASE_URL=postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@localhost:$(POSTGRES_HOST_PORT)/$(POSTGRES_DB)?sslmode=${POSTGRES_SSL_MODE}

.PHONY: migrate-up
migrate-up:
	migrate -path $(MIGRATIONS_PATH) -database "$(DATABASE_URL)" up

.PHONY: migrate-down
migrate-down:
	migrate -path $(MIGRATIONS_PATH) -database "$(DATABASE_URL)" down 1

.PHONY: migrate-version
migrate-version:
	migrate -path $(MIGRATIONS_PATH) -database "$(DATABASE_URL)" version

.PHONY: migrate-create
migrate-create:
	migrate create -ext sql -dir $(MIGRATIONS_PATH) -seq $(name)

.PHONY: swagger-install
swagger-install:
	go install github.com/swaggo/swag/cmd/swag@latest

.PHONY: swagger
swagger:
	cd $(SERVER_DIR) && swag init -g $(APP_ENTRY) -o $(SWAGGER_OUT) --parseInternal

.PHONY: run-dev
run-dev:
	docker-compose -f docker-compose-develop.yml up --build

.PHONY: run-prod
run-prod:
	docker-compose -f docker-compose-prod.yml up --build

.PHONY: tidy
tidy:
	cd $(SERVER_DIR) && go mod tidy