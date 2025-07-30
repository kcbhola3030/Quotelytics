const mongoose = require('mongoose');

const networkSchema = new mongoose.Schema({
  name: String,
  size: Number,
  out_of_network_coverage: Boolean,
  provider_directory_url: String
}, { _id: false });

const benefitsSchema = new mongoose.Schema({
  summary_url: String,
  key_benefits: String
}, { _id: false });

const cmsQualityRatingsSchema = new mongoose.Schema({
  overall: Number,
  medical_care: Number,
  member_experience: Number,
  plan_administration: Number
}, { _id: false });

const brandingSchema = new mongoose.Schema({
  logo_url: String,
  carrier_brand_id: String
}, { _id: false });

const planSchema = new mongoose.Schema({
  plan_id: { 
    type: String, 
    required: true,
  },
  name: { 
    type: String, 
    required: true 
  },
  carrier_name: String,
  plan_type: String,
  plan_market: String,
  level: String,
  actuarial_value: Number,
  effective_date: String,
  expiration_date: String,
  hsa_eligible: Boolean,
  embedded_deductible: Boolean,
  network: networkSchema,
  benefits: benefitsSchema,
  cms_quality_ratings: cmsQualityRatingsSchema,
  branding: brandingSchema,
  source: { 
    type: String, 
    default: 'cms' 
  },
  created_at: { 
    type: String, 
    default: () => new Date().toISOString() 
  },
  updated_at: { 
    type: String, 
    default: () => new Date().toISOString() 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Plan', planSchema); 