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
    DELETE_CAMPAIGN_IN_PROGRESS,
    DELETE_CAMPAIGN_SUCCESS,
    DELETE_CAMPAIGN_FAILED,
    CREATE_DONATION_IN_PROGRESS,
    CREATE_DONATION_SUCCESS,
    CREATE_DONATION_FAILED,
    GET_DONATION_LIST_IN_PROGRESS,
    GET_DONATION_LIST_SUCCESS,
    GET_DONATION_LIST_FAILED,
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

const getLocalStorage = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const tokenObj = isEmpty(token) ? undefined : JSON.parse(token);
    const userObj = isEmpty(user) ? undefined : JSON.parse(user);

    return { token: tokenObj, user: userObj };
};

const setLocalStorage = (localStorageItems) => {
    if (localStorageItems) {
        localStorage.setItem("user", JSON.stringify(localStorageItems.user));
        localStorage.setItem("token", JSON.stringify(localStorageItems.token));
        return true;
    }
    return false;
};

export const autoAuthenticateUser = async (dispatch) => {
    dispatch({ type: AUTO_AUTHENTICATE_USER_IN_PROGRESS });
    const localStorageItems = getLocalStorage();
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
                // console.log(result.data);
                const payload = {
                    user: result.data,
                    token: localStorageItems.token,
                };

                setLocalStorage(payload);
                // console.log(payload);
                return dispatch({
                    type: AUTO_AUTHENTICATE_USER_SUCCESS,
                    payload,
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
                const payload = {
                    token: res.data,
                    user: localStorageItems.user,
                };

                setLocalStorage(payload);

                dispatch({
                    type: AUTO_AUTHENTICATE_USER_SUCCESS,
                    payload,
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
            return handleFailure(error, USER_LOGIN_FAILED, dispatch);
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
    instance
        .post(`auth/register`, {
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
            return handleFailure(error, USER_REGISTRATION_FAILED, dispatch);
        });
};

export const getCampaign = (campaignId, dispatch) => {
    dispatch({ type: GET_CAMPAIGN_IN_PROGRESS });

    instance
        .get(`campaigns/${campaignId}`, {
            headers: {
                Authorization: `Bearer ${getLocalStorage().token.accessToken}`,
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
            return handleFailure(error, GET_CAMPAIGN_FAILED, dispatch);
        });
};

export const deleteCampaign = (campaignId, dispatch) => {
    dispatch({ type: DELETE_CAMPAIGN_IN_PROGRESS });

    instance
        .delete(`campaigns/${campaignId}`, {
            headers: {
                Authorization: `Bearer ${getLocalStorage().token.accessToken}`,
            },
        })
        .then((res) => {
            if (res.status === 200) {
                // console.log(res.data.document);
                return dispatch({
                    type: DELETE_CAMPAIGN_SUCCESS,
                    payload: res.data,
                });
            }
        })
        .catch((error) => {
            return handleFailure(error, DELETE_CAMPAIGN_FAILED, dispatch);
        });
};

export const getCategoryList = (dispatch) => {
    dispatch({ type: GET_CATEGORY_LIST_IN_PROGRESS });

    instance
        .get(`categories`, {
            headers: {
                Authorization: `Bearer ${getLocalStorage().token.accessToken}`,
            },
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
            return handleFailure(error, GET_CATEGORY_LIST_FAILED, dispatch);
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

    instance
        .patch(`campaigns/${campaignId}`, formData, {
            headers: {
                Authorization: `Bearer ${getLocalStorage().token.accessToken}`,
            },
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
            return handleFailure(error, UPDATE_CAMPAIGN_FAILED, dispatch);
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

    instance
        .post(`campaigns`, formData, {
            headers: {
                Authorization: `Bearer ${getLocalStorage().token.accessToken}`,
            },
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
            return handleFailure(error, CREATE_CAMPAIGN_FAILED, dispatch);
        });
};

export const createDonation = ({ campaignId, amount }, dispatch) => {
    dispatch({ type: CREATE_DONATION_IN_PROGRESS });

    instance
        .post(
            `donations`,
            { campaignId, amount },
            {
                headers: {
                    Authorization: `Bearer ${
                        getLocalStorage().token.accessToken
                    }`,
                },
            }
        )
        .then((res) => {
            // if (res.status === 200) {
            dispatch({
                type: CREATE_DONATION_SUCCESS,
                payload: res.data,
            });
            // }
        })
        .catch((error) => {
            return handleFailure(error, CREATE_DONATION_FAILED, dispatch);
        });
};

export const getCampaignList = (dashboard, dispatch) => {
    dispatch({ type: GET_CAMPAIGN_LIST_IN_PROGRESS });

    instance
        .get(`campaigns`, {
            params: {
                dashboard,
            },
            headers: {
                Authorization: `Bearer ${getLocalStorage().token.accessToken}`,
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
            return handleFailure(error, GET_CAMPAIGN_LIST_FAILED, dispatch);
        });
};

export const getDonationList = (dispatch) => {
    dispatch({ type: GET_DONATION_LIST_IN_PROGRESS });

    instance
        .get(`donations`, {
            headers: {
                Authorization: `Bearer ${getLocalStorage().token.accessToken}`,
            },
        })
        .then((res) => {
            if (res.status === 200) {
                // console.log(res.data);
                return dispatch({
                    type: GET_DONATION_LIST_SUCCESS,
                    payload: res.data,
                });
            }
        })
        .catch((error) => {
            return handleFailure(error, GET_DONATION_LIST_FAILED, dispatch);
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
