const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ dest: "uploads/" });

const countyCtrl = require("../controllers/county.js");

// Upload counties.csv
router.post("/upload/counties", upload.single("file"), countyCtrl.uploadCounties)


module.exports = router; 