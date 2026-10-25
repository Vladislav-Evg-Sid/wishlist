import { makeAutoObservable } from "mobx";

import { AuthStore } from "./AuthStore";
import { UserStore } from "./UserStore";
import { SecretSantaStore } from "./SecretSantaStore";

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  secretSantaStore: SecretSantaStore;

  constructor() {
    makeAutoObservable(this);
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.secretSantaStore = new SecretSantaStore();
  }
}

export const rootStore = new RootStore();
