include .env

MIGRATIONS_PATH=server/migrations

DATABASE_URL=postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@localhost:$(POSTGRES_HOST_PORT)/$(POSTGRES_DB)?sslmode=disable

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