import axios from "axios";
import { getAuth } from "firebase/auth";

const BASE_URL = "http://localhost:3001";

// Public configs (mobil)
export const fetchConfigs = async () => {
  return axios.get(`${BASE_URL}/api/config`, {
    headers: { Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}` }
  });
};

// Admin configs (güncelleme)
export const updateConfig = async (key, value, audiences = {}) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Not authenticated");

  const token = await user.getIdToken();
  return axios.put(
    `${BASE_URL}/api/admin/config/${key}`,
    { value, clientUpdatedAt: Date.now(), audiences },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
