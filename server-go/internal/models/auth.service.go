package models

import (
	"time"

	"github.com/gofrs/uuid/v5"
)

type AuthorizeResult struct {
	IsAuthorize bool
	AuthError   string
}

type AuthorizeUser struct {
	Name         string
	HashPassword string
}

type AuthorizeUserData struct {
	Id           uuid.UUID
	Name         string
	HashPassword string
	CreatedAt    time.Time
	UpdatedAt    *time.Time
}
