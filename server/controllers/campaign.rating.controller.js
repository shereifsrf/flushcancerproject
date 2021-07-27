const httpStatus = require("http-status");
const { omit, isUndefined, isEmpty } = require("lodash");
const { ADMIN } = require("../config/constants");
const CampaignRating = require("../models/campaign.rating.model");
const { getAvgRating } = require("./campaign.controller");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const campaignRating = await CampaignRating.get(id);
        req.locals = { campaignRating };
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
        const campaignRating = new CampaignRating(req.body);
        const savedCampaignRating = await campaignRating.save();
        const ratingRes = await getAvgRating(req.body.campaignId);
        const rating = !isEmpty(ratingRes[0]) ? ratingRes[0].rating : 0;

        res.status(httpStatus.CREATED);
        console.log(rating);
        res.json({
            ...savedCampaignRating.transform(),
            rating,
        });
    } catch (error) {
        next(CampaignRating.checkDuplicateInsert(error));
    }
};

exports.list = async (req, res, next) => {
    try {
        const campaignRatings = await CampaignRating.list(req.query);
        const transformedCampaignRatings = campaignRatings.map(
            (campaignRating) => campaignRating.transform()
        );
        res.json(transformedCampaignRatings);
    } catch (error) {
        next(error);
    }
};

exports.update = (req, res, next) => {
    const userInCharge = req.user;
    let campaignRating = req.locals.campaignRating;
    campaignRating.updatedBy = userInCharge._id;

    Object.assign(campaignRating, req.body);

    campaignRating
        .save()
        .then((savedCampaignRating) =>
            res.json(savedCampaignRating.transform())
        )
        .catch((e) => next(CampaignRating.checkDuplicateInsert(e)));
};

exports.remove = (req, res, next) => {
    const { campaignRating } = req.locals;

    campaignRating
        .remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};

exports.get = (req, res) => res.json(req.locals.campaignRating.transform());
