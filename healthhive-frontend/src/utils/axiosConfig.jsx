import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/authSlice";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401)
    ) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
