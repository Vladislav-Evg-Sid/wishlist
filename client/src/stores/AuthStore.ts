import { makeAutoObservable, runInAction } from "mobx";
import type { RootStore } from "./RootStore";
import { getCurrentUser, loginUser } from "../api/auth";
import { Bounce, toast } from "react-toastify";

export class AuthStore {
  rootStore: RootStore;
  isAuthInitialized: boolean = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  async authorise() {
    this.isAuthInitialized = false;
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
        this.isAuthInitialized = true;
      });
    }
  }

  async login(email: string, password: string) {
    try {
      const accessToken = await loginUser(email, password);
      runInAction(() => {
        toast.success(`Ваш токен: ${accessToken}`, {
          position: "top-right",
          autoClose: 5000,
          theme: "light",
          transition: Bounce,
        });
      });
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
    }
  }

  get isAuthorised() {
    return Boolean(this.rootStore.userStore.currentUser);
  }
}
