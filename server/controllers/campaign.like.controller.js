const httpStatus = require("http-status");
const { omit, isUndefined } = require("lodash");
const { ADMIN } = require("../config/constants");
const CampaignLike = require("../models/campaign.like.model");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const campaignLike = await CampaignLike.get(id);
        req.locals = { campaignLike };
        return next();
    } catch (error) {
        return next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        if (req.user.role !== ADMIN || isUndefined(req.body.userId))
            req.body.userId = req.user.id;

        req.body.createdBy = req.user.id;
        const campaignLike = new CampaignLike(req.body);
        const savedCampaignLike = await campaignLike.save();
        res.status(httpStatus.CREATED);
        res.json(savedCampaignLike.transform());
    } catch (error) {
        next(CampaignLike.checkDuplicateInsert(error));
    }
};

exports.list = async (req, res, next) => {
    try {
        const campaignLikes = await CampaignLike.list(req.query);
        const transformedCampaignLikes = campaignLikes.map((campaignLike) =>
            campaignLike.transform()
        );
        res.json(transformedCampaignLikes);
    } catch (error) {
        next(error);
    }
};

exports.update = (req, res, next) => {
    const userInCharge = req.user;
    let campaignLike = req.locals.campaignLike;
    campaignLike.updatedBy = userInCharge._id;

    Object.assign(campaignLike, req.body);

    campaignLike
        .save()
        .then((savedCampaignLike) => res.json(savedCampaignLike.transform()))
        .catch((e) => next(CampaignLike.checkDuplicateInsert(e)));
};

exports.remove = (req, res, next) => {
    const { campaignLike } = req.locals;

    campaignLike
        .remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};

exports.get = (req, res) => res.json(req.locals.campaignLike.transform());
