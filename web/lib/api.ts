import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5001",
});

api.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("urlvy_token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});
