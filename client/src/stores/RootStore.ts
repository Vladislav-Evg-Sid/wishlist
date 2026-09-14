import { makeAutoObservable } from "mobx";

import { AuthStore } from "./AuthStore";
import { UserStore } from "./UserStore";

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;

  constructor() {
    makeAutoObservable(this);
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
  }
}

export const rootStore = new RootStore();
