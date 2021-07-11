const mongoose = require("mongoose");
const { isNil, omitBy } = require("lodash");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");

const campaignReportingSchema = new mongoose.Schema(
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
        message: {
            type: String,
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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

campaignReportingSchema.statics = {
    async get(id) {
        try {
            let campaignReporting;

            if (mongoose.Types.ObjectId.isValid(id)) {
                campaignReporting = await this.findById(id).exec();
            }
            if (campaignReporting) {
                return campaignReporting;
            }

            throw new APIError({
                message: "CampaignReporting does not exist",
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
};

campaignReportingSchema.method({
    transform() {
        const transformed = {};
        // const publicFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedBy"];
        const fields = [
            "id",
            "userId",
            "campaignId",
            "message",
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

const CampaignReporting = mongoose.model(
    "CampaignReporting",
    campaignReportingSchema
);
module.exports = CampaignReporting;
