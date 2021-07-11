const express = require("express");
const controller = require("../../controllers/campaign.controller");
const {
    authorize,
    findAccess,
    LOGGED_USER,
} = require("../../middlewares/auth");

const router = express.Router();

router.param("campaignId", controller.load);

router
    .route("/")
    .get(findAccess(), controller.list)
    .post(authorize(LOGGED_USER), controller.create);

router
    .route("/:campaignId")
    .get(findAccess(), controller.get)
    .patch(authorize(LOGGED_USER), controller.update)
    .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;
