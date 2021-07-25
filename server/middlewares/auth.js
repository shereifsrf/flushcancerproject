const httpStatus = require("http-status");
const { isUndefined } = require("lodash");
const passport = require("passport");
const {
    ADMINACCESS,
    DONORACCESS,
    PUBLICACCESS,
    ROLES,
    ADMIN,
    LOGGED_USER,
} = require("../config/constants");
const User = require("../models/user.model");
const APIError = require("../utils/APIError");

const handleJWT = (req, res, next, roles) => async (err, user, info) => {
    const error = err || info;
    const logIn = Promise.promisify(req.logIn);
    const apiError = new APIError({
        message: error ? error.message : "Unauthorized",
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined,
    });

    try {
        if (error || !user) throw error;
        await logIn(user, { session: false });
    } catch (e) {
        return next(apiError);
    }

    if (roles === LOGGED_USER) {
        //here the chunk of validation is nothing to worry
        //check whether the user requesting an ADMIN
        //if not check whether user passing userId
        //in params
        //in body
        //in campaigns
        //in like
        //in comment
        //in rating
        //depending on the validation, if requester want changes to other user data, the role should be ADMIN
        if (user.role !== ADMIN) {
            if (
                (!isUndefined(req.params.userId) &&
                    req.params.userId !== user._id.toString()) ||
                (!isUndefined(req.body.userId) &&
                    req.body.userId !== user._id.toString()) ||
                (!isUndefined(req.locals) &&
                    ((!isUndefined(req.locals.campaign) &&
                        req.locals.campaign.userId._id.toString() !==
                            user._id.toString()) ||
                        (!isUndefined(req.locals.campaignLike) &&
                            req.locals.campaignLike.userId.toString() !==
                                user._id.toString()) ||
                        (!isUndefined(req.locals.campaignComment) &&
                            req.locals.campaignComment.userId._id.toString() !==
                                user._id.toString()) ||
                        (!isUndefined(req.locals.campaignRating) &&
                            req.locals.campaignRating.userId.toString() !==
                                user._id.toString()) ||
                        (!isUndefined(req.locals.campaignReporting) &&
                            req.locals.campaignReporting.userId.toString() !==
                                user._id.toString()) ||
                        (!isUndefined(req.locals.donation) &&
                            req.locals.donation.userId.toString() !==
                                user._id.toString())))
            ) {
                apiError.status = httpStatus.FORBIDDEN;
                apiError.message = "No admin access";
                return next(apiError);
            }
        }
    } else if (!roles.includes(user.role)) {
        apiError.status = httpStatus.FORBIDDEN;
        apiError.message = "Invalid Access";
        return next(apiError);
    } else if (err || !user) {
        return next(apiError);
    }

    req.user = user;

    return next();
};

const getAccess = (req, res, next) => (err, user, info) => {
    const error = err || info;

    if (error || !user) req.error = error;
    else req.user = user;

    return next();
};

exports.ADMIN = ADMIN;
exports.LOGGED_USER = LOGGED_USER;

exports.authorize =
    (roles = ROLES) =>
    (req, res, next) =>
        passport.authenticate(
            "jwt",
            { session: false },
            handleJWT(req, res, next, roles)
        )(req, res, next);

exports.findAccess = () => (req, res, next) => {
    passport.authenticate("jwt", { session: false }, getAccess(req, res, next))(
        req,
        res,
        next
    );
};

exports.oAuth = (service) => passport.authenticate(service, { session: false });
