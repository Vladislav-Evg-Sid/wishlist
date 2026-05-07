package models

// CreateUserRequest — тело запроса для создания пользователя.
type CreateUserRequest struct {
	Email    string `json:"email" binding:"required,email" example:"user@example.com"`
	Username string `json:"username" binding:"required,min=3" example:"vlad"`
	Password string `json:"password" binding:"required,min=8" example:"password123"`
}

// UserResponse — ответ API с данными пользователя.
type UserResponse struct {
	ID       int64  `json:"id" example:"1"`
	Email    string `json:"email" example:"user@example.com"`
	Username string `json:"username" example:"vlad"`
}

// ErrorResponse — стандартный ответ с ошибкой.
type ErrorResponse struct {
	Error string `json:"error" example:"invalid request body"`
}

// MessageResponse — простой JSON-ответ.
type MessageResponse struct {
	Message string `json:"message" example:"pong"`
}
