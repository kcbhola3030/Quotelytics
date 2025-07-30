const express = require('express');
const router = express.Router();
const { 
  createICHRAffordabilityCalculation,
  getICHRAffordabilityMembersById,
  showIchraCalculationForMember
} = require('../controllers/ichraController');

// Create ICHRA affordability calculation for a group(ideon api group id)
router.post('/groups/:groupId/calculations', createICHRAffordabilityCalculation);

// Get ICHRA affordability members for a specific ICHRA calculation
router.get('/members/:ichra_id', getICHRAffordabilityMembersById);



module.exports = router; 