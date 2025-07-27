const axios = require('axios');

const IDEON_API_KEY = process.env.IDEON_API_KEY || 'api-doc-key';
const IDEON_BASE_URL = 'https://api.ideonapi.com';
// console.log(IDEON_API_KEY);

async function createGroup(req, res) {
  try {
    const groupPayload = {
      group: {
        chamber_association: true,
        company_name: 'Krishna LLC',
        contact_email: 'krishna@krishnallc.com',
        contact_name: 'Krishna Charan',
        contact_phone: '123-456-7890',
        external_id: 'krishna001',
        sic_code: '1234'
      },
      locations: [
        {
          external_id: 'loc001',
          fips_code: '36061', // Manhattan FIPS
          name: 'Main Office',
          number_of_employees: 10,
          primary: true,
          zip_code: '10001' // Manhattan ZIP
        }
      ]
    };

    const groupResp = await axios.post(
      `${IDEON_BASE_URL}/groups`,
      groupPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Vericred-Api-Key': IDEON_API_KEY
        }
      }
    );

    res.json({
      group: groupResp.data.group,
      location: groupResp.data.locations[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
}

async function getGroup(req, res) {
  try {
    const groupId = req.params.id;
    const groupResp = await axios.get(
      `${IDEON_BASE_URL}/groups/${groupId}`,
      {
        headers: {
          'Vericred-Api-Key': IDEON_API_KEY
        }
      }
    );

    res.json(groupResp.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
}

module.exports = { createGroup, getGroup };
