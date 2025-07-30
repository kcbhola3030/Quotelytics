const mongoose = require("mongoose");

const CountySchema = new mongoose.Schema({
  county_id: String, // This is county_id
  county_name: String,
  state_id: String
});

module.exports = mongoose.model("County", CountySchema);
