package v1

import (
	"github.com/Vladislav-Evg-Sid/wishlist/server/internal/rest/api/v1/testapi"
	"github.com/gin-gonic/gin"
)

func RegisterRouters(router *gin.Engine) {
	api := router.Group("/api/v1")

	testapi.RegisterRouters(api)
}
