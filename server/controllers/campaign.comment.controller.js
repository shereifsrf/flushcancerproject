const httpStatus = require("http-status");
const { omit, isUndefined } = require("lodash");
const { ADMIN } = require("../config/constants");
const CampaignComment = require("../models/campaign.comment.model");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const campaignComment = await CampaignComment.get(id);
        req.locals = { campaignComment };
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
        const campaignComment = new CampaignComment(req.body);
        const savedCampaignComment = await campaignComment.save();
        res.status(httpStatus.CREATED);
        res.json(savedCampaignComment.transform());
    } catch (error) {
        next(error);
    }
};

exports.list = async (req, res, next) => {
    try {
        const campaignComments = await CampaignComment.list(req.query);
        const transformedCampaignComments = campaignComments.map(
            (campaignComment) => campaignComment.transform()
        );
        res.json(transformedCampaignComments);
    } catch (error) {
        next(error);
    }
};

exports.update = (req, res, next) => {
    const userInCharge = req.user;
    let campaignComment = req.locals.campaignComment;
    campaignComment.updatedBy = userInCharge._id;

    Object.assign(campaignComment, req.body);

    campaignComment
        .save()
        .then((savedCampaignComment) =>
            res.json(savedCampaignComment.transform())
        )
        .catch((e) => next(e));
};

exports.remove = (req, res, next) => {
    const { campaignComment } = req.locals;

    campaignComment
        .remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};

exports.get = (req, res) => res.json(req.locals.campaignComment.transform());
