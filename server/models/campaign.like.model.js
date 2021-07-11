const mongoose = require("mongoose");
const { isNil, omitBy } = require("lodash");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");

const campaignLikeSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
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
    },
    {
        timestamps: true,
    }
);
campaignLikeSchema.index({ userId: 1, camapignId: 1 }, { unique: true });

campaignLikeSchema.statics = {
    async get(id) {
        try {
            let campaignLike;

            if (mongoose.Types.ObjectId.isValid(id)) {
                campaignLike = await this.findById(id).exec();
            }
            if (campaignLike) {
                return campaignLike;
            }

            throw new APIError({
                message: "CampaignLike does not exist",
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    list({
        page = 1,
        perPage = 30,
        userId,
        campaignId,
        updatedBy,
        createdBy,
        updatedAt,
        createdAt,
    }) {
        const options = omitBy(
            {
                userId,
                campaignId,
                updatedBy,
                createdBy,
                updatedAt,
                createdAt,
            },
            isNil
        );

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },
    checkDuplicateInsert(error) {
        if (error.name === "MongoError" && error.code === 11000) {
            return new APIError({
                message: "Validation Error",
                errors: [
                    {
                        field: "user and campaign",
                        location: "body",
                        messages: ["already liked"],
                    },
                ],
                status: httpStatus.CONFLICT,
                isPublic: true,
                stack: error.stack,
            });
        }
        return error;
    },
};

campaignLikeSchema.method({
    transform() {
        const transformed = {};
        // const publicFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedBy"];
        const fields = [
            "id",
            "userId",
            "campaignId",
            "createdAt",
            "updatedAt",
            "createdBy",
            "updatedBy",
        ];
        // const adminFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedAt", "createdBy", "updatedBy"];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
});

const CampaignLike = mongoose.model("CampaignLike", campaignLikeSchema);
module.exports = CampaignLike;
