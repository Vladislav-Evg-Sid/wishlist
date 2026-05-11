package auth

import (
	"context"

	"github.com/Vladislav-Evg-Sid/wishlist/server/internal/models"
)

type AuthStorage interface {
	GetUserByName(ctx context.Context, userName string) ([]*models.AuthorizeUserData, error)
}

type AuthService struct {
	authStorage AuthStorage
}

func NewAuthService(authStorage AuthStorage) *AuthService {
	return &AuthService{
		authStorage: authStorage,
	}
}
