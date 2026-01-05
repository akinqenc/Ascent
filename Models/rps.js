const { model, Schema } = require("mongoose");

let rps = new Schema({
  Guild: String,
  User: String,
  RPSM: String,
});

module.exports = model("rps", rps);