package auth

import "github.com/Vladislav-Evg-Sid/wishlist/server/internal/models"

type AuthService interface {
	Authorize(userData *models.AuthorizeRequest) (*models.AuthorizeResult, error)
}

type AuthAPI struct {
	authService AuthService
}

func NewAuthAPI(authService AuthService) *AuthAPI {
	return &AuthAPI{
		authService: authService,
	}
}
