package auth

type AuthStorage interface {
}

type AuthService struct {
	authStorage AuthStorage
}

func NewAuthService(authStorage AuthStorage) *AuthService {
	return &AuthService{
		authStorage: authStorage,
	}
}
