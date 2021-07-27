const express = require("express");
const controller = require("../../controllers/campaign.proof.controller");
const {
    authorize,
    findAccess,
    LOGGED_USER,
    ADMIN,
} = require("../../middlewares/auth");
const { upload } = require("../../utils");

const router = express.Router();

router.param("campaignProofId", controller.load);

router
    .route("/")
    .get(authorize(LOGGED_USER), controller.list)
    .post(authorize(LOGGED_USER), upload.single("document"), controller.create);

router
    .route("/:campaignProofId")
    .get(findAccess(), controller.get)
    .patch(authorize(LOGGED_USER), controller.update)
    .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;
