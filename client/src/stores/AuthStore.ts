import { makeAutoObservable, runInAction } from "mobx";
import type { RootStore } from "./RootStore";
import { getCurrentUser } from "../api/auth";

export class AuthStore {
  rootStore: RootStore;
  isAuthInitializуed: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  async authorise() {
    this.isAuthInitializуed = false;
    try {
      const user = await getCurrentUser();
      runInAction(() => {
        this.rootStore.userStore.currentUser = user;
      });
    } catch {
      runInAction(() => {
        this.rootStore.userStore.currentUser = undefined;
      });
    } finally {
      runInAction(() => {
        this.isAuthInitializуed = true;
      });
    }
  }

  get isAuthorised() {
    return Boolean(this.rootStore.userStore.currentUser);
  }
}
