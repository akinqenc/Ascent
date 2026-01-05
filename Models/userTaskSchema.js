const { Schema, model } = require("mongoose");
const userTaskSchema = new Schema({
    userId: String,
    task: Array
}, { versionKey: false });

module.exports = model("userTaskSchema", userTaskSchema, "userTaskSchema");