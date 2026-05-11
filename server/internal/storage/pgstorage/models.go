package pgstorage

const (
	schema_name = "public"

	users_table            = "users"
	users_column_id        = "id"
	users_column_name      = "name"
	users_column_password  = "password_hash"
	users_column_createdAt = "created_at"
	users_column_updatedAt = "updated_at"

	groups_table            = "groups"
	groups_column_id        = "id"
	groups_column_name      = "name"
	groups_column_adminId   = "admin_id"
	groups_column_createdAt = "created_at"

	groupMember_table          = "group_member"
	groupMember_column_id      = "id"
	groupMember_column_groupId = "group_id"
	groupMember_column_userId  = "user_id"

	wishlists_table            = "wishlists"
	wishlists_column_id        = "id"
	wishlists_column_name      = "name"
	wishlists_column_groupId   = "group_id"
	wishlists_column_creatodId = "creator_id"
	wishlists_column_createdAt = "created_at"
	wishlists_column_deletedAt = "deletedAt"

	statuses_table              = "statuses"
	statuses_column_id          = "id"
	statuses_column_description = "description"

	entrys_table              = "entrys"
	entrys_column_id          = "id"
	entrys_column_wishlistId  = "wishlist_id"
	entrys_column_statusId    = "status_id"
	entrys_column_creatorId   = "creator_id"
	entrys_column_title       = "title"
	entrys_column_description = "description"
)
