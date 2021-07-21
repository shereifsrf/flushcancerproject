const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const { Story, Person } = require("../../models/tester.model");
const Campaign = require("../../models/campaign.model");

router.get("/", (req, res) => {
    // const author = new Person({
    //     _id: new mongoose.Types.ObjectId(),
    //     name: "Ian Fleming",
    //     age: 50,
    // });
    // author.save(function (err) {
    //     if (err) return handleError(err);

    //     const story1 = new Story({
    //         title: "Casino Royale",
    //         author: author._id, // assign the _id from the person
    //     });

    //     story1.save(function (err) {
    //         if (err) return handleError(err);
    //         // that's it!
    //     });
    // });

    Story.findById("60f280baa122b739e01b104b")
        .populate("fans")
        .exec(function (err, story) {
            if (err) return handleError(err);
            console.log("The author is %s", story.fans);
            // prints "The author is Ian Fleming"
        });

    res.json({ message: "Im here" });
});

router.get("/campaign", async (req, res) => {
    const cam = await Campaign.findById("60ea6a073afc6d5a34e1a193")
        .populate("categoryId")
        .exec();

    res.json(cam);
});

module.exports = router;
