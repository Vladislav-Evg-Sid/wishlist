import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from "@jest/globals";

import type {
  SecretSantaRepositoryInterface,
  SecretSantaServiceInterface,
} from "./secretSanta.di.ts";
import type { Knex } from "knex";
import type { UUID } from "../../types/shared.ts";
import { UnprocessableEntityError } from "../../shared/errors.ts";

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
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-12-01T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
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
