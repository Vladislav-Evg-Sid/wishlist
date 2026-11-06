import { describe, expect, test } from "@jest/globals";

import { SecretSantaRepository } from "./secretSanta.repository.js";
import {
  createTeam,
  createTeamWithCreatorID,
  addTeamMember,
} from "../../../tests/integration/fixtures/secretSanta.js";
import { createUser } from "../../../tests/integration/fixtures/users.js";
import { db } from "../../db/knex.js";
import { SS_MEMBERS_COLUMNS, SS_TEAM_COLUMNS, TABLES } from "../../db/schema.js";
import type { UUID } from "../../types/shared.js";

const secretSantaRepository = new SecretSantaRepository();

describe("secret Santa repository", () => {
  const missingID = "00000000-0000-0000-0000-000000000000" as UUID;

  describe("createTeam", () => {
    const teamName = "Название команды";
    const deliveryDate = new Date(2026, 11, 31);

    test("success create team", async () => {
      const creatorID = await createUser();

      const teamID = await secretSantaRepository.createTeam(
        creatorID,
        teamName,
        deliveryDate,
      );

      const teams = await db(TABLES.secret_santa_team).select("*");
      expect(teams).toHaveLength(1);
      expect(teamID).toBe(teams[0][SS_TEAM_COLUMNS.id]);
      expect(teams[0]).toMatchObject({
        [SS_TEAM_COLUMNS.title]: teamName,
        [SS_TEAM_COLUMNS.creator_id]: creatorID,
        [SS_TEAM_COLUMNS.delivery_date]: new Date(2026, 11, 31),
        [SS_TEAM_COLUMNS.stage]: "create-team",
        [SS_TEAM_COLUMNS.created_at]: expect.any(Date),
      });
    });

    test("throw when creator does not exist", async () => {
      await expect(
        secretSantaRepository.createTeam(missingID, teamName, deliveryDate),
      ).rejects.toMatchObject({
        code: "23503",
        constraint: "secret_santa_team_creator_id_foreign",
      });
    });

    test("rolls back team and membership with transaction", async () => {
      const creatorID = await createUser();
      const error = new Error("Rollback team creation");

      await expect(db.transaction(async (trx) => {
        const teamID = await secretSantaRepository.createTeam(
          creatorID, teamName, deliveryDate, trx,
        );
        await secretSantaRepository.addTeamMember(creatorID, teamID, trx);
        const team = await secretSantaRepository.findTeamInfo(teamID, trx);
        expect(team).toMatchObject({ id: teamID, creatorID });
        throw error;
      })).rejects.toBe(error);

      expect(await db(TABLES.secret_santa_team).select("*")).toEqual([]);
      expect(await db(TABLES.secret_santa_members).select("*")).toEqual([]);
    });
  });

  describe("findUserTeams", () => {
    test("returns empty teams when user does not exist", async () => {
      const { creatorID, teamID } = await createTeam();
      await addTeamMember(creatorID, teamID);

      const teams = await secretSantaRepository.findUserTeams(missingID);

      expect(teams).toEqual([]);
    });

    test("returns empty teams when user has no memberships", async () => {
      const { creatorID } = await createTeam();

      const teams = await secretSantaRepository.findUserTeams(creatorID);

      expect(teams).toEqual([]);
    });

    test("returns only joined teams with total member counts", async () => {
      const { creatorID, teamID } = await createTeam();
      const memberID = await createUser({
        username: "Member", email: "member@example.com",
      });
      const secondTeamID = await createTeamWithCreatorID(creatorID);
      const unrelatedTeamID = await createTeamWithCreatorID(creatorID);
      await addTeamMember(creatorID, teamID);
      await addTeamMember(memberID, teamID);
      await addTeamMember(memberID, secondTeamID);
      await addTeamMember(creatorID, unrelatedTeamID);
      await db(TABLES.secret_santa_team)
        .where(SS_TEAM_COLUMNS.id, secondTeamID)
        .update({ [SS_TEAM_COLUMNS.stage]: "finding-gift" });
      const rows = await db(TABLES.secret_santa_team)
        .whereIn(SS_TEAM_COLUMNS.id, [teamID, secondTeamID]);

      const teams = await secretSantaRepository.findUserTeams(memberID);

      expect(teams).toHaveLength(2);
      expect(teams).toEqual(expect.arrayContaining(rows.map((team) => ({
        id: team.id,
        title: team.title,
        createdDate: team.created_at,
        deliveryDate: team.delivery_date,
        stage: team.stage,
        membersCount: team.id === teamID ? 2 : 1,
      }))));
    });
  });

  describe("findTeamInfo", () => {
    test("returns null when team does not exist", async () => {
      await createTeam();

      const team = await secretSantaRepository.findTeamInfo(missingID);

      expect(team).toBeNull();
    });

    test("returns requested team information", async () => {
      const { creatorID, teamID } = await createTeam();
      const secondTeamID = await createTeamWithCreatorID(creatorID);

      const team = await secretSantaRepository.findTeamInfo(secondTeamID);

      expect(team).toStrictEqual({
        id: secondTeamID,
        name: "Название команды",
        deliveryDate: new Date(2026, 11, 31),
        creatorID,
      });
      expect(team!.id).not.toBe(teamID);
    });
  });

  describe("updateTeamData", () => {
    test("updates only requested team's name and delivery date", async () => {
      const { creatorID, teamID } = await createTeam();
      const otherTeamID = await createTeamWithCreatorID(creatorID);
      const teamBeforeUpdate = await db(TABLES.secret_santa_team)
        .where(SS_TEAM_COLUMNS.id, teamID).first();
      const otherTeamBeforeUpdate = await db(TABLES.secret_santa_team)
        .where(SS_TEAM_COLUMNS.id, otherTeamID).first();
      const teamName = "Новое название команды";
      const deliveryDate = new Date(2027, 0, 10);

      await secretSantaRepository.updateTeamData(teamID, teamName, deliveryDate);

      const team = await db(TABLES.secret_santa_team)
        .where(SS_TEAM_COLUMNS.id, teamID).first();
      const otherTeam = await db(TABLES.secret_santa_team)
        .where(SS_TEAM_COLUMNS.id, otherTeamID).first();
      expect(team).toStrictEqual({
        ...teamBeforeUpdate,
        [SS_TEAM_COLUMNS.title]: teamName,
        [SS_TEAM_COLUMNS.delivery_date]: new Date(2027, 0, 10),
      });
      expect(otherTeam).toStrictEqual(otherTeamBeforeUpdate);
    });

    test("does not change teams when team does not exist", async () => {
      await createTeam();
      const teamsBeforeUpdate = await db(TABLES.secret_santa_team).select("*");

      await secretSantaRepository.updateTeamData(
        missingID, "New name", new Date(2027, 0, 10),
      );

      const teams = await db(TABLES.secret_santa_team).select("*");
      expect(teams).toStrictEqual(teamsBeforeUpdate);
    });
  });

  describe("deleteTeam", () => {
    test("deletes only requested team and preserves creator", async () => {
      const { creatorID, teamID } = await createTeam();
      const otherTeamID = await createTeamWithCreatorID(creatorID);
      const otherTeamBeforeDelete = await db(TABLES.secret_santa_team)
        .where(SS_TEAM_COLUMNS.id, otherTeamID).first();

      await secretSantaRepository.deleteTeam(teamID);

      const teams = await db(TABLES.secret_santa_team).select("*");
      const creator = await db(TABLES.users).where("id", creatorID).first();
      expect(teams).toStrictEqual([otherTeamBeforeDelete]);
      expect(creator).toBeDefined();
    });

    test("does not delete teams when team does not exist", async () => {
      await createTeam();
      const teamsBeforeDelete = await db(TABLES.secret_santa_team).select("*");

      await secretSantaRepository.deleteTeam(missingID);

      const teams = await db(TABLES.secret_santa_team).select("*");
      expect(teams).toStrictEqual(teamsBeforeDelete);
    });

    test("throw when team has members", async () => {
      const { creatorID, teamID } = await createTeam();
      await addTeamMember(creatorID, teamID);

      await expect(secretSantaRepository.deleteTeam(teamID)).rejects.toMatchObject({
        code: "23503",
        constraint: "secret_santa_members_team_id_foreign",
      });

      const team = await db(TABLES.secret_santa_team)
        .where(SS_TEAM_COLUMNS.id, teamID).first();
      expect(team).toBeDefined();
    });
  });

  describe("addTeamMember", () => {
    test("success add member without changing other memberships", async () => {
      const { creatorID, teamID } = await createTeam();
      const otherTeamID = await createTeamWithCreatorID(creatorID);
      await addTeamMember(creatorID, otherTeamID);

      await secretSantaRepository.addTeamMember(creatorID, teamID);

      const members = await db(TABLES.secret_santa_members)
        .where(SS_MEMBERS_COLUMNS.team_id, teamID);
      const otherMembers = await db(TABLES.secret_santa_members)
        .where(SS_MEMBERS_COLUMNS.team_id, otherTeamID);
      expect(members).toHaveLength(1);
      expect(members[0]).toMatchObject({
        [SS_MEMBERS_COLUMNS.id]: expect.any(String),
        [SS_MEMBERS_COLUMNS.member_id]: creatorID,
        [SS_MEMBERS_COLUMNS.team_id]: teamID,
        [SS_MEMBERS_COLUMNS.recipient_id]: null,
        [SS_MEMBERS_COLUMNS.is_gift_prepaired]: false,
      });
      expect(otherMembers).toHaveLength(1);
    });

    test("throw when member does not exist", async () => {
      const { teamID } = await createTeam();

      await expect(
        secretSantaRepository.addTeamMember(missingID, teamID),
      ).rejects.toMatchObject({
        code: "23503",
        constraint: "secret_santa_members_member_id_foreign",
      });
    });

    test("throw when team does not exist", async () => {
      const creatorID = await createUser();

      await expect(
        secretSantaRepository.addTeamMember(creatorID, missingID),
      ).rejects.toMatchObject({
        code: "23503",
        constraint: "secret_santa_members_team_id_foreign",
      });
    });
  });
});
