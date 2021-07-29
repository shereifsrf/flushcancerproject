const { omitBy, isNil } = require("lodash");
const mongoose = require("mongoose");
const APIError = require("../utils/APIError");
const httpStatus = require("http-status");

const categorySchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
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
    },
    {
        timestamps: true,
    }
);

categorySchema.index({ name: "text" });

categorySchema.statics = {
    async get(id) {
        try {
            let category;

            if (mongoose.Types.ObjectId.isValid(id)) {
                category = await this.findById(id).exec();
            }
            if (category) {
                return category;
            }

            throw new APIError({
                message: "Category does not exist",
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    list({ page = 1, perPage = 30, name, createdBy, updatedBy }) {
        const options = omitBy(
            {
                name,
                createdBy,
                updatedBy,
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

categorySchema.method({
    transform() {
        const transformed = {};
        // const publicFields = ["id", "userId", "categoryId", "name", "description", "limit", "createdAt", "updatedBy"];
        const fields = [
            "id",
            "name",
            "description",
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

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
