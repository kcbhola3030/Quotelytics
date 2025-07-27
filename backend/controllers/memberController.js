const axios = require('axios');

const IDEON_API_KEY = process.env.IDEON_API_KEY || 'api-doc-key';
const IDEON_BASE_URL = 'https://api.ideonapi.com';

async function createMember(req, res) {
  try {
    const groupId = req.params.groupId;
    const { location } = req.body;
    if (!groupId || !location) {
      return res.status(400).json({ error: 'groupId (in URL) and location (in body) are required' });
    }
    const memberPayload = {
      members: [
        {
          annual_salary: 60000,
          cobra: false,
          date_of_birth: '1990-01-01',
          dependents: [],
          external_id: 'anuja001',
          fips_code: location.fips_code || '36061', // Manhattan FIPS fallback
          first_name: 'anuja',
          gender: 'F',
          hours_per_week: 40,
          household_income: 60000,
          household_size: 1,
          last_name: 'Singh',
          last_used_tobacco: null,
          location_id: location.id,
          retiree: false,
          safe_harbor_income: 60000,
          zip_code: location.zip_code || '10001' // Manhattan ZIP fallback
        }
      ]
    };

    const memberResp = await axios.post(
      `${IDEON_BASE_URL}/groups/${groupId}/members`,
      memberPayload,
      {
        headers: {
          'Content-Type': 'application/json',
          'Vericred-Api-Key': IDEON_API_KEY
        }
      }
    );

    res.json({ member: memberResp.data.members[0] });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
}

async function getMembers(req, res) {
  try {
    const groupId = req.params.groupId;
    const membersResp = await axios.get(
      `${IDEON_BASE_URL}/groups/${groupId}/members`,
      {
        headers: {
          'Vericred-Api-Key': IDEON_API_KEY
        }
      }
    );

    res.json(membersResp.data);
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
}

async function deleteMembers(req, res) {
  try {
    const groupId = req.params.groupId;
    const deleteResp = await axios.delete(
      `${IDEON_BASE_URL}/groups/${groupId}/members`,
      {
        headers: {
          'Vericred-Api-Key': IDEON_API_KEY
        }
      }
    );

    res.json({ message: 'Members deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
}

module.exports = { createMember, getMembers, deleteMembers };
