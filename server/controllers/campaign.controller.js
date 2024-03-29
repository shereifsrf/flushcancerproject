const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omit, isUndefined, isEmpty, omitBy, isNil } = require("lodash");
const {
    ADMIN,
    ADMIN_ONLY_REPLACABLE_CAMPAIGN_FDS,
    DONOR,
    CAMPAIGNER,
} = require("../config/constants");
const User = require("../models/user.model");
const Campaign = require("../models/campaign.model");
const CampaignComment = require("../models/campaign.comment.model");
const CampaignRating = require("../models/campaign.rating.model");
const Donation = require("../models/donation.model");
const CampaignApproval = require("../models/campaign.approval.model");

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
        if (query.expiresAt) {
            query.expiresAt = { $gte: new Date() };
        }
        if (user && query && query.dashboard !== "false") {
            // console.log("here", query);
            query = {
                ...omit(query, ["dashboard", "isVerified", "expiresAt"]),
                userId: req.user._id,
            };
            // console.log("here", query);
        }

        if (query.categoryId) {
            query.categoryId = mongoose.Types.ObjectId(query.categoryId);
        }
        const campaigns = await Campaign.list(query);

        let transformedCampaigns = {};
        let total = 0;

        if (!isEmpty(campaigns)) {
            if (!isEmpty(campaigns[0].campaigns)) {
                transformedCampaigns = await Promise.all(
                    campaigns[0].campaigns.map((campaign) =>
                        new Campaign(campaign).transform(req.user)
                    )
                );
            }
            if (!isEmpty(campaigns[0].total)) {
                total = campaigns[0].total[0].total;
            }
        }
        res.json({
            campaigns: transformedCampaigns,
            total,
        });
    } catch (error) {
        // console.log(error);
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

        if (campaign.isVerified) {
            if (req.body.isDelete === "true") {
                req.body.isDelete = true;
            } else if (req.body.isDelete === "false") {
                req.body.isDelete = false;
                req.body.isApproved = true;
            }
            //get the campaign-approval form and update there
            let campaignApproval = await CampaignApproval.findOne({
                campaignId: campaign.id,
            }).exec();

            if (campaignApproval) {
                Object.assign(campaignApproval, {
                    isApproved: false,
                    isReject: false,
                    ...req.body,
                });
                campaignApproval
                    .save()
                    .then(async (savedCampaignApproval) =>
                        res.json(await savedCampaignApproval.transform())
                    )
                    .catch((e) => next(e));
            } else {
                //create campaign approval

                let toSaveCampaignApproval = omit(campaign, [
                    "createdAt",
                    "updatedAt",
                    "updatedBy",
                    ...ommitFields,
                ]);
                Object.assign(toSaveCampaignApproval, req.body);
                toSaveCampaignApproval.campaignId = toSaveCampaignApproval.id;
                delete toSaveCampaignApproval.id;
                campaignApproval = new CampaignApproval(toSaveCampaignApproval)
                    .save()
                    .then(async (savedCampaignApproval) =>
                        res.json(await savedCampaignApproval.transform())
                    )
                    .catch((e) => next(e));
            }
        } else {
            delete req.body.isDelete;
            const updatedCampaign = omit(req.body, ommitFields);
            campaign.updatedBy = userInCharge._id;

            Object.assign(campaign, updatedCampaign);

            campaign
                .save()
                .then(async (savedCampaign) =>
                    res.json(await savedCampaign.transform(req.user))
                )
                .catch((e) => next(e));
        }
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
    //get all the comments
    const query = req.query;
    if (query.comments) {
        query.campaignId = req.locals.campaign.id;
    }
    const result = await Promise.all([
        req.locals.campaign.transform(req.user, query.isApproval === "true"),
        getComments(req.user, query),
    ]);

    res.send({ ...result[0], comments: result[1] });
};

exports.getRating = async (req, res) => {
    //get rating details of the campaign
    const campaignId = req.locals.campaign.id;
    const userInCharge = req.user;

    const result = await Promise.all([
        getAvgRating(campaignId),
        findRatable(
            campaignId,
            !isEmpty(userInCharge) ? userInCharge : undefined
        ),
    ]);

    const rating = !isEmpty(result[0][0]) ? result[0][0].rating : 0;
    const ratable = !isEmpty(result[1]) ? false : true;
    res.send({ rating, ratable });
};

const getComments = async (user, query) => {
    const comments = await CampaignComment.list(query);
    // console.log(comments);
    return await Promise.all(
        comments.map((comment) => comment.transform(user))
    );
};

const getAvgRating = (exports.getAvgRating = async (campaignId) => {
    return await CampaignRating.aggregate([
        {
            $match: {
                campaignId: mongoose.Types.ObjectId(campaignId),
            },
        },
        {
            $group: {
                _id: "none",
                rating: { $avg: "$star" },
            },
        },
    ]);
});

const findRatable = async (campaignId, userId) => {
    return await CampaignRating.findOne(
        {
            ...omitBy({ campaignId, userId }, isNil),
        },
        "_id"
    );
};

module.exports.getTotalDonation = async (campaignId) => {
    return await Donation.aggregate([
        {
            $match: {
                campaignId: mongoose.Types.ObjectId(campaignId),
            },
        },
        {
            $group: {
                _id: "$campaignId",
                totalDonation: { $sum: "$amount" },
            },
        },
    ]).exec();
};
