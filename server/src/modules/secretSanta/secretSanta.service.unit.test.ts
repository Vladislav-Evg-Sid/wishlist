import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";
import type { Knex } from "knex";

import type {
  SecretSantaRepositoryInterface,
  SecretSantaServiceInterface,
} from "./secretSanta.di.ts";
import type { UUID } from "../../types/shared.ts";
import {
  ForbidenError,
  NotFoundError,
  UnprocessableEntityError,
} from "../../shared/errors.ts";
import type {
  SecretSantaTeam,
  SecretSantaTeamData,
  SecretSantaTeamInfo,
} from "./secretSanta.types.js";

// Мокаем функции
const createTeamMock = jest.fn<SecretSantaRepositoryInterface["createTeam"]>();
const findUserTeamsMock =
  jest.fn<SecretSantaRepositoryInterface["findUserTeams"]>();
const findTeamInfoMock =
  jest.fn<SecretSantaRepositoryInterface["findTeamInfo"]>();
const updateTeamDataMock =
  jest.fn<SecretSantaRepositoryInterface["updateTeamData"]>();
const deleteTeamMock = jest.fn<SecretSantaRepositoryInterface["deleteTeam"]>();
const addTeamMemberMock =
  jest.fn<SecretSantaRepositoryInterface["addTeamMember"]>();

class SecretSantaRepository implements SecretSantaRepositoryInterface {
  constructor(
    public readonly createTeam: SecretSantaRepositoryInterface["createTeam"],
    public readonly findUserTeams: SecretSantaRepositoryInterface["findUserTeams"],
    public readonly findTeamInfo: SecretSantaRepositoryInterface["findTeamInfo"],
    public readonly updateTeamData: SecretSantaRepositoryInterface["updateTeamData"],
    public readonly deleteTeam: SecretSantaRepositoryInterface["deleteTeam"],
    public readonly addTeamMember: SecretSantaRepositoryInterface["addTeamMember"],
  ) {}
}
const secretSantaRepository = new SecretSantaRepository(
  createTeamMock,
  findUserTeamsMock,
  findTeamInfoMock,
  updateTeamDataMock,
  deleteTeamMock,
  addTeamMemberMock,
);

const trxMock = {} as Knex.Transaction;
const dbMock = {
  transaction: jest.fn(
    async (callback: (trx: Knex.Transaction) => Promise<unknown>) => {
      return callback(trxMock);
    },
  ),
};

// Мокаем импорты
jest.unstable_mockModule("../../db/knex.js", () => ({
  db: dbMock,
}));

// Импорт тестируемых модулей после подмены импортов на моки
let secretSantaService: SecretSantaServiceInterface;
beforeAll(async () => {
  const service = await import("./secretSanta.service.js");
  secretSantaService = new service.SecretSantaService(secretSantaRepository);
});

describe("secret Santa service", () => {
  const exampleUUID = "00000000-0000-0000-0000-000000000000" as UUID;
  const userID = "00000000-0000-0000-0000-000000000001" as UUID;
  const teamID = "00000000-0000-0000-0000-000000000002" as UUID;
  beforeEach(() => {
    jest.resetAllMocks();
    dbMock.transaction.mockImplementation(async (callback) => {
      return callback(trxMock);
    });
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-12-01T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("getUserTeams", () => {
    test("returns empty teams when user has no teams", async () => {
      findUserTeamsMock.mockResolvedValue([]);

      await expect(secretSantaService.getUserTeams(userID)).resolves.toEqual(
        [],
      );

      expect(findUserTeamsMock).toHaveBeenCalledWith(userID);
    });

    test("returns user's teams", async () => {
      const teams: SecretSantaTeam[] = [
        {
          id: teamID,
          title: "Название команды",
          membersCount: 3,
          createdDate: new Date("2026-12-01T00:00:00Z"),
          deliveryDate: new Date("2026-12-31T00:00:00Z"),
          stage: "create-team",
        },
        {
          id: exampleUUID,
          title: "Другая команда",
          membersCount: 5,
          createdDate: new Date("2026-11-01T00:00:00Z"),
          deliveryDate: new Date("2026-12-25T00:00:00Z"),
          stage: "finding-gift",
        },
      ];
      findUserTeamsMock.mockResolvedValue(teams);

      await expect(secretSantaService.getUserTeams(userID)).resolves.toEqual(
        teams,
      );

      expect(findUserTeamsMock).toHaveBeenCalledWith(userID);
      expect(findUserTeamsMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateTeam", () => {
    const teamInfo: SecretSantaTeamInfo = {
      ID: teamID,
      name: "Название команды",
      deliveryDate: new Date("2026-12-25T00:00:00Z"),
      creatorID: userID,
    };
    const teamData: SecretSantaTeamData = {
      teamName: "Новое название команды",
      deliveryDate: new Date("2026-12-31T00:00:00Z"),
    };

    test("throw when team does not exist", async () => {
      findTeamInfoMock.mockResolvedValue(null);

      await expect(
        secretSantaService.updateTeam(userID, teamID, teamData),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findTeamInfoMock).toHaveBeenCalledWith(teamID);
      expect(updateTeamDataMock).not.toHaveBeenCalled();
    });

    test("throw when user is not creator", async () => {
      findTeamInfoMock.mockResolvedValue({
        ...teamInfo,
        creatorID: exampleUUID,
      });

      await expect(
        secretSantaService.updateTeam(userID, teamID, teamData),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(findTeamInfoMock).toHaveBeenCalledWith(teamID);
      expect(updateTeamDataMock).not.toHaveBeenCalled();
    });

    test("success update team when user is creator", async () => {
      findTeamInfoMock.mockResolvedValue(teamInfo);
      updateTeamDataMock.mockResolvedValue();

      await expect(
        secretSantaService.updateTeam(userID, teamID, teamData),
      ).resolves.toBeUndefined();

      expect(findTeamInfoMock).toHaveBeenCalledWith(teamID);
      expect(updateTeamDataMock).toHaveBeenCalledWith(
        teamID,
        teamData.teamName,
        teamData.deliveryDate,
      );
      expect(updateTeamDataMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteTeam", () => {
    const teamInfo: SecretSantaTeamInfo = {
      ID: teamID,
      name: "Название команды",
      deliveryDate: new Date("2026-12-31T00:00:00Z"),
      creatorID: userID,
    };

    test("throw when team does not exist", async () => {
      findTeamInfoMock.mockResolvedValue(null);

      await expect(
        secretSantaService.deleteTeam(userID, teamID),
      ).rejects.toBeInstanceOf(NotFoundError);

      expect(findTeamInfoMock).toHaveBeenCalledWith(teamID);
      expect(deleteTeamMock).not.toHaveBeenCalled();
    });

    test("throw when user is not creator", async () => {
      findTeamInfoMock.mockResolvedValue({
        ...teamInfo,
        creatorID: exampleUUID,
      });

      await expect(
        secretSantaService.deleteTeam(userID, teamID),
      ).rejects.toBeInstanceOf(ForbidenError);

      expect(findTeamInfoMock).toHaveBeenCalledWith(teamID);
      expect(deleteTeamMock).not.toHaveBeenCalled();
    });

    test("success delete team when user is creator", async () => {
      findTeamInfoMock.mockResolvedValue(teamInfo);
      deleteTeamMock.mockResolvedValue();

      await expect(
        secretSantaService.deleteTeam(userID, teamID),
      ).resolves.toBeUndefined();

      expect(findTeamInfoMock).toHaveBeenCalledWith(teamID);
      expect(deleteTeamMock).toHaveBeenCalledWith(teamID);
      expect(deleteTeamMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("createTeam", () => {
    const teamName = "Название команды";
    const deliveryDateAfterNow = new Date("2026-12-31T00:00:00Z");
    const deliveryDateBeforeNow = new Date("2026-12-01T00:00:00Z");

    test("throw with create team with delivery date before now", async () => {
      createTeamMock.mockResolvedValue(teamID);
      addTeamMemberMock.mockResolvedValue();

      await expect(
        secretSantaService.createTeam(userID, {
          teamName,
          deliveryDate: deliveryDateBeforeNow,
        }),
      ).rejects.toBeInstanceOf(UnprocessableEntityError);

      expect(createTeamMock).not.toHaveBeenCalled();
      expect(addTeamMemberMock).not.toHaveBeenCalled();
    });

    test("succes create team", async () => {
      createTeamMock.mockResolvedValue(teamID);
      addTeamMemberMock.mockResolvedValue();

      await expect(
        secretSantaService.createTeam(userID, {
          teamName,
          deliveryDate: deliveryDateAfterNow,
        }),
      ).resolves.toBeUndefined();

      expect(createTeamMock).toHaveBeenCalledWith(
        userID,
        teamName,
        deliveryDateAfterNow,
        expect.anything(),
      );
      expect(addTeamMemberMock).toHaveBeenCalledWith(
        userID,
        teamID,
        expect.anything(),
      );
    });
  });
});
