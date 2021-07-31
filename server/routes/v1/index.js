const express = require("express");
const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const campaignRoutes = require("./campaign.route");
const categoryRoutes = require("./category.route");
const campaignLikes = require("./campaign.like.route");
const donations = require("./donation.route");
const campaignComments = require("./campaign.comment.route");
const campaignProofs = require("./campaign.proof.route");
const campaignRatings = require("./campaign.rating.route");
const campaignReportings = require("./campaign.reporting.route");
const tester = require("./tester.route");

const router = express.Router();

router.get("/status", (req, res) => res.send("OK"));

router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/categories", categoryRoutes);
router.use("/campaignlikes", campaignLikes);
router.use("/donations", donations);
router.use("/campaigncomments", campaignComments);
router.use("/campaignproofs", campaignProofs);
router.use("/campaignratings", campaignRatings);
router.use("/campaignreportings", campaignReportings);
router.use("/tester", tester);

module.exports = router;
