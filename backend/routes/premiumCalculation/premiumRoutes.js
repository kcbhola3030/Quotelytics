// const express = require('express');
// const router = express.Router();
// const premiumCalculationController = require('../../controllers/premiumCalculation/calculatePremium');
// const zipCountyService = require('../../controllers/premiumCalculation/zipCountyService');
// const planService = require('../../controllers/premiumCalculation/planService');

// // Main premium calculation endpoint
// router.post('/calculate', premiumCalculationController.calculatePremium);

// // Complete calculation with selected county
// router.post('/complete-calculation', premiumCalculationController.completeCalculationWithCounty);

// // Get calculation results by query ID
// router.get('/results/:query_id', premiumCalculationController.getCalculationResults);

// // Get counties for a zip code
// router.get('/counties/:zipCode', async (req, res) => {
//   try {
//     const { zipCode } = req.params;
//     const counties = await zipCountyService.getCountiesByZipCode(zipCode);
//     res.json({
//       zip_code: zipCode,
//       counties: counties
//     });
//   } catch (error) {
//     console.error('Error getting counties for zip code:', error);
//     res.status(500).json({
//       error: 'Failed to get counties',
//       details: error.message
//     });
//   }
// });

// // Get available plans for a county
// router.get('/plans/:countyId', async (req, res) => {
//   try {
//     const { countyId } = req.params;
//     const planIds = await planService.getAvailablePlansByCounty(countyId);
//     const planDetails = await planService.getMultiplePlanDetails(planIds);
    
//     res.json({
//       county_id: countyId,
//       total_plans: planIds.length,
//       plans: planDetails
//     });
//   } catch (error) {
//     console.error('Error getting plans for county:', error);
//     res.status(500).json({
//       error: 'Failed to get plans',
//       details: error.message
//     });
//   }
// });

// // Get plan details by plan ID
// router.get('/plan/:planId', async (req, res) => {
//   try {
//     const { planId } = req.params;
//     const planDetails = await planService.getPlanDetails(planId);
//     res.json(planDetails);
//   } catch (error) {
//     console.error('Error getting plan details:', error);
//     res.status(500).json({
//       error: 'Failed to get plan details',
//       details: error.message
//     });
//   }
// });

// module.exports = router; 