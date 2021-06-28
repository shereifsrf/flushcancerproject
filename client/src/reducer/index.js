import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILED,
  USER_LOGOUT,
  AUTO_AUTH_SUCCESS,
  AUTO_AUTH_FAILED,
} from "../api";

export const reducer = (state, action) => {
  let data = action.payload || {};
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", JSON.stringify(data.token));
      console.log(data.token.accessToken);
      return {
        ...state,
        isAuthenticated: true,
        hasError: false,
        message: "",
        user: data.user,
        token: data.token,
      };

    case USER_LOGIN_FAILED:
      return {
        ...state,
        isAuthenticated: false,
        hasError: true,
        message: data.message,
      };

    case USER_LOGOUT:
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case AUTO_AUTH_SUCCESS:
      localStorage.setItem("token", JSON.stringify(data));
      return {
        ...state,
        isAuthenticated: true,
        hasError: false,
        message: "",
        user: data.user,
        token: data.token,
      };
    case AUTO_AUTH_FAILED:
      return { ...state, isAuthenticated: false };

    default:
      return state;
  }
};
