const express = require("express");
const controller = require("../../controllers/donation.controller");
const {
    authorize,
    findAccess,
    LOGGED_USER,
    ADMIN,
} = require("../../middlewares/auth");

const router = express.Router();

router.param("donationId", controller.load);

router
    .route("/")
    .get(findAccess(), controller.list)
    .post(authorize(LOGGED_USER), controller.create);

router
    .route("/:donationId")
    .get(authorize(LOGGED_USER), controller.get)
    .patch(authorize(LOGGED_USER), controller.update)
    .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;
