const {model, Schema} = require("mongoose");

let schema = new Schema({
    Guild: String,
    Channel: String,
    UserLimit: Number
});

module.exports = model("join-to-create", schema);