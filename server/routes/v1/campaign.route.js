const express = require("express");
const controller = require("../../controllers/campaign.controller");
const {
    authorize,
    findAccess,
    LOGGED_USER,
} = require("../../middlewares/auth");
const { upload } = require("../../utils");

const router = express.Router();

router.param("campaignId", controller.load);

router
    .route("/")
    .get(findAccess(), controller.list)
    .post(authorize(LOGGED_USER), upload.single("document"), controller.create);

router
    .route("/:campaignId")
    .get(findAccess(), controller.get)
    .patch(authorize(LOGGED_USER), upload.single("document"), controller.update)
    .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;
