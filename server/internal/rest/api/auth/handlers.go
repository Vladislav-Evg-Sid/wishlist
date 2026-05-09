package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/Vladislav-Evg-Sid/wishlist/server/internal/models"
)

// авторизация godoc
//
//	@Summary		Авторизация пользователя
//	@Description	Получает логин и пароль пользователя,
//	@Description	проверяет пользователя и возвращает true/false
//	@Tags			auth
//	@Accept			json
//	@Produce		json
//	@Param			request	body		models.AuthorizeRequest	true	"Данные пользователя"
//	@Success		201		{object}	models.AuthorizeResponse
//	@Failure		400		{object}	models.ErrorResponse
//	@Router			/api/auth/authorize [post]
func (a *AuthAPI) Authorize(c *gin.Context) {
	var request models.AuthorizeRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: err.Error(),
		})
		return
	}

	authRes, err := a.authService.Authorize(&request)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, mapAuthRes2AuthResponse(authRes))
}

func mapAuthRes2AuthResponse(authInfo *models.AuthorizeResult) models.AuthorizeResponse {
	return models.AuthorizeResponse{
		IsAuthorize: authInfo.IsAuthorize,
	}
}
