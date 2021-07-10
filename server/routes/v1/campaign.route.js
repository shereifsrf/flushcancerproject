const express = require("express");
const controller = require("../../controllers/campaign.controller");
const { authorize, findAccess } = require("../../middlewares/auth");

const router = express.Router();

router.param("campaignId", controller.load);

router
    .route("/")
    .get(findAccess(), controller.list)
    .post(authorize(), controller.create);

module.exports = router;
