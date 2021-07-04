import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILED,
  USER_LOGOUT,
  AUTO_AUTH_SUCCESS,
  AUTO_AUTH_FAILED,
  USER_REGISTRATION_SUCCESS,
  USER_REGISTRATION_FAILED,
  INITIAL,
  IN_PROGRESS,
  COMPLETED,
  FAILED,
  IN_PROGRESS_STATUS,
  STARTED,
} from "../constants";

export const initialState = {
  isAuthenticated: false,
  hasError: false,
  message: "",
  user: null,
  token: null,
  status: STARTED,
};

export const reducer = (state, action) => {
  let data = action.payload || {};
  switch (action.type) {
    case INITIAL:
      return { ...initialState };

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
        status: COMPLETED,
      };
    case USER_LOGIN_FAILED:
      return {
        ...state,
        isAuthenticated: false,
        hasError: true,
        message: data.message,
        status: FAILED,
      };

    case IN_PROGRESS_STATUS:
      return { ...state, status: IN_PROGRESS };

    case USER_LOGOUT:
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case USER_REGISTRATION_SUCCESS:
      return { ...state, hasError: false, message: data.message };
    case USER_REGISTRATION_FAILED:
      return { ...state, hasError: true, message: data.message };

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
