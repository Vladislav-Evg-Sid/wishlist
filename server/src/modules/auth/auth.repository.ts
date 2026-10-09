import { Injectable } from "@nestjs/common";

import { db } from "../../db/knex.js";
import { TABLES, USER_COLUMNS } from "../../db/schema.js";
import type { UUID } from "../../types/shared.js";
import type { UserRaw } from "./auth.repository.dto.js";
import type { User } from "./auth.types.js";
import type { AuthRepositoryInterface } from "./auth.di.js";

@Injectable()
export class AuthRepository implements AuthRepositoryInterface {
  async findUserByEmail(email: string): Promise<User | undefined> {
    return db(TABLES.users)
      .select({
        id: USER_COLUMNS.id,
        email: USER_COLUMNS.email,
        username: USER_COLUMNS.username,
        userHash: USER_COLUMNS.user_hash,
        passwordHash: USER_COLUMNS.password_hash,
      })
      .where({ [USER_COLUMNS.email]: email })
      .first();
  }

  async findUserByID(id: UUID): Promise<User> {
    return db(TABLES.users)
      .select(
        USER_COLUMNS.id,
        USER_COLUMNS.email,
        USER_COLUMNS.username,
        USER_COLUMNS.user_hash,
        USER_COLUMNS.password_hash,
      )
      .where({ [USER_COLUMNS.id]: id })
      .first();
  }

  async createUser(
    username: string,
    email: string,
    passwordHash: string,
    user_hash: number,
  ): Promise<UserRaw | undefined> {
    const newUser = await db<UserRaw>(TABLES.users)
      .insert({
        [USER_COLUMNS.username]: username,
        [USER_COLUMNS.user_hash]: user_hash,
        [USER_COLUMNS.email]: email,
        [USER_COLUMNS.password_hash]: passwordHash,
      })
      .returning("*");
    return newUser[0];
  }

  async findMaxUserHash(username: string): Promise<number> {
    const maxUserHash = await db(TABLES.users)
      .max(USER_COLUMNS.user_hash)
      .where({ [USER_COLUMNS.username]: username })
      .first();

    if (!maxUserHash) {
      return 0;
    }

    if (maxUserHash.max === null) {
      return 0;
    }

    return maxUserHash.max;
  }
}
