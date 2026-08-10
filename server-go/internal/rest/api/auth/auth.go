package auth

import (
	"context"

	"github.com/Vladislav-Evg-Sid/wishlist/server/internal/models"
)

type AuthService interface {
	Authorize(ctx context.Context, userData *models.AuthorizeRequest) (*models.AuthorizeResult, error)
}

type AuthAPI struct {
	authService AuthService
}

func NewAuthAPI(authService AuthService) *AuthAPI {
	return &AuthAPI{
		authService: authService,
	}
}
