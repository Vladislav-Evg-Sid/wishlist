package pgstorage

import (
	"context"
	"fmt"

	"github.com/Vladislav-Evg-Sid/wishlist/server/config"
	"github.com/jackc/pgx/v5/pgxpool"
)

type PgStorage struct {
	db *pgxpool.Pool
}

func NewPgStorage(dbconf *config.DatabaseConfig) (*PgStorage, error) {
	connectingString := createConnectionString(dbconf)
	config, err := pgxpool.ParseConfig(connectingString)
	if err != nil {
		return nil, fmt.Errorf("ошибка парсинга конфига: %s", err)
	}

	db, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return nil, fmt.Errorf("ошибка подключения: %s", err)
	}

	return &PgStorage{
		db: db,
	}, nil
}

func createConnectionString(dbconfig *config.DatabaseConfig) string {
	return fmt.Sprintf("postgres://%s:%s@%s:%d/%s",
		dbconfig.Username, dbconfig.Password, dbconfig.Host, dbconfig.Port, dbconfig.DBName)
}
