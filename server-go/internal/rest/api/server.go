package api

import (
	"fmt"

	"github.com/gin-gonic/gin"

	_ "github.com/Vladislav-Evg-Sid/wishlist/server/internal/rest/swagger"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
)

type AuthAPI interface {
	RegisterRouters(router *gin.RouterGroup)
	Authorize(c *gin.Context)
}

type Server struct {
	router  *gin.Engine
	host    string
	port    string
	authAPI AuthAPI
}

func NewServer(host, port string, authAPI AuthAPI) *Server {
	server := &Server{
		router:  gin.Default(),
		host:    host,
		port:    port,
		authAPI: authAPI,
	}

	server.registerRouters()

	return server
}

func (s *Server) registerRouters() {
	s.router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	RegisterRouters(s.router, s.authAPI)
}

func (s *Server) Run() error {
	address := fmt.Sprintf("%s:%s", s.host, s.port)
	return s.router.Run(address)
}
