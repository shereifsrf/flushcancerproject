import axios from "axios";
import CONFIG from "../config.json";

export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAILED = "USER_LOGIN_FAILED";
export const USER_LOGOUT = "USER_LOGOUT";
export const AUTO_AUTH_SUCCESS = "AUTO_AUTH_SUCCESS";
export const AUTO_AUTH_FAILED = "AUTO_AUTH_FAILED";

let url =
  process.env.NODE_ENV === "production"
    ? CONFIG.SERVER_URL
    : "http://localhost:5005";

export const autoAuthenticateUser = (dispatch) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const tokenObj = token === "undefined" ? undefined : JSON.parse(token);
  const userObj = user === "undefined" ? undefined : JSON.parse(user);

  if (tokenObj && userObj && tokenObj.accessToken && userObj.email) {
    console.log(tokenObj.refreshToken, userObj.email);
    refreshToken(
      { email: userObj.email, refreshToken: tokenObj.refreshToken },
      dispatch
    );
  } else console.log("not auto authencation eligible");
};

const refreshToken = (data, dispatch) => {
  axios
    .post(`${url}/api/v1/auth/refresh-token`, {
      email: data.email,
      refreshToken: data.refreshToken,
    })
    .then((res) => {
      if (res.status === 200) {
        dispatch({ type: AUTO_AUTH_SUCCESS, payload: res.data });
      }
    })
    .catch((error) => {
      let err = error.response || {};
      //TODO: even status is OK, this code still runs, check why
      let msg = "Error Encountered";
      if (err.data) {
        if (err.data.message) {
          if (Array.isArray(err.data.message)) {
            msg = err.data.message[0].message;
          } else {
            msg = err.data.message;
          }
        }
      }
      dispatch({
        type: USER_LOGIN_FAILED,
        payload: { status: err.status, message: msg },
      });
      return {};
    });
};

export const userLogin = (data, dispatch) => {
  axios
    .post(`${url}/api/v1/auth/login`, {
      email: data.email,
      password: data.password,
    })
    .then((res) => {
      if (res.status === 200) {
        dispatch({ type: USER_LOGIN_SUCCESS, payload: res.data });
      }
    })
    .catch((error) => {
      let err = error.response || {};
      //TODO: even status is OK, this code still runs, check why
      let msg = "Error Encountered";
      if (err.data) {
        if (err.data.message) {
          if (Array.isArray(err.data.message)) {
            msg = err.data.message[0].message;
          } else {
            msg = err.data.message;
          }
        }
      }
      dispatch({
        type: USER_LOGIN_FAILED,
        payload: { status: err.status, message: msg },
      });
      return {};
    });
};
