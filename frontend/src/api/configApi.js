import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const addConfig = async (data) => {
  return api.post("/api/admin/config", data);
};

export const deleteConfig = async (key) => {
  return api.delete(`/api/admin/config/${key}`);
};

export const getConfigs = async () => {
  return api.get("/api/admin/config");
};
