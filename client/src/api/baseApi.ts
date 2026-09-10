import { SERVER_HOST, SERVER_PORT } from "../env";

let getAccessToken: () => string | null = () => null;

export function setAccessTokenGetter(getter: () => string | null) {
  getAccessToken = getter;
}

export const baseApi = `http://${SERVER_HOST}:${SERVER_PORT}`;

export async function apiFetch(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);

  const accessToken = getAccessToken();

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  console.log(url, accessToken);

  return fetch(`${baseApi}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });
}
