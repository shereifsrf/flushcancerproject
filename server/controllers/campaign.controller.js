const httpStatus = require("http-status");
const { omit, isUndefined } = require("lodash");
const {
    ADMIN,
    ADMIN_ONLY_REPLACABLE_CAMPAIGN_FDS,
} = require("../config/constants");
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
        if (req.user.role !== ADMIN || isUndefined(req.body.userId))
            req.body.userId = req.user._id;

        req.body.document = {
            data: req.file.buffer,
            contentType: req.file.mimetype,
        };

        req.body.createdBy = req.user._id;
        const campaign = new Campaign(req.body);
        const savedCampaign = await campaign.save();
        res.status(httpStatus.CREATED);
        res.json(await savedCampaign.transform(req.user));
    } catch (error) {
        // next(Cam.checkDuplicateEmail(error));
        next(error);
    }
};

exports.list = async (req, res, next) => {
    try {
        const campaigns = await Campaign.list(req.query);
        const transformedCampaigns = await Promise.all(
            campaigns.map((campaign) => campaign.transform(req.user))
        );
        res.json(transformedCampaigns);
    } catch (error) {
        next(error);
    }
};

exports.update = (req, res, next) => {
    const userInCharge = req.user;
    let campaign = req.locals.campaign;

    req.body.document = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
    };

    const ommitFields =
        userInCharge.role !== ADMIN ? ADMIN_ONLY_REPLACABLE_CAMPAIGN_FDS : [];
    const updatedCampaign = omit(req.body, ommitFields);
    campaign.updatedBy = userInCharge._id;

    Object.assign(campaign, updatedCampaign);

    campaign
        .save()
        .then(async (savedCampaign) =>
            res.json(await savedCampaign.transform(req.user))
        )
        .catch((e) => next(e));
};

exports.remove = (req, res, next) => {
    const { campaign } = req.locals;

    campaign
        .remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};

exports.get = async (req, res) =>
    res.send(await req.locals.campaign.transform(req.user));
