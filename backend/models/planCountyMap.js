const mongoose = require('mongoose');

const PlanCountyMapSchema = new mongoose.Schema({
  plan_id: {
    type: String,
    required: true
  },
  county_id: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('PlanCountyMap', PlanCountyMapSchema);
