package bootstrap

import "github.com/Vladislav-Evg-Sid/wishlist/server/internal/services/auth"

func InitAuthService(authStorage auth.AuthStorage) *auth.AuthService {
	return auth.NewAuthService(authStorage)
}
