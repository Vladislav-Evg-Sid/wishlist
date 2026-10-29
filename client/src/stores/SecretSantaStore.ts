import { makeAutoObservable } from "mobx";
import { toast } from "react-toastify";

import type { UpcomingEvent, SecretSantaTeam } from "../types/secretSanta";
import type { UUID } from "../types/shared";
import { createTeam, getUserTeams } from "../api/secretSanta";

const MOCK_TEAMS: SecretSantaTeam[] = [
  {
    id: "00000000-0000-0000-0000-000000000000" as UUID,
    title: "Семья · Новый год",
    membersCount: 8,
    createdDate: new Date("2026-09-25"),
    deliveryDate: new Date("2026-12-31"),
    status: "pairs-ready",
  },
  {
    id: "00000000-0000-0000-0000-000000000001" as UUID,
    title: "Команда Wish Box",
    membersCount: 12,
    createdDate: new Date("2026-10-10"),
    deliveryDate: new Date("2026-12-25"),
    status: "collecting-members",
  },
];

export class SecretSantaStore {
  teams: SecretSantaTeam[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);

    this.loadUserTeams();
  }

  async loadUserTeams() {
    this.teams = MOCK_TEAMS;
    try {
      await getUserTeams();
    } catch (error) {
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
    }
  }

  get upcomingEvent(): UpcomingEvent | null {
    if (this.teams.length === 0) {
      return null;
    }

    let upcomingEvent: SecretSantaTeam = this.teams[0];

    for (const team of this.teams) {
      if (upcomingEvent.deliveryDate > team.deliveryDate) {
        upcomingEvent = team;
      } else if (upcomingEvent.deliveryDate === team.deliveryDate) {
        if (upcomingEvent.createdDate > team.deliveryDate) {
          upcomingEvent = team;
        }
      }
    }

    return {
      title: upcomingEvent.title,
      createdDate: upcomingEvent.createdDate,
      deliveryDate: upcomingEvent.deliveryDate,
    };
  }

  get upcomingEventProgress(): number {
    if (!this.upcomingEvent) {
      return 0;
    }

    return (
      ((Date.now() - this.upcomingEvent.createdDate.getTime()) /
        (this.upcomingEvent.deliveryDate.getTime() -
          this.upcomingEvent.createdDate.getTime())) *
      100
    );
  }

  get daysUntilUpcommingDelivery(): number {
    if (!this.upcomingEvent) {
      return 0;
    }

    const milliseconds = this.upcomingEvent.deliveryDate.getTime() - Date.now();
    return Math.max(0, Math.ceil(milliseconds / (1000 * 60 * 60 * 24)));
  }

  async createTeam(teamName: string, deliveryDate: Date): Promise<boolean> {
    try {
      await createTeam(teamName, deliveryDate);
      return true;
    } catch (error) {
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
      return false;
    }
  }
}
