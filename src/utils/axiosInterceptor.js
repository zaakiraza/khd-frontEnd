import api from "./api";

let navigate = null;

export const setNavigate = (navigateFunc) => {
  navigate = navigateFunc;
};

export const setupAxiosInterceptor = () => {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 403) {
        console.log("403 detected, redirecting to login");
        localStorage.clear();
        window.location.replace("/login-student");
        return;
      }
      return Promise.reject(error);
    }
  );
};
