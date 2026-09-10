import { SERVER_HOST, SERVER_PORT } from "../env";

let getAccessToken: () => string | null = () => null;
let setAccessToken: (accessToken: string | null) => void = (
  accessToken: string | null,
) => {
  accessToken;
};

export function setAccessTokenGetter(getter: () => string | null) {
  getAccessToken = getter;
}
export function setAccessTokenSetter(
  setter: (accessToken: string | null) => void,
) {
  setAccessToken = setter;
}

export const baseApi = `http://${SERVER_HOST}:${SERVER_PORT}`;

export async function apiFetch(url: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  const accessToken = getAccessToken();

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${baseApi}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 && !response.url.includes("auth/refresh")) {
    const refResponse = await fetch(`${baseApi}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refResponse.ok) {
      const accessToken = await refResponse.text();
      if (accessToken) {
        setAccessToken(accessToken);
        return apiFetch(url, options);
      }
    }
  }

  return response;
}
