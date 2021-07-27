const httpStatus = require("http-status");
const { omit, isUndefined } = require("lodash");
const {
    ADMIN,
    ADMIN_ONLY_REPLACABLE_PROOF_FDS,
} = require("../config/constants");
const CampaignProof = require("../models/campaign.proof.model");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const campaignProof = await CampaignProof.get(id);
        req.locals = { campaignProof };
        return next();
    } catch (error) {
        return next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        if (req.user.role !== ADMIN || isUndefined(req.body.userId))
            req.body.userId = req.user._id;

        if (req.file) {
            req.body.document = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        req.body.createdBy = req.user._id;
        const campaignProof = new CampaignProof(req.body);
        const savedCampaignProof = await campaignProof.save();
        res.status(httpStatus.CREATED);
        res.json(savedCampaignProof.transform());
    } catch (error) {
        next(error);
    }
};

exports.list = async (req, res, next) => {
    try {
        const query = req.query;
        // console.log(c);
        const campaignComments = await CampaignProof.list(query);
        const transformedCampaignProofs = campaignComments.map(
            (campaignProof) => campaignProof.transform()
        );
        res.json(transformedCampaignProofs);
    } catch (error) {
        next(error);
    }
};

exports.update = (req, res, next) => {
    try {
        const userInCharge = req.user;
        let campaignProof = req.locals.campaignProof;

        if (req.file) {
            req.body.document = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        let ommitFields = [];
        if (userInCharge.role !== ADMIN) {
            ommitFields = ADMIN_ONLY_REPLACABLE_PROOF_FDS;
        }

        const updatedCampaignProof = omit(req.body, ommitFields);
        campaignProof.updatedBy = userInCharge._id;

        Object.assign(campaignProof, updatedCampaignProof);

        campaignProof
            .save()
            .then(async (savedCampaignProof) =>
                res.json(await savedCampaignProof.transform(req.user))
            )
            .catch((e) => next(e));
    } catch (error) {
        return next(error);
    }
};

exports.remove = (req, res, next) => {
    const { campaignProof } = req.locals;

    campaignProof
        .remove()
        .then(() => res.status(httpStatus.OK).end())
        .catch((e) => next(e));
};

exports.get = (req, res) => res.json(req.locals.campaignProof.transform());
