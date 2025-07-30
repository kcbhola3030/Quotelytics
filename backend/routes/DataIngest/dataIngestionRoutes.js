const express = require('express');
const router = express.Router();
const multer = require('multer');
const zipCountyCtrl = require("../../controllers/DataIngest/zipCountyMap.js");
const countyCtrl = require("../../controllers/DataIngest/county.js");
const planCountyCtrl = require("../../controllers/DataIngest/planCounty.js");
const planCtrl = require("../../controllers/DataIngest/plan.js");
const premiumCtrl = require("../../controllers/DataIngest/premium.js");

const upload = multer({ dest: "uploads/" });

// Upload zip_counties.csv
router.post("/upload/zip-counties", upload.single("file"), zipCountyCtrl.uploadZipCountyMap);
router.get("/zip",zipCountyCtrl.zip)

// Upload counties.csv
router.post("/upload/counties", upload.single("file"), countyCtrl.uploadCounties);

// Upload plan_counties.csv
router.post("/upload/plan-counties", upload.single("file"), planCountyCtrl.uploadPlanCounties);

// Upload plans.csv
router.post("/upload/plans", upload.single("file"), planCtrl.uploadPlans); 

// Upload premiums.csv
router.post("/upload/premiums", upload.single("file"), premiumCtrl.uploadPremiums);

module.exports = router;  