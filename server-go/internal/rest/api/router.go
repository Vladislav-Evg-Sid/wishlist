package api

import (
	"github.com/gin-gonic/gin"
)

func RegisterRouters(router *gin.Engine, authAPI AuthAPI) {
	api := router.Group("/api")

	authAPI.RegisterRouters(api)
}
