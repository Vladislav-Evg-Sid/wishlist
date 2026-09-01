import { makeAutoObservable, runInAction } from "mobx";

import type { RootStore } from "./RootStore";
import { getCurrentUser } from "../api/auth";

export class AuthStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  async authorise() {
    const user = await getCurrentUser();

    runInAction(() => {
      this.rootStore.userStore.currentUser = user;
    });
  }

  get isAuthorised() {
    return !(this.rootStore.userStore.currentUser === undefined);
  }
}
