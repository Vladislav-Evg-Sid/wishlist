package api

import (
	"github.com/gin-gonic/gin"

	_ "github.com/Vladislav-Evg-Sid/wishlist/server/internal/rest/swagger"

	v1 "github.com/Vladislav-Evg-Sid/wishlist/server/internal/rest/api/v1"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type Server struct {
	router *gin.Engine
	host   string
	port   string
}

func NewServer(host string, port string) *Server {
	server := &Server{
		router: gin.Default(),
		host:   host,
		port:   port,
	}

	server.registerRouters()

	if err := server.router.Run(":" + port); err != nil {
		panic(err)
	}

	return server
}

func (s *Server) registerRouters() {
	s.router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	v1.RegisterRouters(s.router)
}
