package pgstorage

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"
	"github.com/Vladislav-Evg-Sid/wishlist/server/internal/models"
)

func (s *PgStorage) GetUserByName(ctx context.Context, userName string) ([]*models.AuthorizeUserData, error) {
	query := getQueryCreateGetUserByName(userName)
	queryText, args, err := query.ToSql()
	if err != nil {
		return nil, fmt.Errorf("ошибка формирования запроса: %s", err)
	}

	fmt.Println("********************************************************")
	fmt.Println(queryText, userName)
	fmt.Println("********************************************************")

	rows, err := s.db.Query(ctx, queryText, args...)
	if err != nil {
		return nil, fmt.Errorf("ошибка выполнения запроса: %s", err)
	}

	var users []*models.AuthorizeUserData
	defer rows.Close()
	for rows.Next() {
		var u models.AuthorizeUserData
		if err = rows.Scan(&u.Id, &u.Name, &u.HashPassword, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, fmt.Errorf("ошибка парсинга результата запроса: %s", err)
		}

		users = append(users, &u)
	}

	return users, nil
}

func getQueryCreateGetUserByName(userName string) squirrel.Sqlizer {
	return squirrel.Select(
		fmt.Sprintf(`%s.%s`, users_table, users_column_id),
		fmt.Sprintf(`%s.%s`, users_table, users_column_name),
		fmt.Sprintf(`%s.%s`, users_table, users_column_password),
		fmt.Sprintf(`%s.%s`, users_table, users_column_createdAt),
		fmt.Sprintf(`%s.%s`, users_table, users_column_updatedAt),
	).From(
		users_table,
	).Where(squirrel.Eq{
		fmt.Sprintf(`%s.%s`, users_table, users_column_name): userName,
	}).PlaceholderFormat(squirrel.Dollar)
}
