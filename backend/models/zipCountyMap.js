const mongoose = require("mongoose");

const ZipCountyMapSchema = new mongoose.Schema({
  zip_code_id: String,
  county_id: String
});

module.exports = mongoose.model("ZipCountyMap", ZipCountyMapSchema);
