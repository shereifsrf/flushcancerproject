const { isNil, omitBy, pick, isEmpty } = require("lodash");
const mongoose = require("mongoose");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");
const { USER_CAMPAIGN_RATING_THRESHOLD } = require("../config/constants");
const User = require("./user.model");
const controller = require("../controllers/campaign.controller");
const Category = require("./category.model");
const moment = require("moment-timezone");
const CampaignLike = require("./campaign.like.model");
const CampaignApproval = require("./campaign.approval.model");

/**
 * Campaign Schema
 * @private
 */
const campaignSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        document: {
            data: Buffer,
            contentType: String,
        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false,
        },
        limit: {
            type: mongoose.Schema.Types.Decimal128,
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: moment().add(30, "days"),
        },
        remarks: {
            type: String,
            trim: true,
        },
        isVerifyDocument: {
            type: Boolean,
            required: true,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);
campaignSchema.index({
    name: "text",
    description: "text",
});

campaignSchema.index({
    categoryId: 1,
});

campaignSchema.statics = {
    async get(id) {
        try {
            let campaign;

            if (mongoose.Types.ObjectId.isValid(id)) {
                campaign = await Campaign.findById(id)
                    .populate("categoryId")
                    .populate("userId")
                    .exec();

                // const campaign = await Campaign.findById(
                //     "60ea6a073afc6d5a34e1a193"
                // )
                //     .populate("categoryId")
                //     .exec();
                // console.log(campaign);
            }
            if (campaign) {
                // console.log("herer", campaign);
                return campaign;
            }

            throw new APIError({
                message: "Campaign does not exist",
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    async list({
        page = 1,
        perPage = 15,
        name,
        userId,
        categoryId,
        isVerified,
        minLimit,
        maxLimit,
        expiresAt,
        search,
    }) {
        let limit = {};

        page = parseInt(page);
        perPage = parseInt(perPage);
        minLimit = parseFloat(minLimit);
        maxLimit = parseFloat(maxLimit);

        if (!maxLimit && !minLimit) {
            limit = undefined;
        } else if (maxLimit === 0) {
            limit = { $gte: minLimit };
        } else if (minLimit === 0) {
            limit = { $lte: maxLimit };
        } else {
            limit =
                minLimit && maxLimit
                    ? { $gte: minLimit, $lte: maxLimit }
                    : undefined;
        }
        const options = omitBy(
            {
                name,
                userId,
                categoryId,
                isVerified,
                expiresAt,
                limit,
            },
            isNil
        );

        // console.log(search);
        let categories = [];

        if (search) {
            categories = await Category.find(
                {
                    $text: { $search: search },
                },
                "_id"
            );

            if (!isEmpty(categories)) {
                options.$or = [
                    {
                        categoryId: {
                            $in: categories.map((c) => c._id),
                        },
                    },
                ];
            } else {
                options["$text"] = { $search: search };
            }
        }

        return (
            this.aggregate()
                .match(options)
                // .project({ document: 0 })
                .facet({
                    campaigns: [
                        { $skip: perPage * (page - 1) },
                        { $limit: perPage },
                        { $sort: { createdAt: -1 } },
                    ],
                    total: [{ $count: "total" }],
                })
                .exec()
        );
    },
};

campaignSchema.method({
    async transform(user, isApproval = false) {
        try {
            const transformed = {};
            const fields = [
                "id",
                "userId",
                "categoryId",
                "name",
                "description",
                "document",
                "limit",
                "createdAt",
                "updatedAt",
                "createdBy",
                "updatedBy",
                "isVerified",
                "remarks",
                "isVerifyDocument",
                "editable",
                "expiresAt",
                "totalDonation",
            ];
            // console.log(this);

            if (user) {
                if (user.id === this["userId"]._id.toString())
                    this["editable"] = true;
                if (user.rating >= USER_CAMPAIGN_RATING_THRESHOLD)
                    this["isVerifyDocument"] = false;
            }

            //if not verified, check if has approval
            if (isApproval) {
                const campaignApproval = await CampaignApproval.findOne({
                    campaignId: this["id"],
                }).exec();

                if (campaignApproval && campaignApproval.isApproved === false) {
                    return await campaignApproval.transform();
                } else {
                    isApproval = false;
                }
            }

            //get the total donations
            let totalDonation = 0;
            let totalLikes = 0;
            let likable = true;
            let likeId = undefined;

            await Promise.all([
                controller
                    .getTotalDonation(this["id"])
                    .then(
                        (res) =>
                            (totalDonation = !isEmpty(res)
                                ? res[0].totalDonation
                                : 0)
                    ),
                getTotalLikes(this["id"]).then(
                    (res) =>
                        (totalLikes = !isEmpty(res) ? res[0].totalLikes : 0)
                ),

                CampaignLike.findOne(
                    {
                        campaignId: this["id"],
                        userId: user.id,
                    },
                    "_id",
                    function (err, like) {
                        // console.log(like);
                        if (!err && like) {
                            likable = false;
                            likeId = like._id;
                        }
                    }
                ),

                Promise.all(
                    fields.map(async (field) => {
                        switch (field) {
                            case "limit":
                                transformed[field] = parseFloat(
                                    this[field].toString()
                                );
                                break;
                            // case "isVerifyDocument":
                            //     transformed[field] =
                            //     break;
                            case "categoryId":
                                // console.log(this[field]);
                                if (this[field] && this[field].name) {
                                    // console.log("yep");
                                    const category = new Category(this[field]);
                                    const transformedCategory =
                                        category.transform();
                                    transformed["category"] = pick(
                                        transformedCategory,
                                        ["id", "name"]
                                    );
                                } else if (this[field]) {
                                    const categoryData =
                                        await Category.findById(this[field]);
                                    const category = new Category(categoryData);
                                    // console.log(category);
                                    const transformedCategory =
                                        category.transform();
                                    transformed["category"] = pick(
                                        transformedCategory,
                                        ["id", "name"]
                                    );
                                    // console.log("here");
                                } else {
                                    transformed["category"] = {
                                        id: "",
                                        name: "",
                                    };
                                }
                                break;
                            case "isVerified":
                                transformed[field] = this[field];
                                break;
                            case "userId":
                                if (this[field] && this[field].name) {
                                    // console.log("yep");
                                    const category = new User(this[field]);
                                    const transformedCategory =
                                        category.transform();
                                    transformed["user"] = pick(
                                        transformedCategory,
                                        ["id", "name"]
                                    );
                                } else if (this[field]) {
                                    const categoryData = await User.findById(
                                        this[field]
                                    );
                                    const category = new User(categoryData);
                                    // console.log(category);
                                    const transformedCategory =
                                        category.transform();
                                    transformed["user"] = pick(
                                        transformedCategory,
                                        ["id", "name"]
                                    );
                                    // console.log("here");
                                } else {
                                    transformed["user"] = { id: "", name: "" };
                                }
                                break;
                            default:
                                transformed[field] = this[field] || null;
                                break;
                        }
                    })
                ),
            ]);

            transformed["isApproval"] = isApproval;
            transformed["isDelete"] = false;
            transformed["isApproved"] = true;
            transformed["totalDonation"] = totalDonation;
            transformed["totalLikes"] = totalLikes;
            transformed["like"] = { likable, likeId };
            // console.log(transformed);
            return transformed;
        } catch (e) {
            console.log(e);
        }
    },
});

const getTotalLikes = async (campaignId) => {
    return new Promise((resolve, reject) => {
        CampaignLike.aggregate([
            {
                $match: {
                    campaignId: mongoose.Types.ObjectId(campaignId),
                },
            },
            {
                $group: {
                    _id: "$campaignId",
                    totalLikes: { $sum: 1 },
                },
            },
        ])
            .then((result) => resolve(result))
            .catch((error) => reject(error));
    });
};

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;
