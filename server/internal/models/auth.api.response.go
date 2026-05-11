package models

type AuthorizeResponse struct {
	IsAuthorize bool   `json:"is_authorize"`
	AuthError   string `json:"auth_error"`
}
