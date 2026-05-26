import axios from "axios";

const api = axios.create({
  baseURL: "https://zipzon.vercel.app/api",
  timeout: 30000,
});

export default api;