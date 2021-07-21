const { isNil, omitBy } = require("lodash");
const mongoose = require("mongoose");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");

/**
 * Campaign Schema
 * @private
 */
const campaignVerifyDocumentSchema = new mongoose.Schema(
    {
        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true,
        },
        document: {
            data: Buffer,
            contentType: String,
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
            let verifyDocument;

            if (mongoose.Types.ObjectId.isValid(id)) {
                verifyDocument = await this.findById(id).exec();
            }
            if (verifyDocument) {
                return verifyDocument;
            }

            throw new APIError({
                message: "Document does not exist",
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    list({ page = 1, perPage = 30, campaignId }) {
        const options = omitBy(
            {
                campaignId,
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
            "campaignId",
            "document",
            "remarks",
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

const CampaignVerifyDocument = mongoose.model(
    "CampaignVerifyDocument",
    campaignVerifyDocumentSchema
);
module.exports = CampaignVerifyDocument;
