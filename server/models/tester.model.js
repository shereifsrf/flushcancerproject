const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const personSchema = Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    age: Number,
    stories: [{ type: Schema.Types.ObjectId, ref: "Story" }],
});

const storySchema = Schema({
    author: { type: Schema.Types.ObjectId, ref: "Person" },
    title: String,
    fans: [{ type: Schema.Types.ObjectId, ref: "Person" }],
});

exports.Story = mongoose.model("Story", storySchema);
exports.Person = mongoose.model("Person", personSchema);
