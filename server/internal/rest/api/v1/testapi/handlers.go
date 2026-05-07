package testapi

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"github.com/Vladislav-Evg-Sid/wishlist/server/internal/models"
)

// pingHandler godoc
// @Summary Проверка доступности API
// @Description Возвращает простой JSON-ответ.
// @Tags system
// @Produce json
// @Success 200 {object} MessageResponse
// @Router /api/v1/ping [get]
func pingHandler(c *gin.Context) {
	// Пример "чистого JSON" без отдельной структуры.
	c.JSON(http.StatusOK, gin.H{
		"message": "pong",
	})
}

// getUserByIDHandler godoc
// @Summary Получить пользователя по ID
// @Description Возвращает пользователя по идентификатору.
// @Tags users
// @Produce json
// @Param id path int true "ID пользователя"
// @Success 200 {object} UserResponse
// @Failure 400 {object} ErrorResponse
// @Router /api/v1/users/{id} [get]
func getUserByIDHandler(c *gin.Context) {
	idParam := c.Param("id")

	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "invalid user id",
		})
		return
	}

	// Пока без БД, просто имитируем найденного пользователя.
	user := models.UserResponse{
		ID:       id,
		Email:    "user@example.com",
		Username: "vlad",
	}

	c.JSON(http.StatusOK, user)
}

// echoHandler godoc
// @Summary Вернуть переданный JSON
// @Description Принимает произвольный JSON и возвращает его обратно.
// @Tags debug
// @Accept json
// @Produce json
// @Param request body object true "Любой JSON"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {object} ErrorResponse
// @Router /api/v1/echo [post]
func echoHandler(c *gin.Context) {
	var body map[string]interface{}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: "invalid json body",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"received": body,
	})
}

// createUserHandler godoc
// @Summary Создать пользователя
// @Description Принимает JSON, биндингует его в Go-структуру и возвращает созданного пользователя.
// @Tags users
// @Accept json
// @Produce json
// @Param request body CreateUserRequest true "Данные пользователя"
// @Success 201 {object} UserResponse
// @Failure 400 {object} ErrorResponse
// @Router /api/v1/users [post]
func createUserHandler(c *gin.Context) {
	var request models.CreateUserRequest

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{
			Error: err.Error(),
		})
		return
	}

	// Пока без БД, просто имитируем создание пользователя.
	user := models.UserResponse{
		ID:       1,
		Email:    request.Email,
		Username: request.Username,
	}

	c.JSON(http.StatusCreated, user)
}
