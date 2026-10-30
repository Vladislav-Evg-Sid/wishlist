import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";

import type { SecretSantaTeamDetails } from "../types/secretSantaTeam";
import type { UUID, UserInfo, UsersListInGroup } from "../types/shared";
import { DOMAIN } from "../env";
import type { SecretSantaStore } from "./SecretSantaStore";

const MOCK_CREATOR: UserInfo = {
  id: "d10f8f16-f004-4721-a248-0be9d4bfd078" as UUID,
  name: "Владислав",
  hash: 1,
};

const MOCK_MEMBERS: UserInfo[] = [
  {
    id: "10000000-0000-0000-0000-000000000002" as UUID,
    name: "Анна Смирнова",
    hash: 1729,
  },
  {
    id: "10000000-0000-0000-0000-000000000003" as UUID,
    name: "Мария Петрова",
    hash: 2841,
  },
  {
    id: "10000000-0000-0000-0000-000000000004" as UUID,
    name: "Иван Соколов",
    hash: 3194,
  },
  {
    id: "10000000-0000-0000-0000-000000000005" as UUID,
    name: "Ольга Кузнецова",
    hash: 4268,
  },
  {
    id: "10000000-0000-0000-0000-000000000006" as UUID,
    name: "Дмитрий Волков",
    hash: 5032,
  },
  {
    id: "10000000-0000-0000-0000-000000000007" as UUID,
    name: "Елена Лебедева",
    hash: 6185,
  },
  {
    id: "10000000-0000-0000-0000-000000000008" as UUID,
    name: "Алексей Попов",
    hash: 7420,
  },
];

const MOCK_USERS_IN_TEAM: UsersListInGroup = {
  creator: MOCK_CREATOR,
  members: MOCK_MEMBERS,
};

const MOCK_TEAM_DETAILS: SecretSantaTeamDetails[] = [
  {
    id: "00000000-0000-0000-0000-000000000000" as UUID,
    title: "Семья · Новый год",
    createdDate: new Date("2026-09-25"),
    deliveryDate: new Date("2026-12-31"),
    stage: 2,
    isCreator: true,
    members: MOCK_USERS_IN_TEAM,
    recipient: MOCK_MEMBERS[0],
    isSantaGiftPrepared: false,
  },
  {
    id: "00000000-0000-0000-0000-000000000001" as UUID,
    title: "Команда Wish Box",
    createdDate: new Date("2026-10-10"),
    deliveryDate: new Date("2026-12-25"),
    stage: 1,
    isCreator: true,
    members: MOCK_USERS_IN_TEAM,
    recipient: null,
    isSantaGiftPrepared: false,
  },
  {
    id: "00000000-0000-0000-0000-000000000002" as UUID,
    title: "Друзья · Рождество",
    createdDate: new Date("2026-09-20"),
    deliveryDate: new Date("2026-12-24"),
    stage: 3,
    isCreator: false,
    members: MOCK_USERS_IN_TEAM,
    recipient: MOCK_MEMBERS[1],
    isSantaGiftPrepared: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000003" as UUID,
    title: "Офис · Новый год",
    createdDate: new Date("2026-09-15"),
    deliveryDate: new Date("2026-12-31"),
    stage: 4,
    isCreator: true,
    members: MOCK_USERS_IN_TEAM,
    recipient: MOCK_MEMBERS[2],
    isSantaGiftPrepared: true,
  },
  {
    id: "00000000-0000-0000-0000-000000000004" as UUID,
    title: "Друзья · Новый год",
    createdDate: new Date("2026-10-20"),
    deliveryDate: new Date("2026-12-31"),
    stage: 1,
    isCreator: false,
    members: MOCK_USERS_IN_TEAM,
    recipient: null,
    isSantaGiftPrepared: false,
  },
];

export class SecretSantaTeamStore {
  secretSantaStore: SecretSantaStore;
  currentTeamID: UUID | undefined;
  currentTeamDetails: SecretSantaTeamDetails | undefined;

  constructor(secretSantaStore: SecretSantaStore) {
    makeAutoObservable(this);
    this.secretSantaStore = secretSantaStore;
  }

  async loadCurrentTeamDetails(): Promise<void> {
    if (!this.currentTeamID) {
      toast.error("ID команды не обнаружен");
      console.error("teamID is undefined");
      return;
    }
    this.currentTeamDetails = MOCK_TEAM_DETAILS.find(
      (team) => team.id === this.currentTeamID,
    ); // TODO: Подключить к API
  }

  async changeTeamByID(teamID: UUID): Promise<void> {
    this.currentTeamID = teamID;
    await this.loadCurrentTeamDetails();
  }

  get teamUsers(): UsersListInGroup | null {
    return this.currentTeamDetails?.members ?? null;
  }

  get daysUntilDelivery(): number {
    if (!this.currentTeamDetails) {
      return 0;
    }

    const milliseconds =
      this.currentTeamDetails.deliveryDate.getTime() - Date.now();
    return Math.ceil(milliseconds / (1000 * 60 * 60 * 24));
  }

  drawTeamMembers() {
    if (!this.currentTeamID) {
      toast.error("Команда не определена");
      return;
    }

    toast.info("Функция жеребьёвки пока не реализована");
  }

  markGiftAsPrepared() {
    if (!this.currentTeamID) {
      toast.error("Команда не определена");
      return;
    }

    toast.info("Функция отметки подарка подготовленным пока не реализована");
  }

  dleteTeam() {
    if (!this.currentTeamID) {
      toast.error("Команда не определена");
      return;
    }

    toast.info("функция роспуска команды пока не доступна");
  }

  async createTeamInviteLink(
    ttl?: number,
    inviteLimit?: number,
  ): Promise<string> {
    if (!this.currentTeamID) {
      toast.error("Команда не определена");
      return "";
    }
    if (!ttl && !inviteLimit) {
      toast.error(
        "Время жизни или количество использований должны быть заданы",
      );
      return "";
    }

    toast.info("Функция создания ссылки пока не реализована");

    return `${DOMAIN}/secret-santa/invite/mock-${this.currentTeamID}`;
  }

  removeTeamMember(memberID: UUID) {
    if (!this.currentTeamID) {
      toast.error("Команда не определена");
      return;
    }

    void memberID;
    toast.info("Функция удаления участника пока не реализована");
  }

  leaveTeam() {
    if (!this.currentTeamID) {
      toast.error("Команда не определена");
      return;
    }

    toast.info("Функция выхода из команды пока не реализована");
  }

  joinTeamByInviteCode(inviteCode: string) {
    void inviteCode;
    toast.info("Функция присоединения к команде пока не реализована");
  }
}
