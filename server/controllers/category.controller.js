const httpStatus = require("http-status");
const { omit, isUndefined } = require("lodash");
const { ADMIN } = require("../config/constants");
const Category = require("../models/category.model");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const category = await Category.get(id);
        req.locals = { category };
        return next();
    } catch (error) {
        return next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        if (req.user.role !== ADMIN || isUndefined(req.body.userId))
            req.body.userId = req.user._id;

        req.body.createdBy = req.user._id;
        const category = new Category(req.body);
        const savedCategory = await category.save();
        res.status(httpStatus.CREATED);
        res.json(savedCategory.transform());
    } catch (error) {
        // next(Cam.checkDuplicateEmail(error));
        next(error);
    }
};

exports.list = async (req, res, next) => {
    try {
        const categories = await Category.list(req.query);
        const transformedCategories = categories.map((category) =>
            category.transform()
        );
        res.json(transformedCategories);
    } catch (error) {
        next(error);
    }
};

exports.update = (req, res, next) => {
    const userInCharge = req.user;
    let category = req.locals.category;
    category.updatedBy = userInCharge._id;
    Object.assign(category, req.body);

    category
        .save()
        .then((savedCategory) => res.json(savedCategory.transform()))
        .catch((e) => next(e));
};

exports.remove = (req, res, next) => {
    const { category } = req.locals;

    category
        .remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};

exports.get = (req, res) => res.json(req.locals.category.transform());
