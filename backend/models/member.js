const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  id: { type: String }, // Ideon member ID
  group_id: { type: String, required: true },
  external_id: String,
  cobra: Boolean,
  date_of_birth: String,
  gender: String,
  fips_code: String,
  last_used_tobacco: { type: String, default: null },
  location_id: String,
  retiree: Boolean,
  zip_code: String,
  dependents: { type: Array, default: [] },
  household_income: Number,
  household_size: Number,
  safe_harbor_income: Number,
  annual_salary: Number,
  hours_per_week: Number,
  first_name: String,
  last_name: String,
  ichra_calculation_id: String,
  ichra_affordability_results: Object,
  off_market_plan_ids: [String],
  off_market_premium: { type: Number, default: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);
