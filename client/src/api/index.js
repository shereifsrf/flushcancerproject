import axios from "axios";
import CONFIG from "../config.json";

let url =
  process.env.NODE_ENV === "production"
    ? CONFIG.SERVER_URL
    : "http://localhost:5005";

export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAILED = "USER_LOGIN_FAILED";
export const USER_LOGOUT = "USER_LOGOUT";
export const USER_AUTHENTICATED_SUCCESS = "USER_AUTHENTICATED_SUCCESS";
export const USER_AUTHENTICATED_FAILED = "USER_AUTHENTICATED_FAILED";

export const getUser = (accessToken) => {
  return (dispatch) => {
    axios
      .get(`${url}/api/v1/users/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          dispatch({});
          return;
        }
      })
      .catch((error) => {
        let err = error.response || {};
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
        return { message: msg, status: err.status };
      });
  };
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
