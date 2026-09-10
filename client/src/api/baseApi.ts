import { SERVER_HOST, SERVER_PORT } from "../env";

let getAccessToken: () => string | null = () => null;
let setAccessToken: (accessToken: string | null) => void = () => {};
let refreshPromise: Promise<string | null> | null = null;

export function setAccessTokenGetter(getter: () => string | null) {
  getAccessToken = getter;
}

export function setAccessTokenSetter(
  setter: (accessToken: string | null) => void,
) {
  setAccessToken = setter;
}

export const baseApi = `http://${SERVER_HOST}:${SERVER_PORT}`;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${baseApi}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) return null;
      const token = await response.text();
      if (!token) return null;
      setAccessToken(token);
      return token;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function apiFetch(url: string, options: RequestInit = {}) {
  const request = (token: string | null) => {
    const headers = new Headers(options.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return fetch(`${baseApi}${url}`, {
      ...options,
      headers,
      credentials: "include",
    });
  };

  const accessToken = getAccessToken();
  const response = await request(accessToken);
  const pathname = url.split("?")[0].replace(/\/$/, "");
  const isSessionEndpoint = [
    "/auth/login",
    "/auth/register",
    "/auth/refresh",
    "/auth/logout",
    "/auth/logout/all-sessions",
  ].includes(pathname);

  if (response.status !== 401 || isSessionEndpoint) return response;

  const currentToken = getAccessToken();
  const token =
    currentToken && currentToken !== accessToken
      ? currentToken
      : await refreshAccessToken();

  return token ? request(token) : response;
}
