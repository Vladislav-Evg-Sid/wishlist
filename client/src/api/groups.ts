import type { Group } from "../types/groups";

export default function getUserGroups(userID: string): Group[] {
  switch (userID) {
    case "123":
      return [
        {
          id: "123",
          name: "Группа 1",
        },
        {
          id: "124",
          name: "Группа 2",
        },
        {
          id: "125",
          name: "Группа 3",
        },
        {
          id: "126",
          name: "Группа 4",
        },
        {
          id: "127",
          name: "Группа 5",
        },
        {
          id: "128",
          name: "Группа 6",
        },
      ];

    default:
      return [];
  }
}
