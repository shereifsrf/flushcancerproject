const httpStatus = require("http-status");
const { omit } = require("lodash");
const Campaign = require("../models/campaign.model");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const campaign = await Campaign.get(id);
        req.locals = { campaign };
        return next();
    } catch (error) {
        return next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        req.body.userId = req.user._id;
        req.body.createdBy = req.user._id;
        const campaign = new Campaign(req.body);
        const savedCampaign = await campaign.save();
        res.status(httpStatus.CREATED);
        res.json(savedCampaign.transform());
    } catch (error) {
        // next(Cam.checkDuplicateEmail(error));
        next(error);
    }
};

exports.list = async (req, res, next) => {
    try {
        const campaigns = await Campaign.list(req.query);
        const transformedCampaigns = campaigns.map((campaign) =>
            campaign.transform()
        );
        res.json(transformedCampaigns);
    } catch (error) {
        next(error);
    }
};
