const mongoose = require("mongoose");
const { isNil, omitBy } = require("lodash");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");

const donationSchema = new mongoose.Schema(
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
        amount: {
            type: Number,
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

donationSchema.statics = {
    async get(id) {
        try {
            let donation;

            if (mongoose.Types.ObjectId.isValid(id)) {
                donation = await this.findById(id)
                    .populate([{ path: "campaignId", select: "name" }])
                    .exec();
            }
            if (donation) {
                return donation;
            }

            throw new APIError({
                message: "Donation does not exist",
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
        amount,
    }) {
        const options = omitBy(
            {
                userId,
                campaignId,
                updatedBy,
                createdBy,
                updatedAt,
                createdAt,
                amount,
            },
            isNil
        );

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .populate([{ path: "campaignId", select: "name" }])
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

donationSchema.method({
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
            "amount",
        ];
        // const adminFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedAt", "createdBy", "updatedBy"];
        fields.map((field) => {
            switch (field) {
                case "campaignId":
                    const campaign = this[field];
                    transformed["campaign"] = {
                        id: campaign._id,
                        name: campaign.name,
                    };
                    break;
                default:
                    transformed[field] = this[field];
                    break;
            }
        });

        fields.forEach((field) => {});

        return transformed;
    },
});

const Donation = mongoose.model("Donation", donationSchema);
module.exports = Donation;
