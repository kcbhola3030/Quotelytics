const express = require('express');
const router = express.Router();
const offMarketCtrl = require("../../controllers/OffMarketCalculation/offMarket.js");
// here id is of MongoDB _id
router.post("/calculate/:memberId", offMarketCtrl.calculateOffMarketPremiums);

module.exports = router; 