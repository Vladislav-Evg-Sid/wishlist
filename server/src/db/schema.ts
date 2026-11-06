export const TABLES = {
  users: "users",
  groups: "groups",
  group_member: "group_member",
  wishlist: "wishlist",
  card: "card",
  refresh_tokens: "refresh_tokens",
  secret_santa_team: "secret_santa_team",
  secret_santa_members: "secret_santa_members",
  secret_santa_member_wish: "secret_santa_member_wish",
} as const;

export type statuses = "Новая" | "Завершена";

export const USER_COLUMNS = {
  id: "id",
  username: "username",
  user_hash: "user_hash",
  email: "email",
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
  icon: "icon",
  href: "href",
  reserved_by: "reserved_by",
  created_at: "created_at",
  creator_id: "creator_id",
} as const;

export const REFRESH_TOKENS_COLUMNS = {
  id: "id",
  user_id: "user_id",
  jti: "jti",
  user_agent: "user_agent",
  created_at: "created_at",
  expires_at: "expires_at",
  revoked_at: "revoked_at",
} as const;

export type SecretSantaTeamStage =
  | "create-team"
  | "finding-gift"
  | "gift-ready"
  | "delivery";

export const SS_TEAM_COLUMNS = {
  id: "id",
  title: "title",
  creator_id: "creator_id",
  stage: "stage",
  delivery_date: "delivery_date",
  created_at: "created_at",
} as const;

export const SS_MEMBERS_COLUMNS = {
  id: "id",
  recipient_id: "recipient_id",
  member_id: "member_id",
  team_id: "team_id",
  is_gift_prepaired: "is_gift_prepaired",
} as const;

export const SS_MEMBER_WISH_COLUMNS = {
  member_id: "member_id",
  wish_id: "wish_id",
} as const;
