const express = require("express");
const controller = require("../../controllers/campaign.approval.controller");
const {
    authorize,
    findAccess,
    LOGGED_USER,
    ADMIN,
} = require("../../middlewares/auth");

const router = express.Router();

router.param("campaignApprovalId", controller.load);

router
    .route("/")
    .get(authorize(ADMIN), controller.list)
    .post(authorize(LOGGED_USER), controller.create);

router
    .route("/:campaignApprovalId")
    .get(findAccess(), controller.get)
    .patch(authorize(ADMIN), controller.update)
    .delete(authorize(LOGGED_USER), controller.remove);

module.exports = router;
