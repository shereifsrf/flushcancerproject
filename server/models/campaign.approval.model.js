const { isNil, omitBy, isEmpty, pick } = require("lodash");
const mongoose = require("mongoose");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");
const Category = require("./category.model");
const moment = require("moment-timezone");

/**
 * CampaignApproval Schema
 * @private
 */
const campaignApprovalSchema = new mongoose.Schema(
    {
        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
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
        isApproved: {
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
    },
    {
        timestamps: true,
    }
);

campaignApprovalSchema.statics = {
    async get(id) {
        try {
            let campaignApproval;

            if (mongoose.Types.ObjectId.isValid(id)) {
                campaignApproval = await CampaignApproval.findById(id)
                    .populate("categoryId")
                    .populate("userId")
                    .exec();
            }
            if (campaignApproval) {
                // console.log("herer", campaignApproval);
                return campaignApproval;
            }

            throw new APIError({
                message: "CampaignApproval does not exist",
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
                limit,
            },
            isNil
        );

        console.log(search);
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
                    campaignApprovals: [
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

campaignApprovalSchema.method({
    async transform() {
        try {
            const transformed = {};
            const fields = [
                "id",
                "campaignId",
                "categoryId",
                "name",
                "description",
                "document",
                "limit",
                "createdAt",
                "updatedAt",
                "createdBy",
                "updatedBy",
                "isApproved",
                "remarks",
                "expiresAt",
            ];
            // console.log(this);

            await Promise.all(
                fields.map(async (field) => {
                    if (field === "categoryId") {
                        const categoryData = await Category.findById(
                            this[field]
                        );
                        if (categoryData) {
                            const category = new Category(categoryData);
                            // console.log(category);
                            const transformedCategory = category.transform();
                            transformed["category"] = pick(
                                transformedCategory,
                                ["id", "name"]
                            );
                        } else {
                            transformed["category"] = {
                                id: "",
                                name: "",
                            };
                        }
                    }
                    transformed[field] = this[field];
                })
            );

            transformed.isApproval = true;
            transformed.editable = true;
            transformed.isVerified = true;
            return transformed;
        } catch (e) {
            console.log(e);
        }
    },
});

const CampaignApproval = mongoose.model(
    "CampaignApproval",
    campaignApprovalSchema
);
module.exports = CampaignApproval;
