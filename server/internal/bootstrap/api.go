package bootstrap

import (
	"github.com/Vladislav-Evg-Sid/wishlist/server/internal/rest/api"
	auth_api "github.com/Vladislav-Evg-Sid/wishlist/server/internal/rest/api/auth"
	auth_servic "github.com/Vladislav-Evg-Sid/wishlist/server/internal/services/auth"
)

func InitApiServer(host, port string, authAPI *auth_api.AuthAPI) *api.Server {
	return api.NewServer(host, port, authAPI)
}

func InitAuthAPI(authService *auth_servic.AuthService) *auth_api.AuthAPI {
	return auth_api.NewAuthAPI(authService)
}
