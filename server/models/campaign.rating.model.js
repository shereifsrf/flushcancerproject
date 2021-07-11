const mongoose = require("mongoose");
const { isNil, omitBy } = require("lodash");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");

const campaignRatingSchema = new mongoose.Schema(
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
        star: {
            type: Number,
            required: true,
            max: [5, "Must be at most 5, got {VALUE}"],
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
campaignRatingSchema.index({ userId: 1, campaignId: 1 }, { unique: true });

campaignRatingSchema.statics = {
    async get(id) {
        try {
            let campaignRating;

            if (mongoose.Types.ObjectId.isValid(id)) {
                campaignRating = await this.findById(id).exec();
            }
            if (campaignRating) {
                return campaignRating;
            }

            throw new APIError({
                message: "CampaignRating does not exist",
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    list({ page = 1, perPage = 30, userId, campaignId, star }) {
        const options = omitBy(
            {
                userId,
                campaignId,
                star,
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
                        messages: ["already rated"],
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

campaignRatingSchema.method({
    transform() {
        const transformed = {};
        // const publicFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedBy"];
        const fields = [
            "id",
            "userId",
            "campaignId",
            "star",
            "createdAt",
            "updatedAt",
            "createdBy",
            "updatedBy",
            "remarks",
        ];
        // const adminFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedAt", "createdBy", "updatedBy"];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },
});

const CampaignRating = mongoose.model("CampaignRating", campaignRatingSchema);
module.exports = CampaignRating;
