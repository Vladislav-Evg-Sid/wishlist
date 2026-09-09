const serverHost = import.meta.env.VITE_SERVER_HOST;
const serverPort = import.meta.env.VITE_SERVER_PORT;

export const baseApi = `http://${serverHost}:${serverPort}`;

export const APP_NAME = "Название";
