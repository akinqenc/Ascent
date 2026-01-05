const {model, Schema} = require("mongoose");

let NotificationConfig = new Schema({
    Guild: String,
    ID: String,
    Channel: String,
    Latest: String,
    Message: String,
    PingRole: String
})

module.exports = model("notif", NotificationConfig);