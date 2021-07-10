const mongoose = require("mongoose");

const reportCampaignSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    camapignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("ReportCampaign", reportCampaignSchema);
