const httpStatus = require("http-status");
const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const PasswordResetToken = require("../models/passwordResetToken.model");
const moment = require("moment-timezone");
const { jwtExpirationInterval } = require("../config/vars");
const { omit, isEmpty } = require("lodash");
const APIError = require("../utils/APIError");
const emailProvider = require("../services/emails/emailProvider");

/**
 * Returns a formated object with tokens
 * @private
 */
function generateTokenResponse(user, accessToken) {
    const tokenType = "Bearer";
    const refreshToken = RefreshToken.generate(user).token;
    const expiresIn = moment().add(jwtExpirationInterval, "minutes");
    return {
        tokenType,
        accessToken,
        refreshToken,
        expiresIn,
    };
}

/**
 * Returns jwt token if registration was successful
 * @public
 */
exports.register = async (req, res, next) => {
    try {
        const userData = { ...req.body };
        const user = await new User(userData).save();
        const userTransformed = user.transform();
        const token = generateTokenResponse(user, user.token());

        if (token && userTransformed) {
            // const userObj = await PasswordResetToken.generate(user);
            emailProvider.sendEmailVerification({
                token: token,
                user: userTransformed,
            });
            res.status(httpStatus.OK);
            return res.json("success");
        }
        throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: "Oops, something wrong! Contact our admin",
        });
    } catch (error) {
        return next(User.checkDuplicateEmail(error));
    }
};

exports.register_old = async (req, res, next) => {
    try {
        const userData = omit(req.body, "role");
        const user = await new User(userData).save();
        const userTransformed = user.transform();
        const token = generateTokenResponse(user, user.token());
        res.status(httpStatus.CREATED);
        return res.json({ token, user: userTransformed });
    } catch (error) {
        return next(User.checkDuplicateEmail(error));
    }
};

/**
 * Returns jwt token if valid username and password is provided
 * @public
 */
exports.login = async (req, res, next) => {
    try {
        const { user, accessToken } = await User.findAndGenerateToken(req.body);
        const token = generateTokenResponse(user, accessToken);
        const userTransformed = user.transform();
        return res.json({ token, user: userTransformed });
    } catch (error) {
        return next(error);
    }
};

/**
 * login with an existing user or creates a new one if valid accessToken token
 * Returns jwt token
 * @public
 */
exports.oAuth = async (req, res, next) => {
    try {
        const { user } = req;
        const accessToken = user.token();
        const token = generateTokenResponse(user, accessToken);
        const userTransformed = user.transform();
        return res.json({ token, user: userTransformed });
    } catch (error) {
        return next(error);
    }
};

/**
 * Returns a new jwt when given a valid refresh token
 * @public
 */
exports.refresh = async (req, res, next) => {
    try {
        const { email, refreshToken } = req.body;
        const refreshObject = await RefreshToken.findOneAndRemove({
            userEmail: email,
            token: refreshToken,
        });
        const { user, accessToken } = await User.findAndGenerateToken({
            email,
            refreshObject,
        });
        const response = generateTokenResponse(user, accessToken);
        return res.json(response);
    } catch (error) {
        return next(error);
    }
};

exports.verifyUserEmail = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        let { user, accessToken } = { user: {}, accessToken: {} };
        let email = "";
        const refreshObject = await RefreshToken.findOneAndRemove({
            token: refreshToken,
        });
        if (refreshObject) {
            email = refreshObject.userEmail;
            user = await User.findOneAndUpdate(
                { email },
                { isEmailVerified: true },
                { new: true }
            );
            // await user.save();

            ({ user, accessToken } = await User.findAndGenerateToken({
                email,
                refreshObject,
            }));
        } else {
            throw new APIError({
                status: httpStatus.NOT_FOUND,
                message: "Invalid link, please contact admin!",
            });
        }
        const userTransformed = user.transform();
        const token = generateTokenResponse(user, accessToken);
        return res.json({ token, user: userTransformed });
    } catch (error) {
        return next(error);
    }
};

exports.sendPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).exec();

        if (user) {
            const passwordResetObj = await PasswordResetToken.generate(user);
            emailProvider.sendPasswordReset(passwordResetObj);
            res.status(httpStatus.OK);
            return res.json("success");
        }
        throw new APIError({
            status: httpStatus.UNAUTHORIZED,
            message: "No account found with that email",
        });
    } catch (error) {
        return next(error);
    }
};

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, password, resetToken } = req.body;
        const resetTokenObject = await PasswordResetToken.findOneAndRemove({
            userEmail: email,
            resetToken,
        });

        const err = {
            status: httpStatus.UNAUTHORIZED,
            isPublic: true,
        };
        if (!resetTokenObject) {
            err.message = "Cannot find matching reset token";
            throw new APIError(err);
        }
        if (moment().isAfter(resetTokenObject.expires)) {
            err.message = "Reset token is expired";
            throw new APIError(err);
        }

        const user = await User.findOne({
            email: resetTokenObject.userEmail,
        }).exec();
        user.password = password;
        //saving has a pre requesite to encrypt the password
        await user.save();
        emailProvider.sendPasswordChangeEmail(user);

        res.status(httpStatus.OK);
        return res.json("Password Updated");
    } catch (error) {
        return next(error);
    }
};

exports.verifyToken = (req, res, next) => {
    const apiError = new APIError({
        message: req.error
            ? req.error.message
            : "Something went wrong. Try again",
        status: httpStatus.INTERNAL_SERVER_ERROR,
        stack: req.error ? req.error.stack : undefined,
    });

    if (!req.body) {
        apiError.message = `no "email" found`;
        apiError.status = httpStatus.NOT_FOUND;
        return req.next(apiError);
    } else if (req.user && req.body.email) {
        if (req.user.email !== req.body.email) {
            apiError.message = `"email" does not match`;
            apiError.status = httpStatus.NOT_FOUND;
            return req.next(apiError);
        } else return res.status(httpStatus.OK).send(req.user.transform());
    } else return req.next(apiError);
};
