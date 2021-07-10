const httpStatus = require("http-status");
const passport = require("passport");
const {
    ADMINACCESS,
    DONORACCESS,
    PUBLICACCESS,
    ROLES,
    ADMIN,
} = require("../config/constants");
const User = require("../models/user.model");
const APIError = require("../utils/APIError");

const LOGGED_USER = "_loggedUser";

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
        if (user.role !== ADMIN && req.params.userId !== user._id.toString()) {
            apiError.status = httpStatus.FORBIDDEN;
            apiError.message = "No admin access";
            return next(apiError);
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
    const apiError = new APIError({
        message: error ? error.message : "Something went wrong. Try again",
        status: httpStatus.INTERNAL_SERVER_ERROR,
        stack: error ? error.stack : undefined,
    });

    try {
        if (user.role === ADMIN) {
            req.access = ADMINACCESS;
        } else if (ROLES.includes(user.role)) {
            req.access = DONORACCESS;
        } else {
            req.access = PUBLICACCESS;
        }
    } catch (e) {
        return next(e, apiError);
    }
    req.user = user;
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
