const httpStatus = require("http-status");
const { omit, isUndefined } = require("lodash");
const { ADMIN } = require("../config/constants");
const CampaignApproval = require("../models/campaign.approval.model");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const campaignApproval = await CampaignApproval.get(id);
        req.locals = { campaignApproval };
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
        const campaignApproval = new CampaignApproval(req.body);
        const savedCampaignApproval = await campaignApproval.save();
        res.status(httpStatus.CREATED);
        res.json(savedCampaignApproval.transform());
    } catch (error) {
        next(CampaignApproval.checkDuplicateInsert(error));
    }
};

exports.list = async (req, res, next) => {
    try {
        const campaignApprovals = await CampaignApproval.list(req.query);
        const transformedCampaignApprovals = campaignApprovals.map(
            (campaignApproval) => campaignApproval.transform()
        );
        res.json(transformedCampaignApprovals);
    } catch (error) {
        next(error);
    }
};

exports.update = (req, res, next) => {
    const userInCharge = req.user;
    let campaignApproval = req.locals.campaignApproval;
    campaignApproval.updatedBy = userInCharge._id;

    Object.assign(campaignApproval, req.body);

    campaignApproval
        .save()
        .then((savedCampaignApproval) =>
            res.json(savedCampaignApproval.transform())
        )
        .catch((e) => next(CampaignApproval.checkDuplicateInsert(e)));
};

exports.remove = (req, res, next) => {
    const { campaignApproval } = req.locals;

    campaignApproval
        .remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};

exports.get = (req, res) => res.json(req.locals.campaignApproval.transform());
