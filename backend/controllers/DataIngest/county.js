const County = require("../../models/county.js");
const csv = require("csv-parser");
const fs = require("fs");

exports.uploadCounties = async (req, res) => {
  try {
    // console.log('Request files:', req.files);
    // console.log('Request file:', req.file);
    // console.log('Request body:', req.body);

    // Check if file was uploaded
    if (!req.file && !req.files) {
      return res.status(400).json({ 
        error: 'No file uploaded. Please upload a CSV file.' 
      });
    }

    // Handle both single file (req.file) and multiple files (req.files)
    const uploadedFile = req.file || (req.files && req.files.counties);
    
    if (!uploadedFile) {
      return res.status(400).json({ 
        error: 'CSV file is missing. Please upload a file with key name "counties"' 
      });
    }

    // console.log('File received:', uploadedFile.originalname, 'Size:', uploadedFile.size);

    const results = [];

    // Read file data
    const fileData = uploadedFile.buffer || fs.readFileSync(uploadedFile.path);
    const csvData = fileData.toString();

    // Parse CSV data
    const lines = csvData.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));

    console.log('CSV headers:', headers);

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const row = {};

        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        // Check if required fields exist
        if (row.id && row.name && row.state_id) {
            results.push({
            county_id: row.id,
              county_name: row.name,
              state_id: row.state_id
            });
          }
      }
    }

    // console.log('Parsed CSV rows:', results.length);
    // console.log('Sample row:', results[0]);

    if (results.length === 0) {
      return res.status(400).json({ 
        error: 'No valid data found in CSV file. Required columns: id, name, state_id' 
      });
    }

    try {
      // Save to MongoDB
      const savedCounties = await County.insertMany(results, { 
        ordered: false, // Continue inserting even if some fail
        rawResult: true 
      });

      res.json({
        message: `Successfully ingested ${savedCounties.insertedCount} county records`,
        insertedCount: savedCounties.insertedCount,
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
