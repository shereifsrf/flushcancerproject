import axios from "axios";
import {
  AUTO_AUTH_SUCCESS,
  INITIAL,
  USER_LOGIN_FAILED,
  USER_LOGIN_SUCCESS,
  USER_REGISTRATION_FAILED,
  USER_REGISTRATION_SUCCESS,
} from "../constants";

const mode = process.env.NODE_ENV;
const serverUrl = process.env.SERVER_URL;
const localUrl = process.env.LOCAL_URL || "http://localhost:5005";
let url = mode === "production" ? serverUrl : localUrl;

export const initState = (dispatch) => {
  dispatch({ type: INITIAL });
};

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

export const userVerify = (data, dispatch) => {
  axios
    .post(`${url}/api/v1/auth/verify-user`, {
      refreshToken: data.refreshToken,
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

export const userRegister = (data, dispatch) => {
  axios
    .post(`${url}/api/v1/auth/register`, {
      name: data.name,
      email: data.email,
      password: data.password,
    })
    .then((res) => {
      if (res.status === 200) {
        dispatch({
          type: USER_REGISTRATION_SUCCESS,
          payload: { message: res.data },
        });
      }
    })
    .catch((error) => {
      let err = error.response || {};
      //TODO: even status is OK, this code still runs, check why
      let msg = "Error Encountered";
      if (err.data) {
        if (err.data.errors) {
          if (Array.isArray(err.data.errors)) {
            if (Array.isArray(err.data.errors[0].messages))
              msg = err.data.errors[0].messages[0];
          } else {
            msg = err.data.message;
          }
        } else if (err.data.message) {
          if (Array.isArray(err.data.message)) {
            msg = err.data.message[0].message;
          } else {
            msg = err.data.message;
          }
        }
      }
      dispatch({
        type: USER_REGISTRATION_FAILED,
        payload: { status: err.status, message: msg },
      });
      return {};
    });
};
