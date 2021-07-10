const express = require("express");
const controller = require("../../controllers/category.controller");
const { authorize, findAccess, ADMIN } = require("../../middlewares/auth");

const router = express.Router();

router.param("categoryId", controller.load);

router
    .route("/")
    .get(findAccess(), controller.list)
    .post(authorize(ADMIN), controller.create);

module.exports = router;
