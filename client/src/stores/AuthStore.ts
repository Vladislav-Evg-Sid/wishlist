import { makeAutoObservable, runInAction } from "mobx";

import type { RootStore } from "./RootStore";
import { getCurrentUser, loginUser } from "../api/auth";
import { Bounce, toast } from "react-toastify";
import { setAccessTokenGetter, setAccessTokenSetter } from "../api/baseApi";

export class AuthStore {
  rootStore: RootStore;
  isAuthInitialized: boolean = false;
  accessToken: string | null = null;
  private authorisationPromise: Promise<void> | null = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable<this, "authorisationPromise">(this, {
      authorisationPromise: false,
    });
    this.rootStore = rootStore;
    setAccessTokenGetter(() => this.accessToken);
    setAccessTokenSetter((accessToken: string | null) => {
      runInAction(() => {
        this.accessToken = accessToken;
      });
    });
  }

  authorise(): Promise<void> {
    if (this.authorisationPromise) return this.authorisationPromise;
    this.isAuthInitialized = false;
    this.authorisationPromise = (async () => {
      try {
        const user = await getCurrentUser();
        runInAction(() => {
          this.rootStore.userStore.currentUser = user;
          this.isAuthInitialized = true;
        });
      } catch {
        runInAction(() => {
          this.rootStore.userStore.currentUser = undefined;
          this.isAuthInitialized = true;
        });
      }
    })().finally(() => {
      this.authorisationPromise = null;
    });
    return this.authorisationPromise;
  }

  async login(email: string, password: string) {
    try {
      const accessToken = await loginUser(email, password);
      if (!accessToken) {
        toast.error("Ошибка авторизации!\nНе получен токен", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
        return false;
      }
      runInAction(() => {
        this.accessToken = accessToken;
      });
      await this.authorise();
      return this.isAuthorised;
    } catch (error) {
      runInAction(() => {
        if (error instanceof Error) {
          switch (error.message) {
            case "Invalid email":
              toast.error("Неверная почта", {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
              });
              return;
            case "Invalid password for this email":
              toast.error("Неверный пароль", {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
              });
              return;
          }
        }
        toast.error("Неизвестная ошибка авторизации", {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
        console.error(error);
        return;
      });
      return false;
    }
  }

  get isAuthorised() {
    return Boolean(this.rootStore.userStore.currentUser);
  }
}
