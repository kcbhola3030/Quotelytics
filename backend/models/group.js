const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  id: String,
  name: String,
  fips_code: String,
  number_of_employees: Number,
  primary: Boolean,
  zip_code: String,
  external_id: String
}, { _id: false });

const groupSchema = new mongoose.Schema({
  id: { type: String },
  company_name: { type: String, required: true },
  chamber_association: Boolean,
  sic_code: String,
  external_id: String,
  contact_email: String,
  contact_name: String,
  contact_phone: String,
  locations: [locationSchema],
  ichra_calculation_id: String,
  ichra_affordability_results: Object
}, {
  timestamps: true
});

module.exports = mongoose.model('Group', groupSchema);
