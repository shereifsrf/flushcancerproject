const express = require("express");
const controller = require("../../controllers/campaign.rating.controller");
const {
    authorize,
    findAccess,
    LOGGED_USER,
    ADMIN,
} = require("../../middlewares/auth");

const router = express.Router();

router.param("campaignRatingId", controller.load);

router
    .route("/")
    .get(authorize(ADMIN), controller.list)
    .post(authorize(LOGGED_USER), controller.create);

router
    .route("/:campaignRatingId")
    .get(findAccess(), controller.get)
    .patch(authorize(LOGGED_USER), controller.update)
    .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;
