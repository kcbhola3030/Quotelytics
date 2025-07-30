const mongoose = require('mongoose');

const premiumCalculationSchema = new mongoose.Schema({
  query_id: {
    type: String,
    required: true,
    unique: true
  },
  user_input: {
    zip_code: { type: String, required: true },
    age: { type: Number, required: true },
    tobacco_use: { type: Boolean, default: false },
    selected_county_id: { type: String },
    selected_county_name: { type: String }
  },
  calculation_results: [{
    plan_id: { type: String, required: true },
    plan_name: { type: String },
    carrier_name: { type: String },
    plan_type: { type: String },
    level: { type: String },
    premium_amount: { type: Number, required: true },
    age_based_premium: { type: Number },
    tobacco_surcharge: { type: Number },
    plan_details: {
      actuarial_value: { type: Number },
      hsa_eligible: { type: Boolean },
      network: {
        name: { type: String },
        size: { type: Number }
      },
      benefits: {
        summary_url: { type: String },
        key_benefits: { type: String }
      }
    }
  }],
  calculation_metadata: {
    total_plans_found: { type: Number },
    calculation_date: { type: Date, default: Date.now },
    processing_time_ms: { type: Number }
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'error'],
    default: 'pending'
  },
  error_message: { type: String }
}, {
  timestamps: true
});

// Index for efficient querying
premiumCalculationSchema.index({ 'user_input.zip_code': 1, 'user_input.age': 1 });
premiumCalculationSchema.index({ query_id: 1 });

module.exports = mongoose.model('PremiumCalculation', premiumCalculationSchema); 