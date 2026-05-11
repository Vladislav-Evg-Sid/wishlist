package bootstrap

import (
	"github.com/Vladislav-Evg-Sid/wishlist/server/config"
	"github.com/Vladislav-Evg-Sid/wishlist/server/internal/storage/pgstorage"
)

func InitPgStorage(dbconfig *config.DatabaseConfig) *pgstorage.PgStorage {
	pgStorage, err := pgstorage.NewPgStorage(dbconfig)
	if err != nil {
		panic(err)
	}
	return pgStorage
}
