package auth

import "github.com/Vladislav-Evg-Sid/wishlist/server/internal/models"

func (a *AuthService) Authorize(userData *models.AuthorizeRequest) (*models.AuthorizeResult, error) {
	// TODO: Обратиться в БД и спросить про пользователя
	return &models.AuthorizeResult{
			IsAuthorize: true,
		},
		nil
}
