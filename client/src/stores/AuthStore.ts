import { makeAutoObservable } from "mobx";

import type { RootStore } from "./RootStore";

export class AuthStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }
}
