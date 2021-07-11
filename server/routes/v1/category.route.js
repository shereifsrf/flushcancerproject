const express = require("express");
const controller = require("../../controllers/category.controller");
const { authorize, findAccess, ADMIN } = require("../../middlewares/auth");

const router = express.Router();

router.param("categoryId", controller.load);

router
    .route("/")
    .get(findAccess(), controller.list)
    .post(authorize(ADMIN), controller.create);

router
    .route("/:categoryId")
    .get(findAccess(), controller.get)
    .patch(authorize(ADMIN), controller.update)
    .delete(authorize(ADMIN), controller.remove);

module.exports = router;
