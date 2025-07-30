const mongoose = require('mongoose');

const premiumSchema = new mongoose.Schema({
  plan_id: { 
    type: String, 
    required: true,
    index: true 
  },
  rating_area_id: { 
    type: String, 
    required: true 
  },
  effective_date: { 
    type: String, 
    required: true 
  },
  expiration_date: { 
    type: String, 
    required: true 
  },
  source: { 
    type: String, 
    default: 'HealthGov' 
  },
  updated_at: { 
    type: String, 
    default: () => new Date().toISOString() 
  },
  premiums: {
    type: Map,
    of: Number,
    default: {}
  },
  fixed_price: { 
    type: Boolean, 
    default: false 
  },
  child_only: { 
    type: Number 
  },
  family: { 
    type: Number 
  },
  single: { 
    type: Number 
  },
  single_tobacco: { 
    type: Number 
  },
  single_and_spouse: { 
    type: Number 
  },
  single_and_children: { 
    type: Number 
  }
}, {
  timestamps: true
});

// Compound index for efficient querying
premiumSchema.index({ plan_id: 1, rating_area_id: 1, effective_date: 1 });

module.exports = mongoose.model('Premium', premiumSchema); 