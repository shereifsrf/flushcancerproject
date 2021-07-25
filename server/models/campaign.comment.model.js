const mongoose = require("mongoose");
const { isNil, omitBy } = require("lodash");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");

const campaignCommentSchema = new mongoose.Schema(
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
        comment: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

campaignCommentSchema.statics = {
    async get(id) {
        try {
            let campaignComment;

            if (mongoose.Types.ObjectId.isValid(id)) {
                campaignComment = await this.findById(id)
                    .populate({ path: "userId", select: "name" })
                    .exec();
            }
            if (campaignComment) {
                return campaignComment;
            }

            throw new APIError({
                message: "CampaignComment does not exist",
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    list({ page = 1, perPage = 30, userId, campaignId }) {
        // console.log("here", campaignId);
        const options = omitBy(
            {
                userId,
                campaignId,
            },
            isNil
        );
        // console.log(options);

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .populate({ path: "userId", select: "name" })
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

campaignCommentSchema.method({
    transform(user) {
        const transformed = {};
        // const publicFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedBy"];
        const fields = [
            "id",
            "userId",
            "campaignId",
            "comment",
            "createdAt",
            "updatedAt",
            "createdBy",
            "updatedBy",
            "editable",
        ];

        // const adminFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedAt", "createdBy", "updatedBy"];
        this["editable"] = false;
        if (user) {
            if (user.id === this["userId"]._id.toString())
                this["editable"] = true;
        }

        fields.map((field) => {
            switch (field) {
                case "userId":
                    const user = this[field];
                    transformed["user"] = {
                        id: user._id,
                        name: user.name,
                    };
                    break;
                default:
                    transformed[field] = this[field];
                    break;
            }
        });

        return transformed;
    },
});

const CampaignComment = mongoose.model(
    "CampaignComment",
    campaignCommentSchema
);
module.exports = CampaignComment;
