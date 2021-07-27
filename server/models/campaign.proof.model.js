const mongoose = require("mongoose");
const { isNil, omitBy } = require("lodash");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");

const campaignProofSchema = new mongoose.Schema(
    {
        campaignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true,
        },
        isChecked: {
            type: Boolean,
            default: false,
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
        remark: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

campaignProofSchema.statics = {
    async get(id) {
        try {
            let campaignProof;

            if (mongoose.Types.ObjectId.isValid(id)) {
                campaignProof = await this.findById(id)
                    .populate("campaignId", "userId")
                    .exec();
            }
            if (campaignProof) {
                return campaignProof;
            }

            throw new APIError({
                message: "CampaignProof does not exist",
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    list({ page = 1, perPage = 30, campaignId }) {
        // console.log("here", campaignId);
        const options = omitBy(
            {
                campaignId,
            },
            isNil
        );
        // console.log(options);

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },
};

campaignProofSchema.method({
    transform(user) {
        const transformed = {};
        // const publicFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedBy"];
        const fields = [
            "id",
            "campaignId",
            "remark",
            "createdAt",
            "updatedAt",
            "createdBy",
            "isChecked",
            "document",
            "updatedBy",
        ];

        // const adminFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedAt", "createdBy", "updatedBy"];

        fields.map((field) => {
            switch (field) {
                default:
                    transformed[field] = this[field];
                    break;
            }
        });

        return transformed;
    },
});

const CampaignProof = mongoose.model("CampaignProof", campaignProofSchema);
module.exports = CampaignProof;
