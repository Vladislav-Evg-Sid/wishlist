import { makeAutoObservable } from "mobx";

import { AuthStore } from "./AuthStore";
import { UserStore } from "./UserStore";
import { GroupStore } from "./GroupStore";

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  groupStore: GroupStore;

  constructor() {
    makeAutoObservable(this);
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.groupStore = new GroupStore(this);
  }
}

export const rootStore = new RootStore();
