const { isNil, omitBy } = require("lodash");
const mongoose = require("mongoose");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");

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
        remarks: {
            type: String,
            trim: true,
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
                campaign = await this.findById(id).exec();
            }
            if (campaign) {
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
    transform() {
        const transformed = {};
        // const publicFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedBy"];
        const fields = [
            "id",
            "userId",
            "categoryId",
            "name",
            "description",
            "limit",
            "createdAt",
            "updatedAt",
            "createdBy",
            "updatedBy",
            "isVerified",
            "remarks",
        ];
        // const adminFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedAt", "createdBy", "updatedBy"];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
});

const Campaign = mongoose.model("Campaign", campaignSchema);
module.exports = Campaign;
