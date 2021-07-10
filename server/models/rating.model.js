const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        camapignId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campaign",
            required: true,
        },
        star: {
            type: Number,
            required: true,
            max: [5, "Must be at most 5, got {VALUE}"],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Rating", ratingSchema);
