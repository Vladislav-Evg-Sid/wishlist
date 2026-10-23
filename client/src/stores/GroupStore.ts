import { makeAutoObservable, runInAction } from "mobx";
import { toast } from "react-toastify";

import {
  changeCreator,
  createGroup,
  createInviteCode,
  deleteMember,
  getUserGroups,
  inviteGroupByCode,
} from "../api/groups";
import type { GroupData } from "../types/groups";
import { DOMAIN } from "../env";

export class GroupStore {
  groups: GroupData[] = [];
  loadGroupInfo: () => Promise<void> = async () => {};

  constructor(loadGroupUsersList?: () => Promise<void>) {
    makeAutoObservable(this);

    this.loadUserGroups();
    if (loadGroupUsersList) {
      this.loadGroupInfo = loadGroupUsersList;
    }
  }

  async loadUserGroups() {
    try {
      const userGroups = await getUserGroups();

      runInAction(() => {
        this.groups = userGroups;
      });
    } catch (error) {
      runInAction(() => {
        if (error instanceof Error) {
          switch (error.message) {
            case "Failed to fetch":
              toast.error("Сервис недоступен.\nПопробуйте позже");
              break;
            default:
              toast.error("Неизвестная ошибка.\nНе удалось загрузить группы");
              console.error(error.message);
              break;
          }
        } else {
          console.error(error);
        }
      });
    }
  }

  async createGroup(groupName: string) {
    try {
      await createGroup(groupName);
      toast.success("Группа успешно создана");
      this.loadUserGroups();
    } catch (error) {
      runInAction(() => {
        if (error instanceof Error) {
          switch (error.message) {
            case "Failed to fetch":
              toast.error("Сервис недоступен.\nПопробуйте позже");
              break;
            default:
              toast.error("Неизвестная ошибка.\nНе удалось создать группу");
              console.error(error.message);
              break;
          }
        } else {
          console.error(error);
        }
      });
    }
  }

  async createInviteLink(
    groupID: string,
    ttl?: number,
    inviteLimit?: number,
  ): Promise<string> {
    if (!ttl && !inviteLimit) {
      toast.info("Код не может существовать без ограничений!");
      return "";
    }
    try {
      const code = await createInviteCode(groupID, ttl, inviteLimit);
      return `${DOMAIN}/invite/${code}`;
    } catch (error) {
      runInAction(() => {
        if (error instanceof Error) {
          switch (error.message) {
            case "User not a creator":
              toast.error(
                "Отказано в доступе!\nВы не являетесь создателем группы",
              );
              break;
            case "Failed to fetch":
              toast.error("Сервис недоступен.\nПопробуйте позже");
              break;
            default:
              toast.error("Неизвестная ошибка.\nНе удалось создать группу");
              console.error(error.message);
              break;
          }
        } else {
          console.error(error);
        }
      });
    }
    return "";
  }

  async inviteGroupByLink(code?: string) {
    if (!code) {
      toast.error("Необходим код");
      return;
    }
    try {
      const groupID = await inviteGroupByCode(code);
      toast.success("Группа добавленна");
      return groupID;
    } catch (error) {
      runInAction(() => {
        if (error instanceof Error) {
          switch (error.message) {
            case "Failed to fetch":
              toast.error("Сервис недоступен.\nПопробуйте позже");
              break;
            default:
              toast.error(
                "Неизвестная ошибка.\nНе удалось подключиться к группе",
              );
              console.error(error.message);
              break;
          }
        } else {
          console.error(error);
        }
      });
    }
  }

  async changeCreator(groupID: string, newCreatorID: string) {
    try {
      await changeCreator(groupID, newCreatorID);
      await this.loadGroupInfo();
    } catch (error) {
      runInAction(() => {
        if (error instanceof Error) {
          switch (error.message) {
            case "Failed to fetch":
              toast.error("Сервис недоступен.\nПопробуйте позже");
              break;
            default:
              toast.error(
                "Неизвестная ошибка.\nНе удалось изменить создателя к группе",
              );
              console.error(error.message);
              break;
          }
        } else {
          console.error(error);
        }
      });
    }
  }

  async deleteMember(groupID: string, memberID?: string) {
    if (!memberID) {
      toast.error("Не удалось получить id пользователя для удаления");
      return;
    }
    try {
      await deleteMember(groupID, memberID);
      await this.loadGroupInfo();
      await this.loadUserGroups();
      toast.success("Участник успешно удалён");
    } catch (error) {
      runInAction(() => {
        if (error instanceof Error) {
          switch (error.message) {
            case "Failed to fetch":
              toast.error("Сервис недоступен.\nПопробуйте позже");
              break;
            default:
              toast.error(
                "Неизвестная ошибка.\nНе удалось удалить участника группы",
              );
              console.error(error.message);
              break;
          }
        } else {
          console.error(error);
        }
      });
    }
  }
}
