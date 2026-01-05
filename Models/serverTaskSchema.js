const { Schema, model } = require("mongoose");
const serverTaskSchema = new Schema({
    guildId: String,
    task: Array
}, { versionKey: false });

module.exports = model("serverTaskSchema", serverTaskSchema, "serverTaskSchema");
