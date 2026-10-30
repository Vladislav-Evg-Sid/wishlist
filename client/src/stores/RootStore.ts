import { makeAutoObservable } from "mobx";

import { AuthStore } from "./AuthStore";
import { UserStore } from "./UserStore";
import { SecretSantaStore } from "./SecretSantaStore";
import type { SecretSantaTeamStore } from "./SecretSantaTeamStore";

export class RootStore {
  authStore: AuthStore;
  userStore: UserStore;
  secretSantaStore: SecretSantaStore;
  secretSantaTeamStore: SecretSantaTeamStore;

  constructor() {
    makeAutoObservable(this);
    this.authStore = new AuthStore(this);
    this.userStore = new UserStore(this);
    this.secretSantaStore = new SecretSantaStore(this);
    this.secretSantaTeamStore = this.secretSantaStore.teamStore;
  }
}

export const rootStore = new RootStore();
