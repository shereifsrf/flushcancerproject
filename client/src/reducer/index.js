import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAILED,
  USER_LOGOUT,
  USER_AUTHENTICATED_SUCCESS,
  USER_AUTHENTICATED_FAILED,
} from "../api";

export const reducer = (state, action) => {
  switch (action.type) {
    case USER_LOGIN_SUCCESS:
      let data = action.payload;
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", JSON.stringify(data.token));
      return {
        ...state,
        isAuthenticated: true,
        user: data.user,
        token: data.token,
      };

    case USER_LOGIN_FAILED:
      return {
        ...state,
        isAuthenticated: false,
        hasError: true,
        message: action.payload.message,
      };

    case USER_LOGOUT:
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case USER_AUTHENTICATED_SUCCESS:
      return { ...state, isAuthenticated: true };
    case USER_AUTHENTICATED_FAILED:
      return { ...state, isAuthenticated: false };

    default:
      return state;
  }
};
