package auth

import "github.com/gin-gonic/gin"

func (a *AuthAPI) RegisterRouters(router *gin.RouterGroup) {
	testapi := router.Group("/auth")

	testapi.POST("/authorize", a.Authorize)
}
