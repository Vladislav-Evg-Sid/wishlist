package main

import (
	"fmt"

	"github.com/Vladislav-Evg-Sid/wishlist/server/config"
	"github.com/Vladislav-Evg-Sid/wishlist/server/internal/bootstrap"
)

func main() {
	cfg, err := config.LoadConfig("config.yml")
	if err != nil {
		panic(fmt.Sprintf("ошибка парсинга конфига: %v", err))
	}

	pgStorage := bootstrap.InitPgStorage(&cfg.Database)
	authService := bootstrap.InitAuthService(pgStorage)
	authAPI := bootstrap.InitAuthAPI(authService)
	server := bootstrap.InitApiServer(cfg.Server.Host, cfg.Server.Port, authAPI)

	server.Run()
}
