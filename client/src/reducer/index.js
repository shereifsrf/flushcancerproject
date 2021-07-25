import {
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILED,
    USER_LOGIN_IN_PROGRESS,
    USER_LOGOUT,
    USER_REGISTRATION_SUCCESS,
    USER_REGISTRATION_FAILED,
    INITIAL,
    GET_CAMPAIGN_SUCCESS,
    GET_CAMPAIGN_FAILED,
    GET_CAMPAIGN_IN_PROGRESS,
    GET_CATEGORY_LIST_SUCCESS,
    GET_CATEGORY_LIST_FAILED,
    GET_CATEGORY_LIST_IN_PROGRESS,
    UPDATE_CAMPAIGN_SUCCESS,
    UPDATE_CAMPAIGN_FAILED,
    UPDATE_CAMPAIGN_IN_PROGRESS,
    CREATE_CAMPAIGN_SUCCESS,
    CREATE_CAMPAIGN_FAILED,
    CREATE_CAMPAIGN_IN_PROGRESS,
    GET_CAMPAIGN_LIST_SUCCESS,
    GET_CAMPAIGN_LIST_FAILED,
    GET_CAMPAIGN_LIST_IN_PROGRESS,
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

export const initialState = {
    isAuthenticated: false,
    hasError: false,
    message: "",
    user: null,
    token: null,
    status: {
        ...clearCampaignStatus,
        ...clearAuthStatus,
        ...clearDonationStatus,
        getCategoryListSuccess: false,
        getCategoryListFailed: false,
        getCategoryListInProgress: false,
    },
    campaign: null,
    categories: null,
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
                ...clearError,
                user: data.user,
                token: data.token,
                status: {
                    ...state.status,
                    userAuthSuccess: true,
                    userAuthInProgress: false,
                    userAuthFailed: false,
                },
            };
        case USER_LOGIN_FAILED:
            return {
                ...state,
                isAuthenticated: false,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    userAuthSuccess: false,
                    userAuthInProgress: false,
                    userAuthFailed: true,
                },
            };

        case AUTO_AUTHENTICATE_USER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                user: data.user,
                token: data.token,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearAuthStatus,
                    autoAuthenticateUserSuccess: true,
                },
            };

        case AUTO_AUTHENTICATE_USER_IN_PROGRESS:
            return {
                ...state,
                isAuthenticated: false,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearAuthStatus,
                    autoAuthenticateUserInProgress: true,
                },
            };

        case AUTO_AUTHENTICATE_USER_FAILED:
            return {
                ...state,
                isAuthenticated: false,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearAuthStatus,
                    autoAuthenticateUserFailed: true,
                },
            };

        case AUTO_AUTHENTICATE_USER_FAILED_NO_LOCALS:
            return {
                ...state,
                isAuthenticated: false,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearAuthStatus,
                    autoAuthenticateUserFailedNoLocals: true,
                },
            };

        case USER_LOGOUT:
            localStorage.clear();
            return {
                ...initialState,
            };

        case USER_REGISTRATION_SUCCESS:
            return { ...state, hasError: false, message: data.message };
        case USER_REGISTRATION_FAILED:
            return { ...state, hasError: true, message: data.message };

        case GET_CAMPAIGN_SUCCESS:
            return {
                ...state,
                ...clearError,
                campaign: data,
                status: {
                    ...state.status,
                    getCampaignSuccess: true,
                    getCampaignFailed: false,
                    getCampaignInProgress: false,
                },
            };
        case GET_CAMPAIGN_FAILED:
            return {
                ...state,
                campaign: null,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    getCampaignSuccess: false,
                    getCampaignFailed: true,
                    getCampaignInProgress: false,
                },
            };
        case GET_CAMPAIGN_IN_PROGRESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    getCampaignSuccess: false,
                    getCampaignFailed: false,
                    getCampaignInProgress: true,
                },
            };

        case GET_CATEGORY_LIST_SUCCESS:
            return {
                ...state,
                ...clearError,
                categories: data,
                status: {
                    ...state.status,
                    getCategoryListSuccess: true,
                    getCategoryListFailed: false,
                    getCategoryListInProgress: false,
                },
            };

        case GET_CATEGORY_LIST_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                categories: null,
                status: {
                    ...state.status,
                    getCategoryListSuccess: false,
                    getCategoryListFailed: true,
                    getCategoryListInProgress: false,
                },
            };

        case GET_CATEGORY_LIST_IN_PROGRESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    getCategoryListSuccess: false,
                    getCategoryListFailed: false,
                    getCategoryListInProgress: true,
                },
            };

        case UPDATE_CAMPAIGN_SUCCESS:
            return {
                ...state,
                ...clearError,
                campaign: data,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    updateCampaignSuccess: true,
                },
            };

        case UPDATE_CAMPAIGN_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    updateCampaignFailed: true,
                },
            };

        case UPDATE_CAMPAIGN_IN_PROGRESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    updateCampaignInProgress: true,
                },
            };

        case CREATE_CAMPAIGN_SUCCESS:
            return {
                ...state,
                ...clearError,
                campaign: data,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    createCampaignSuccess: true,
                },
            };

        case CREATE_CAMPAIGN_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    createCampaignFailed: true,
                },
            };

        case CREATE_CAMPAIGN_IN_PROGRESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    createCampaignInProgress: true,
                },
            };

        case GET_CAMPAIGN_LIST_SUCCESS:
            return {
                ...state,
                ...clearError,
                campaigns: data,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    getCampaignListSuccess: true,
                },
            };

        case GET_CAMPAIGN_LIST_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                campaigns: null,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    getCampaignListFailed: true,
                },
            };

        case GET_CAMPAIGN_LIST_IN_PROGRESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    getCampaignListInProgress: true,
                },
            };

        case DELETE_CAMPAIGN_SUCCESS:
            return {
                ...state,
                ...clearError,
                campaign: data,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    deleteCampaignSuccess: true,
                },
            };

        case DELETE_CAMPAIGN_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                campaigns: null,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    deleteCampaignFailed: true,
                },
            };

        case DELETE_CAMPAIGN_IN_PROGRESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    deleteCampaignInProgress: true,
                },
            };

        case CREATE_DONATION_SUCCESS:
            return {
                ...state,
                ...clearError,
                donation: data,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    ...clearDonationStatus,
                    createDonationSuccess: true,
                },
            };

        case CREATE_DONATION_IN_PROGRESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    ...clearDonationStatus,
                    createDonationInProgress: true,
                },
            };

        case CREATE_DONATION_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    ...clearDonationStatus,
                    createDonationFailed: true,
                },
            };
        case GET_DONATION_LIST_SUCCESS:
            return {
                ...state,
                ...clearError,
                donations: data,
                status: {
                    ...state.status,
                    ...clearDonationStatus,
                    getDonationListSuccess: true,
                },
            };

        case GET_DONATION_LIST_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                donations: null,
                status: {
                    ...state.status,
                    ...clearDonationStatus,
                    getDonationListFailed: true,
                },
            };

        case GET_DONATION_LIST_IN_PROGRESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearDonationStatus,
                    getDonationListInProgress: true,
                },
            };
        default:
            return state;
    }
};

const clearCampaignStatus = {
    getCampaignSuccess: false,
    getCampaignFailed: false,
    getCampaignInProgress: false,
    updateCampaignSuccess: false,
    updateCampaignFailed: false,
    updateCampaignInProgress: false,
    createCampaignSuccess: false,
    createCampaignFailed: false,
    createCampaignInProgress: false,
    getCampaignListSuccess: false,
    getCampaignListFailed: false,
    getCampaignListInProgress: false,
    deleteCampaignSuccess: false,
    deleteCampaignFailed: false,
    deleteCampaignInProgress: false,
};

const clearDonationStatus = {
    createDonationSuccess: false,
    createDonationFailed: false,
    createDonationInProgress: false,
    getDonationListSuccess: false,
    getDonationListFailed: false,
    getDonationListInProgress: false,
};

const clearError = {
    hasError: false,
    message: "",
};

const clearAuthStatus = {
    autoAuthenticateUserSuccess: false,
    autoAuthenticateUserFailed: false,
    autoAuthenticateUserFailedNoLocals: false,
    autoAuthenticateUserInProgress: false,
};
