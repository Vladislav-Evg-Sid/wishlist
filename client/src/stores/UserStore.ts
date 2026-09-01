import { makeAutoObservable } from "mobx";

import type { RootStore } from "./RootStore";
import type { User } from "../types/user";

export class UserStore {
  rootStore: RootStore;
  currentUser: undefined | User;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }
}
