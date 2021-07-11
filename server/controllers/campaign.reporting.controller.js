const httpStatus = require("http-status");
const { omit, isUndefined } = require("lodash");
const { ADMIN } = require("../config/constants");
const CampaignReporting = require("../models/campaign.reporting.model");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const campaignReporting = await CampaignReporting.get(id);
        req.locals = { campaignReporting };
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
        const campaignReporting = new CampaignReporting(req.body);
        const savedCampaignReporting = await campaignReporting.save();
        res.status(httpStatus.CREATED);
        res.json(savedCampaignReporting.transform());
    } catch (error) {
        next(error);
    }
};

exports.list = async (req, res, next) => {
    try {
        const campaignReportings = await CampaignReporting.list(req.query);
        const transformedCampaignReportings = campaignReportings.map(
            (campaignReporting) => campaignReporting.transform()
        );
        res.json(transformedCampaignReportings);
    } catch (error) {
        next(error);
    }
};

exports.update = (req, res, next) => {
    const userInCharge = req.user;
    let campaignReporting = req.locals.campaignReporting;
    campaignReporting.updatedBy = userInCharge._id;

    Object.assign(campaignReporting, req.body);

    campaignReporting
        .save()
        .then((savedCampaignReporting) =>
            res.json(savedCampaignReporting.transform())
        )
        .catch((e) => next(e));
};

exports.remove = (req, res, next) => {
    const { campaignReporting } = req.locals;

    campaignReporting
        .remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};

exports.get = (req, res) => res.json(req.locals.campaignReporting.transform());
