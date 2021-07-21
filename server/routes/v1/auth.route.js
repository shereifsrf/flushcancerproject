const express = require("express");
const { validate } = require("express-validation");
const controller = require("../../controllers/auth.controller");
const { oAuth: oAuthLogin, findAccess } = require("../../middlewares/auth");
const {
    login,
    register,
    oAuth,
    refresh,
    sendPasswordReset,
    passwordReset,
    verifyUser,
} = require("../../validations/auth.validation");

const router = express.Router();
router.route("/").post(findAccess(), controller.verifyToken);
router.route("/register").post(validate(register), controller.register);
router.route("/login").post(validate(login), controller.login);
router.route("/refresh-token").post(validate(refresh), controller.refresh);
router
    .route("/verify-user")
    .post(validate(verifyUser), controller.verifyUserEmail);

router
    .route("/send-password-reset")
    .post(validate(sendPasswordReset), controller.sendPasswordReset);

router
    .route("/reset-password")
    .post(validate(passwordReset), controller.resetPassword);

router
    .route("/facebook")
    .post(validate(oAuth), oAuthLogin("facebook"), controller.oAuth);

router
    .route("/google")
    .post(validate(oAuth), oAuthLogin("google"), controller.oAuth);

module.exports = router;
