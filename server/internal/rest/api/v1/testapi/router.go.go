package testapi

import "github.com/gin-gonic/gin"

func RegisterRouters(router *gin.RouterGroup) {
	testapi := router.Group("/testapi")

	testapi.GET("/ping", pingHandler)
	testapi.GET("/users/:id", getUserByIDHandler)
	testapi.POST("/echo", echoHandler)
	testapi.POST("/users", createUserHandler)
}
