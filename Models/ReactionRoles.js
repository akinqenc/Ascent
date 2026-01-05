const {model, Schema} = require("mongoose");

let reactionRoles = new Schema({
    Guild: String,
    Message: String,
    Emoji: String,
    Role: String
});

module.exports = model("ReactionRoles", reactionRoles);