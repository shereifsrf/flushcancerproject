const httpStatus = require("http-status");
const { omit, isUndefined } = require("lodash");
const moment = require("moment-timezone");
const {
    ADMIN,
    ADMIN_ONLY_REPLACABLE_CAMPAIGN_FDS,
    DONOR,
    CAMPAIGNER,
} = require("../config/constants");
const Campaign = require("../models/campaign.model");
const Donation = require("../models/donation.model");
const User = require("../models/user.model");
const ObjectId = require("mongoose").Types.ObjectId;

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

        if (req.file) {
            req.body.document = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

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
        let query = req.query;
        const user = req.user;

        query.isVerified = true;

        if (user && user.role === ADMIN) {
            delete query.isVerified;
        }
        if (user && query && query.dashboard !== "false") {
            // console.log("here", query);
            query = {
                ...omit(query, ["dashboard", "isVerified"]),
                userId: req.user.id,
            };
            console.log("here", query);
        }
        const campaigns = await Campaign.list(query);
        const transformedCampaigns = await Promise.all(
            campaigns.map((campaign) => campaign.transform(req.user))
        );
        res.json(transformedCampaigns);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const userInCharge = req.user;
        let campaign = req.locals.campaign;

        if (req.file) {
            req.body.document = {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            };
        }

        let ommitFields = [];
        if (userInCharge.role !== ADMIN) {
            ommitFields = ADMIN_ONLY_REPLACABLE_CAMPAIGN_FDS;
        } else {
            const body = req.body;
            if (body && body.isVerified) {
                try {
                    const user = await User.get(req.locals.campaign.userId);
                    if (user.role === DONOR) {
                        user.role = CAMPAIGNER;
                        user.save().catch((e) => next(e));
                    }
                } catch (error) {
                    return next(error);
                }
            }
        }

        const updatedCampaign = omit(req.body, ommitFields);
        campaign.updatedBy = userInCharge._id;

        Object.assign(campaign, updatedCampaign);

        campaign
            .save()
            .then(async (savedCampaign) =>
                res.json(await savedCampaign.transform(req.user))
            )
            .catch((e) => next(e));
    } catch (error) {
        return next(error);
    }
};

exports.remove = async (req, res, next) => {
    const { campaign } = req.locals;

    campaign
        .remove()
        .then(async () =>
            res.status(httpStatus.OK).json(await campaign.transform())
        )
        .catch((e) => next(e));
};

exports.get = async (req, res) => {
    // console.log("herer");
    //get all the comments
    // try {
    //     const d = await Donation.aggregate([
    //         {
    //             $match: { campaignId: ObjectId("60fb8b886b921944041fdd1d") },
    //         },
    //         {
    //             $group: {
    //                 _id: "$campaignId",
    //                 totalDonation: { $sum: "$amount" },
    //             },
    //         },
    //     ]);
    // } catch (error) {
    //     console.log("herer");
    //     return next(error);
    // }
    // const d = await Campaign.find(
    //     { _id: "60e95a8533169558cc034ffd" },
    //     { isVerified: 1 }
    // );
    res.send(await req.locals.campaign.transform(req.user));
};
