export const TABLES = {
  users: "users",
  groups: "groups",
  group_member: "group_member",
  wishlist: "wishlist",
  card: "card",
} as const;

export const USER_COLUMNS = {
  id: "id",
  username: "username",
  password_hash: "password_hash",
  created_at: "created_at",
  updated_at: "updated_at",
} as const;

export const GROUPS_COLUMNS = {
  id: "id",
  title: "title",
  creator_id: "creator_id",
  created_at: "created_at",
} as const;

export const GROUP_MEMBER_COLUMNS = {
  group_id: "group_id",
  member_id: "member_id",
} as const;

export const WISHILST_COLUMNS = {
  id: "id",
  title: "title",
  group_id: "group_id",
  creator_id: "creator_id",
  created_at: "created_at",
  is_deleted: "is_deleted",
} as const;

export const CARD_COLUMNS = {
  id: "id",
  title: "title",
  wishlist_id: "wishlist_id",
  description: "description",
  status: "status",
  creator_id: "creator_id",
} as const;

export type statuses = "Новая" | "Завершена";
