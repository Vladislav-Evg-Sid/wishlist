package auth

import (
	"context"
	"fmt"

	"github.com/Vladislav-Evg-Sid/wishlist/server/internal/models"
)

func (a *AuthService) Authorize(ctx context.Context, userData *models.AuthorizeRequest) (*models.AuthorizeResult, error) {
	users, err := a.authStorage.GetUserByName(ctx, userData.UserName)
	if err != nil {
		return nil, fmt.Errorf("Ошибка получения данных пользователя: %s", err)
	}

	if len(users) == 0 {
		return &models.AuthorizeResult{
			IsAuthorize: false,
			AuthError:   "Неверное имя пользователя",
		}, nil
	}

	for _, user := range users {
		if user.HashPassword == userData.Password { // TODO: Добавить хеширование пароля
			return &models.AuthorizeResult{
				IsAuthorize: true,
				AuthError:   "",
			}, nil
		}
	}

	return &models.AuthorizeResult{
			IsAuthorize: false,
			AuthError:   "Неверный пароль для текущего имени пользователя",
		},
		nil
}
