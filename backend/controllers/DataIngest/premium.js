const csv = require('csv-parser');
const fs = require('fs');
const Premium = require('../../models/premium');

exports.uploadPremiums = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file && !req.files) {
      return res.status(400).json({ 
        error: 'No file uploaded. Please upload a CSV file.' 
      });
    }

    // Handle both single file (req.file) and multiple files (req.files)
    const uploadedFile = req.file || (req.files && req.files.premiums);
    
    if (!uploadedFile) {
      return res.status(400).json({ 
        error: 'CSV file is missing. Please upload a file with key name "premiums"' 
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
        if (row.plan_id && row.rating_area_id && row.effective_date && row.expiration_date) {
          const premiumData = {
            plan_id: row.plan_id,
            rating_area_id: row.rating_area_id,
            effective_date: row.effective_date,
            expiration_date: row.expiration_date,
            source: row.source || 'HealthGov',
            fixed_price: row.fixed_price === 'true' || row.fixed_price === true,
            child_only: parseFloat(row.child_only) || null,
            family: parseFloat(row.family) || null,
            single: parseFloat(row.single) || null,
            single_tobacco: parseFloat(row.single_tobacco) || null,
            single_and_spouse: parseFloat(row.single_and_spouse) || null,
            single_and_children: parseFloat(row.single_and_children) || null,
            premiums: {}
          };

          // Extract age-based premiums (age_0, age_0_tobacco, age_1, age_1_tobacco, etc.)
          Object.keys(row).forEach(key => {
            if (key.startsWith('age_') && !isNaN(parseFloat(row[key]))) {
              premiumData.premiums[key] = parseFloat(row[key]);
            }
          });

          results.push(premiumData);
        }
      }
    }

    if (results.length === 0) {
      return res.status(400).json({ 
        error: 'No valid data found in CSV file. Required columns: plan_id, rating_area_id, effective_date, expiration_date' 
      });
    }

    try {
      // Save to MongoDB
      const savedPremiums = await Premium.insertMany(results, { 
        ordered: false, // Continue inserting even if some fail
        rawResult: true 
      });

      res.json({
        message: `Successfully ingested ${savedPremiums.insertedCount} premium records`,
        insertedCount: savedPremiums.insertedCount,
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