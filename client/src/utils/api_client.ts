import axios, { AxiosInstance } from "axios";

export function getLocalStorageKey(): string {
  return `${process.env.REACT_APP_JWT_KEY}-${process.env.NODE_ENV}`;
}

const axiosClient = axios.create({
  baseURL: `${process.env.REACT_APP_SERV_PROTOCOL}${process.env.REACT_APP_SERV_HOSTNAME}/api`,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});
loadJWT();

export function loadJWT() {
  const jwt = localStorage.getItem(getLocalStorageKey());
  if (jwt) {
    // @ts-ignore
    axiosClient.defaults.headers["Authorization"] = `Bearer ${jwt}`;
  }
}

export const APIClient = (): AxiosInstance => {
  return axiosClient;
};
