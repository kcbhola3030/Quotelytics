const mongoose = require('mongoose');

const UserQuoteSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  quote_type: { type: String, enum: ['off_market', 'on_market'], required: true },
  zip: { type: String, required: true },
  county_id: { type: String, required: true },
  county_name: { type: String },
  tobacco_use: { type: Boolean, default: false },
  age: { type: Number, required: true },
  magi: { type: Number }, // Modified Adjusted Gross Income
  fpl_percent: { type: Number }, // Federal Poverty Level percentage
  applicable_percentage: { type: Number }, // ACA applicable percentage
  expected_contribution: { type: Number }, // Expected contribution amount
  benchmark_premium: { type: Number }, // Second lowest cost silver plan
  subsidy: { type: Number }, // Premium tax credit amount
  plans: [
    {
      plan_id: { type: String, required: true },
      plan_name: { type: String },
      carrier_name: { type: String },
      plan_type: { type: String },
      level: { type: String },
      full_premium: { type: Number, required: true }, // Full premium before subsidy
      subsidized_premium: { type: Number }, // Premium after subsidy (can be null for off-market)
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
      },
      employer_contribution: { type: Number }, // ICHRA contribution
      employee_out_of_pocket: { type: Number } // Final cost to employee
    }
  ],
  calculation_metadata: {
    total_plans_found: { type: Number },
    calculation_date: { type: Date, default: Date.now },
    processing_time_ms: { type: Number },
    query_id: { type: String } // Link to detailed calculation record
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'error'],
    default: 'pending'
  },
  error_message: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Indexes for efficient querying
UserQuoteSchema.index({ member: 1, quote_type: 1 });
UserQuoteSchema.index({ zip: 1, county_id: 1 });
UserQuoteSchema.index({ created_at: -1 });
UserQuoteSchema.index({ query_id: 1 });

module.exports = mongoose.model('UserQuote', UserQuoteSchema); 