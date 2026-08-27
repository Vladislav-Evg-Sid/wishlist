import { makeAutoObservable } from "mobx";
import { AuthStore } from "./AuthStore";

export class RootStore {
  authStore: AuthStore;

  constructor() {
    makeAutoObservable(this);
    this.authStore = new AuthStore(this);
  }
}

export const rootStore = new RootStore();
