import axios from "axios";
import { isEmpty } from "lodash";
import {
    GET_CAMPAIGN_FAILED,
    GET_CAMPAIGN_IN_PROGRESS,
    GET_CAMPAIGN_SUCCESS,
    GET_CATEGORY_LIST_FAILED,
    GET_CATEGORY_LIST_IN_PROGRESS,
    GET_CATEGORY_LIST_SUCCESS,
    INITIAL,
    UPDATE_CAMPAIGN_FAILED,
    UPDATE_CAMPAIGN_IN_PROGRESS,
    UPDATE_CAMPAIGN_SUCCESS,
    CREATE_CAMPAIGN_FAILED,
    CREATE_CAMPAIGN_IN_PROGRESS,
    CREATE_CAMPAIGN_SUCCESS,
    USER_LOGIN_FAILED,
    USER_LOGIN_SUCCESS,
    USER_REGISTRATION_FAILED,
    USER_REGISTRATION_SUCCESS,
    GET_CAMPAIGN_LIST_IN_PROGRESS,
    GET_CAMPAIGN_LIST_SUCCESS,
    GET_CAMPAIGN_LIST_FAILED,
    AUTO_AUTHENTICATE_USER_SUCCESS,
    AUTO_AUTHENTICATE_USER_FAILED,
    AUTO_AUTHENTICATE_USER_IN_PROGRESS,
    AUTO_AUTHENTICATE_USER_FAILED_NO_LOCALS,
} from "../constants";

const mode = process.env.NODE_ENV;
const serverUrl = process.env.SERVER_URL;
const localUrl = process.env.LOCAL_URL || "http://localhost:5005";
let url = mode === "production" ? serverUrl : localUrl;

let instance = axios.create({
    baseURL: `${url}/api/v1/`,
});

export const initState = (dispatch) => {
    dispatch({ type: INITIAL });
};

const GetLocalStorage = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const tokenObj = isEmpty(token) ? undefined : JSON.parse(token);
    const userObj = isEmpty(user) ? undefined : JSON.parse(user);

    return { token: tokenObj, user: userObj };
};

export const autoAuthenticateUser = async (dispatch) => {
    dispatch({ type: AUTO_AUTHENTICATE_USER_IN_PROGRESS });
    const localStorageItems = GetLocalStorage();
    // console.log(localStorageItems.user.email);
    try {
        if (localStorageItems.token && localStorageItems.user) {
            const result = await instance.post(
                `auth`,
                { email: localStorageItems.user.email },
                {
                    headers: {
                        Authorization: `Bearer ${localStorageItems.token.accessToken}`,
                    },
                }
            );

            if (result.status === 200) {
                // console.log(localStorageItems);
                return dispatch({
                    type: AUTO_AUTHENTICATE_USER_SUCCESS,
                    payload: localStorageItems,
                });
            }
        }

        throw { data: { message: "No Token Found" } };
    } catch (error) {
        // console.log(err);
        if (localStorageItems.token && localStorageItems.user) {
            return refreshToken(localStorageItems, dispatch);
        }

        handleFailure(error, AUTO_AUTHENTICATE_USER_FAILED_NO_LOCALS, dispatch);
    }
};

const refreshToken = (localStorageItems, dispatch) => {
    instance
        .post(`auth/refresh-token`, {
            email: localStorageItems.user.email,
            refreshToken: localStorageItems.token.refreshToken,
        })
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: AUTO_AUTHENTICATE_USER_SUCCESS,
                    payload: res.data,
                });
            }
        })
        .catch((error) => {
            handleFailure(error, AUTO_AUTHENTICATE_USER_FAILED, dispatch);
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
    instance
        .post(`auth/login`, {
            email: data.email,
            password: data.password,
        })
        .then((res) => {
            if (res.status === 200) {
                return dispatch({
                    type: USER_LOGIN_SUCCESS,
                    payload: res.data,
                });
            }
        })
        .catch((error) => {
            return handleFailure(error, USER_LOGIN_FAILED, dispatch);
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

export const getCampaign = (campaignId, dispatch) => {
    dispatch({ type: GET_CAMPAIGN_IN_PROGRESS });

    instance
        .get(`campaigns/${campaignId}`, {
            headers: {
                Authorization: `Bearer ${GetLocalStorage().token.accessToken}`,
            },
        })
        .then((res) => {
            if (res.status === 200) {
                // console.log(res.data.document);
                return dispatch({
                    type: GET_CAMPAIGN_SUCCESS,
                    payload: res.data,
                });
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
            return dispatch({
                type: GET_CAMPAIGN_FAILED,
                payload: { status: err.status, message: msg },
            });
        });
};

export const getCategoryList = (dispatch) => {
    dispatch({ type: GET_CATEGORY_LIST_IN_PROGRESS });

    axios
        .get(`${url}/api/v1/categories`, {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
        })
        .then((res) => {
            if (res.status === 200) {
                // console.log(res.data.document);
                return dispatch({
                    type: GET_CATEGORY_LIST_SUCCESS,
                    payload: res.data,
                });
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
            return dispatch({
                type: GET_CATEGORY_LIST_FAILED,
                payload: { status: err.status, message: msg },
            });
        });
};

export const updateCampaign = (campaignId, data, dispatch) => {
    dispatch({ type: UPDATE_CAMPAIGN_IN_PROGRESS });

    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("description", data.description || "");
    formData.append("limit", data.limit || 0);
    formData.append("categoryId", data.category.id || "");

    if (data.imageChanged) formData.append("document", data.document);

    axios
        .patch(`${url}/api/v1/campaigns/${campaignId}`, formData, {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
        })
        .then((res) => {
            if (res.status === 200) {
                dispatch({
                    type: UPDATE_CAMPAIGN_SUCCESS,
                    payload: res.data,
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
                type: UPDATE_CAMPAIGN_FAILED,
                payload: { status: err.status, message: msg },
            });
            return {};
        });
};

export const createCampaign = (data, dispatch) => {
    dispatch({ type: CREATE_CAMPAIGN_IN_PROGRESS });

    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("description", data.description || "");
    formData.append("limit", data.limit || 0);
    formData.append("categoryId", data.category || "");

    if (data.imageChanged) formData.append("document", data.document);

    axios
        .post(`${url}/api/v1/campaigns`, formData, {
            headers: { Authorization: `Bearer ${getAccessToken()}` },
        })
        .then((res) => {
            // if (res.status === 200) {
            dispatch({
                type: CREATE_CAMPAIGN_SUCCESS,
                payload: res.data,
            });
            // }
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
                type: CREATE_CAMPAIGN_FAILED,
                payload: { status: err.status, message: msg },
            });
            return {};
        });
};

export const getCampaignList = (dispatch) => {
    dispatch({ type: GET_CAMPAIGN_LIST_IN_PROGRESS });

    instance
        .get(`campaigns`, {
            headers: {
                Authorization: `Bearer ${GetLocalStorage().token.accessToken}`,
            },
        })
        .then((res) => {
            if (res.status === 200) {
                // console.log(res.data);
                return dispatch({
                    type: GET_CAMPAIGN_LIST_SUCCESS,
                    payload: res.data,
                });
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
            return dispatch({
                type: GET_CAMPAIGN_LIST_FAILED,
                payload: { status: err.status, message: msg },
            });
        });
};

const handleFailure = (error, type, dispatch, status, message) => {
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
        type,
        payload: {
            status: isEmpty(status) ? err.status : status,
            message: isEmpty(message) ? msg : message,
        },
    });
};
