const {model, Schema} = require("mongoose");

let warningSchema = new Schema({
    GuildID: String,
    UserID: String,
    User: String,
    Content: Array,
});

module.exports = model("Warning", warningSchema);