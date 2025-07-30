const ZipCountyMap = require("../../models/zipCountyMap.js");
const csv = require("csv-parser");
const fs = require("fs");

exports.uploadZipCountyMap = async (req, res) => {
  try {
    const results = [];

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (row) => {
        if (row.zip_code_id && row.county_id) {
          results.push({
            zip_code_id: row.zip_code_id,
            county_id: row.county_id
          });
        }
      })
      .on("end", async () => {
        try {
          await ZipCountyMap.insertMany(results, { ordered: false });
          res.json({ message: `${results.length} zip-county mappings uploaded.` });
        } catch (insertErr) {
          console.error("Insertion error:", insertErr);
          res.status(500).json({ error: "Failed to insert mappings" });
        }
      });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};

exports.zip = async (req, res) => {
  try {
    // Find all documents and project only the zip_code_id field
    const zipCodes = await ZipCountyMap.distinct("zip_code_id");
    res.json({ zip_codes: zipCodes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
