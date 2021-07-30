import {
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAILED,
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
    AUTO_AUTHENTICATE_USER_SUCCESS,
    AUTO_AUTHENTICATE_USER_FAILED,
    AUTO_AUTHENTICATE_USER_IN_PROGRESS,
    AUTO_AUTHENTICATE_USER_FAILED_NO_LOCALS,
    DELETE_CAMPAIGN_IN_PROGRESS,
    DELETE_CAMPAIGN_SUCCESS,
    DELETE_CAMPAIGN_FAILED,
    CREATE_DONATION_SUCCESS,
    CREATE_DONATION_FAILED,
    GET_DONATION_LIST_SUCCESS,
    GET_DONATION_LIST_FAILED,
    CREATE_COMMENT_IN_PROGRESS,
    CREATE_COMMENT_SUCCESS,
    CREATE_COMMENT_FAILED,
    UPDATE_COMMENT_IN_PROGRESS,
    UPDATE_COMMENT_SUCCESS,
    UPDATE_COMMENT_FAILED,
    DELETE_COMMENT_IN_PROGRESS,
    DELETE_COMMENT_SUCCESS,
    DELETE_COMMENT_FAILED,
    DELETE_LIKE_FAILED,
    DELETE_LIKE_SUCCESS,
    CREATE_LIKE_FAILED,
    CREATE_LIKE_SUCCESS,
    CREATE_REPORTING_SUCCESS,
    CREATE_REPORTING_FAILED,
    GET_RATING_SUCCESS,
    GET_RATING_FAILED,
    CREATE_RATING_FAILED,
    CREATE_RATING_SUCCESS,
    UPDATE_PROFILE_SUCCESS,
    UPDATE_PROFILE_FAILED,
    GET_PROOF_LIST_SUCCESS,
    GET_PROOF_LIST_FAILED,
    CREATE_PROOF_SUCCESS,
    CREATE_PROOF_FAILED,
    DELETE_PROOF_FAILED,
    DELETE_PROOF_SUCCESS,
    CLEAR_STATUS,
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
        ...clearCommentStatus,
        ...clearReportingStatus,
        ...clearRatingStatus,
        ...clearProfileStatus,
        ...clearLikeStatus,
        ...clearProofStatus,
        ...clearAccountStatus,
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

        case CLEAR_STATUS:
            return { ...state, status: {} };

        case USER_LOGIN_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                ...clearError,
                user: data.user,
                token: data.token,
                status: {
                    ...state.status,
                    ...clearAccountStatus,
                    ...clearAuthStatus,
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
                    ...clearAccountStatus,
                    ...clearAuthStatus,
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
                    ...clearAccountStatus,
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
                    ...clearAccountStatus,
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
                    ...clearAccountStatus,
                    autoAuthenticateUserFailed: true,
                },
            };

        case AUTO_AUTHENTICATE_USER_FAILED_NO_LOCALS:
            return {
                ...state,
                isAuthenticated: false,
                hasError: true,
                status: {
                    ...state.status,
                    ...clearAuthStatus,
                    ...clearAccountStatus,
                    autoAuthenticateUserFailedNoLocals: true,
                },
            };

        case USER_LOGOUT:
            localStorage.clear();
            return {
                ...initialState,
            };

        case USER_REGISTRATION_SUCCESS:
            return {
                ...state,
                ...clearError,
                hasError: false,
                status: {
                    ...state.status,
                    ...clearAccountStatus,
                    ...clearAuthStatus,
                    userRegisterSuccess: true,
                },
            };

        case USER_REGISTRATION_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearAccountStatus,
                    ...clearAuthStatus,
                    userRegisterFailed: true,
                },
            };

        case GET_CAMPAIGN_SUCCESS:
            return {
                ...state,
                ...clearError,
                campaign: data,
                status: {
                    ...state.status,
                    ...clearCommentStatus,
                    ...clearLikeStatus,
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
                    ...clearCommentStatus,
                    ...clearLikeStatus,
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
                    ...clearCommentStatus,
                    ...clearLikeStatus,
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
                    ...clearCommentStatus,
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
                    ...clearCommentStatus,
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
                    ...clearCommentStatus,
                    createCampaignInProgress: true,
                },
            };

        case GET_CAMPAIGN_LIST_SUCCESS:
            return {
                ...state,
                ...clearError,
                campaigns: data.campaigns,
                totalCampaigns: data.total,
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
                totalCampaigns: 0,
                campaigns: null,
                status: {
                    ...state.status,
                    ...clearCampaignStatus,
                    getCampaignListFailed: true,
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
                    ...clearDonationStatus,
                    ...clearLikeStatus,
                    createDonationSuccess: true,
                },
            };

        case CREATE_DONATION_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearDonationStatus,
                    ...clearLikeStatus,
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

        case CREATE_COMMENT_SUCCESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearCommentStatus,
                    ...clearLikeStatus,
                    createCommentSuccess: true,
                },
            };

        case CREATE_COMMENT_IN_PROGRESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearCommentStatus,
                    ...clearLikeStatus,
                    createCommentInProgress: true,
                },
            };

        case CREATE_COMMENT_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearCommentStatus,
                    ...clearLikeStatus,
                    createCommentFailed: true,
                },
            };

        case UPDATE_COMMENT_SUCCESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearCommentStatus,
                    ...clearLikeStatus,
                    updateCommentSuccess: true,
                },
            };

        case UPDATE_COMMENT_IN_PROGRESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearCommentStatus,
                    ...clearLikeStatus,
                    updateCommentInProgress: true,
                },
            };

        case UPDATE_COMMENT_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearCommentStatus,
                    ...clearLikeStatus,
                    updateCommentFailed: true,
                },
            };
        case DELETE_COMMENT_SUCCESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearCommentStatus,
                    ...clearLikeStatus,
                    deleteCommentSuccess: true,
                },
            };

        case DELETE_COMMENT_IN_PROGRESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearCommentStatus,
                    ...clearLikeStatus,
                    deleteCommentInProgress: true,
                },
            };

        case DELETE_COMMENT_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearCommentStatus,
                    ...clearLikeStatus,
                    deleteCommentFailed: true,
                },
            };

        case DELETE_LIKE_SUCCESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearLikeStatus,
                    deleteLikeSuccess: true,
                },
            };

        case DELETE_LIKE_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearLikeStatus,
                    deleteLikeFailed: true,
                },
            };

        case CREATE_LIKE_SUCCESS:
            return {
                ...state,
                ...clearError,
                like: data,
                status: {
                    ...state.status,
                    ...clearLikeStatus,
                    createLikeSuccess: true,
                },
            };

        case CREATE_LIKE_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearLikeStatus,
                    createLikeFailed: true,
                },
            };

        case CREATE_REPORTING_SUCCESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearReportingStatus,
                    createReportingSuccess: true,
                },
            };

        case CREATE_REPORTING_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearReportingStatus,
                    createReportingFailed: true,
                },
            };

        case CREATE_RATING_SUCCESS:
            return {
                ...state,
                ...clearError,
                rating: data,
                status: {
                    ...state.status,
                    ...clearRatingStatus,
                    createRatingSuccess: true,
                },
            };

        case CREATE_RATING_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearRatingStatus,
                    createRatingFailed: true,
                },
            };

        case GET_RATING_SUCCESS:
            return {
                ...state,
                ...clearError,
                rating: data,
                status: {
                    ...state.status,
                    ...clearRatingStatus,
                    getRatingSuccess: true,
                },
            };

        case GET_RATING_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearRatingStatus,
                    getRatingFailed: true,
                },
            };

        case UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                ...clearError,
                user: data,
                status: {
                    ...state.status,
                    ...clearProfileStatus,
                    updateProfileSuccess: true,
                },
            };

        case UPDATE_PROFILE_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearProfileStatus,
                    updateProfileFailed: true,
                },
            };

        case GET_PROOF_LIST_SUCCESS:
            return {
                ...state,
                ...clearError,
                proofs: data,
                status: {
                    ...state.status,
                    ...clearProofStatus,
                    getProofListSuccess: true,
                },
            };

        case GET_PROOF_LIST_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearProofStatus,
                    getProofListFailed: true,
                },
            };

        case CREATE_PROOF_SUCCESS:
            return {
                ...state,
                ...clearError,
                proof: data,
                status: {
                    ...state.status,
                    ...clearProofStatus,
                    createProofSuccess: true,
                },
            };

        case CREATE_PROOF_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearProofStatus,
                    createProofFailed: true,
                },
            };

        case DELETE_PROOF_SUCCESS:
            return {
                ...state,
                ...clearError,
                status: {
                    ...state.status,
                    ...clearProofStatus,
                    deleteProofSuccess: true,
                },
            };

        case DELETE_PROOF_FAILED:
            return {
                ...state,
                hasError: true,
                message: data.message,
                status: {
                    ...state.status,
                    ...clearProofStatus,
                    deleteProofFailed: true,
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

const clearCommentStatus = {
    createCommentSuccess: false,
    createCommentFailed: false,
    createCommentInProgress: false,
    updateCommentSuccess: false,
    updateCommentFailed: false,
    updateCommentInProgress: false,
    deleteCommentSuccess: false,
    deleteCommentFailed: false,
    deleteCommentInProgress: false,
};

const clearLikeStatus = {
    createLikeSuccess: false,
    createLikeFailed: false,
    deleteLikeSuccess: false,
    deleteLikeFailed: false,
};

const clearReportingStatus = {
    createReportingSuccess: false,
    createReportingFailed: false,
};

const clearRatingStatus = {
    createRatingSuccess: false,
    createRatingFailed: false,
    getRatingSuccess: false,
    getRatingFailed: false,
};

const clearProfileStatus = {
    updateProfileSuccess: false,
    updateProfileFailed: false,
};

const clearProofStatus = {
    getProofListSuccess: false,
    getProofListFailed: false,
    createProofSuccess: false,
    createProofFailed: false,
    deleteProofSuccess: false,
    deleteProofFailed: false,
};

const clearAccountStatus = {
    userRegisterSuccess: false,
    userRegisterFailed: false,
};
