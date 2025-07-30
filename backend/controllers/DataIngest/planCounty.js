const csv = require('csv-parser');
const fs = require('fs');
const PlanCountyMap = require('../../models/planCountyMap');

exports.uploadPlanCounties = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file && !req.files) {
      return res.status(400).json({ 
        error: 'No file uploaded. Please upload a CSV file.' 
      });
    }

    // Handle both single file (req.file) and multiple files (req.files)
    const uploadedFile = req.file || (req.files && req.files.planCounties);
    
    if (!uploadedFile) {
      return res.status(400).json({ 
        error: 'CSV file is missing. Please upload a file with key name "planCounties"' 
      });
    }

    const results = [];

    // Read file data
    const fileData = uploadedFile.buffer || fs.readFileSync(uploadedFile.path);
    const csvData = fileData.toString();

    // Parse CSV data
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const row = {};

        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        // Check if required fields exist
        if (row.plan_id && row.county_id) {
          results.push({
            plan_id: row.plan_id,
            county_id: row.county_id
          });
        }
      }
    }

    if (results.length === 0) {
      return res.status(400).json({ 
        error: 'No valid data found in CSV file. Required columns: plan_id, county_id' 
      });
    }

    try {
      // Save to MongoDB
      const savedMappings = await PlanCountyMap.insertMany(results, { 
        ordered: false, // Continue inserting even if some fail
        rawResult: true 
      });

      res.json({
        message: `Successfully ingested ${savedMappings.insertedCount} plan county mapping records`,
        insertedCount: savedMappings.insertedCount,
        totalCount: results.length,
        data: results
      });
    } catch (dbError) {
      console.error('Database insertion error:', dbError);
      res.status(500).json({ 
        error: 'Failed to save data to database',
        details: dbError.message
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'File upload processing failed'
    });
  }
}; 