const httpStatus = require("http-status");
const { omit, isUndefined, isEmpty } = require("lodash");
const { ADMIN } = require("../config/constants");
const Campaign = require("../models/campaign.model");
const Donation = require("../models/donation.model");
const APIError = require("../utils/APIError");

/**
 * Load user and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const donation = await Donation.get(id);
        req.locals = { donation };
        return next();
    } catch (error) {
        return next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        if (req.user.role !== ADMIN || isUndefined(req.body.userId))
            req.body.userId = req.user._id;
        // console.log("herer1s");

        const apiError = new APIError({
            message: "Campaign not verified or found",
            status: httpStatus.UNAUTHORIZED,
            stack: undefined,
        });

        const campaign = await Campaign.find(
            { _id: req.body.campaignId },
            { isVerified: 1 }
        ).exec();

        // console.log("herer", campaign);

        if (isEmpty(campaign) || !campaign[0].isVerified) {
            throw apiError;
        }

        req.body.createdBy = req.user._id;
        const donation = new Donation(req.body);
        const savedDonation = await donation.save();
        res.status(httpStatus.CREATED);
        res.json(savedDonation.transform());
    } catch (error) {
        next(Donation.checkDuplicateInsert(error));
    }
};

exports.list = async (req, res, next) => {
    try {
        const userInCharge = req.user;
        let query = req.query;
        if (userInCharge && userInCharge.role !== ADMIN) {
            query.userId = userInCharge.id;
        }
        const donations = await Donation.list(query);
        const transformedDonations = donations.map((donation) =>
            donation.transform()
        );
        res.json(transformedDonations);
    } catch (error) {
        next(error);
    }
};

exports.update = (req, res, next) => {
    const userInCharge = req.user;
    let donation = req.locals.donation;
    donation.updatedBy = userInCharge._id;

    Object.assign(donation, req.body);

    donation
        .save()
        .then((savedDonation) => res.json(savedDonation.transform()))
        .catch((e) => next(Donation.checkDuplicateInsert(e)));
};

exports.remove = (req, res, next) => {
    const { donation } = req.locals;

    donation
        .remove()
        .then(() => res.status(httpStatus.NO_CONTENT).end())
        .catch((e) => next(e));
};

exports.get = (req, res) => res.json(req.locals.donation.transform());
