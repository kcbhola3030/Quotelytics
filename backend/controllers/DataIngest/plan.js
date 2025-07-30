const csv = require('csv-parser');
const fs = require('fs');
const Plan = require('../../models/plan');

exports.uploadPlans = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file && !req.files) {
      return res.status(400).json({ 
        error: 'No file uploaded. Please upload a CSV file.' 
      });
    }

    // Handle both single file (req.file) and multiple files (req.files)
    const uploadedFile = req.file || (req.files && req.files.plans);
    
    if (!uploadedFile) {
      return res.status(400).json({ 
        error: 'CSV file is missing. Please upload a file with key name "plans"' 
      });
    }

    const results = [];

    // Read file data
    const fileData = uploadedFile.buffer || fs.readFileSync(uploadedFile.path);
    const csvData = fileData.toString();

    // Use csv-parser library for proper CSV parsing
    const csvRows = [];
    
    return new Promise((resolve, reject) => {
      const stream = require('stream');
      const readable = new stream.Readable();
      readable.push(csvData);
      readable.push(null);

      readable
        .pipe(csv())
        .on('data', (row) => {
          csvRows.push(row);
        })
        .on('end', async () => {
          try {
            console.log('CSV Headers found:', Object.keys(csvRows[0] || {}));
            console.log('Looking for required columns: id, plan_id, name');

            for (let i = 0; i < csvRows.length; i++) {
              const row = csvRows[i];

        
              // Check if required fields exist
              if ((row.plan_id || row.id) && row.name) {
                const planData = {
                  plan_id: row.plan_id || row.id,
                  name: row.name
                };

                // Only add optional fields if they exist and are not empty
                if (row.carrier_name && row.carrier_name.trim()) {
                  planData.carrier_name = row.carrier_name;
                } else if (row.carrier && row.carrier.trim()) {
                  planData.carrier_name = row.carrier;
                }

                if (row.plan_type && row.plan_type.trim()) {
                  planData.plan_type = row.plan_type;
                }

                if (row.plan_market && row.plan_market.trim()) {
                  planData.plan_market = row.plan_market;
                }

                if (row.level && row.level.trim()) {
                  planData.level = row.level;
                }

                if (row.actuarial_value && !isNaN(parseFloat(row.actuarial_value))) {
                  planData.actuarial_value = parseFloat(row.actuarial_value);
                }

                if (row.effective_date && row.effective_date.trim()) {
                  planData.effective_date = row.effective_date;
                }

                if (row.expiration_date && row.expiration_date.trim()) {
                  planData.expiration_date = row.expiration_date;
                }

                if (row.hsa_eligible !== undefined && row.hsa_eligible !== '') {
                  planData.hsa_eligible = row.hsa_eligible === 'true' || row.hsa_eligible === true;
                }

                if (row.embedded_deductible !== undefined && row.embedded_deductible !== '') {
                  planData.embedded_deductible = row.embedded_deductible === 'true' || row.embedded_deductible === true;
                }

                if (row.source && row.source.trim()) {
                  planData.source = row.source;
                } else {
                  planData.source = 'cms';
                }

                // Handle nested objects if they exist in CSV
                if (row.network_name || row.network_size) {
                  planData.network = {
                    name: row.network_name,
                    size: parseFloat(row.network_size) || null,
                    out_of_network_coverage: row.out_of_network_coverage === 'true' || row.out_of_network_coverage === true,
                    provider_directory_url: row.provider_directory_url
                  };
                }

                if (row.summary_url || row.key_benefits) {
                  planData.benefits = {
                    summary_url: row.summary_url,
                    key_benefits: row.key_benefits
                  };
                }

                if (row.overall_rating || row.medical_care_rating) {
                  planData.cms_quality_ratings = {
                    overall: parseFloat(row.overall_rating) || null,
                    medical_care: parseFloat(row.medical_care_rating) || null,
                    member_experience: parseFloat(row.member_experience_rating) || null,
                    plan_administration: parseFloat(row.plan_administration_rating) || null
                  };
                }

                if (row.logo_url || row.carrier_brand_id) {
                  planData.branding = {
                    logo_url: row.logo_url,
                    carrier_brand_id: row.carrier_brand_id
                  };
                }

                results.push(planData);
              }
            }

            if (results.length === 0) {
              return res.status(400).json({ 
                error: 'No valid data found in CSV file. Required columns: id/plan_id, name' 
              });
            }

            try {
              // Save to MongoDB
              const savedPlans = await Plan.insertMany(results, { 
                ordered: false, // Continue inserting even if some fail
                rawResult: true 
              });

              res.json({
                message: `Successfully ingested ${savedPlans.insertedCount} plan records`, 
                insertedCount: savedPlans.insertedCount,
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
            console.error('Processing error:', error);
            res.status(500).json({ 
              error: error.message,
              details: 'File processing failed'
            });
          }
        })
        .on('error', (error) => {
          console.error('CSV parsing error:', error);
          res.status(500).json({ 
            error: 'Failed to parse CSV file',
            details: error.message
          });
        });
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'File upload processing failed'
    });
  }
}; 