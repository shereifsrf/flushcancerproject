const httpStatus = require("http-status");
const { omit } = require("lodash");
const Category = require("../models/category.model");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const category = await category.get(id);
        req.locals = { category };
        return next();
    } catch (error) {
        return next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        req.body.createdBy = req.user._id;
        const category = new Category(req.body);
        const savedcategory = await category.save();
        res.status(httpStatus.CREATED);
        res.json(savedcategory.transform());
    } catch (error) {
        // next(Cam.checkDuplicateEmail(error));
        next(error);
    }
};

exports.list = async (req, res, next) => {
    try {
        const categories = await Category.list(req.query);
        const transformedcategories = categories.map((category) =>
            category.transform()
        );
        res.json(transformedcategories);
    } catch (error) {
        next(error);
    }
};
