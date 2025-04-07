import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/",
});

// Add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized (Token Expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("Error in response interceptor", error);

    if (
      error.response &&
      (error.response.status === 403 || error.response.status === 401)
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
