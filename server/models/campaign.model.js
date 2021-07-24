const { isNil, omitBy, pick } = require("lodash");
const mongoose = require("mongoose");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");
const { USER_CAMPAIGN_RATING_THRESHOLD } = require("../config/constants");
const Category = require("./category.model");

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
            default: Date.now() + 30,
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

campaignSchema.statics = {
    async get(id) {
        try {
            let campaign;

            if (mongoose.Types.ObjectId.isValid(id)) {
                campaign = await Campaign.findById(id)
                    .populate("categoryId")
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

    list({
        page = 1,
        perPage = 30,
        name,
        userId,
        categoryId,
        isVerified,
        minLimit,
        maxLimit,
    }) {
        const limit =
            minLimit && maxLimit
                ? { $gte: minLimit, $lte: maxLimit }
                : undefined;
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

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },
};

campaignSchema.method({
    async transform(user) {
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
            ];
            // console.log(this);

            if (user) {
                // console.log(this["userId"].toString() === user.id);
                if (user.id === this["userId"].toString())
                    this["editable"] = true;
                if (user.rating >= USER_CAMPAIGN_RATING_THRESHOLD)
                    this["isVerifyDocument"] = false;
            }

            await Promise.all(
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
                                console.log("yep");
                                const category = new Category(this[field]);
                                const transformedCategory =
                                    category.transform();
                                transformed["category"] = pick(
                                    transformedCategory,
                                    ["id", "name"]
                                );
                            } else if (this[field]) {
                                const categoryData = await Category.findById(
                                    this[field]
                                );
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
                                transformed["category"] = { id: "", name: "" };
                            }
                            break;
                        case "isVerified":
                            transformed[field] = this[field];
                            break;
                        default:
                            transformed[field] = this[field] || null;
                            break;
                    }
                })
            );

            // console.log(transformed);
            return transformed;
        } catch (e) {
            console.log(e);
        }
    },
});

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;
