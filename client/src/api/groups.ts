import type { Groups } from "../types/groups";

export default function getUserGroups(userID: string): Groups {
  switch (userID) {
    case "123":
      return new Map([
        ["123", "Группа 1"],
        ["124", "Группа 2"],
        ["125", "Группа 3"],
        ["126", "Группа 4"],
        ["127", "Группа 5"],
        ["128", "Группа 6"],
      ]);

    default:
      return new Map();
  }
}
