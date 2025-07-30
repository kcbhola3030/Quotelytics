const axios = require('axios');
const Member = require('../models/member');

const IDEON_API_KEY = process.env.IDEON_API_KEY || 'api-doc-key';
const IDEON_BASE_URL = 'https://api.ideonapi.com';

async function createMember(req, res) {
  try {
    const groupId = req.params.groupId;
    const { location, memberData } = req.body;
    
    if (!groupId || !location) {
      return res.status(400).json({ error: 'groupId (in URL) and location (in body) are required' });
    }

    // Use provided member data or fallback to defaults
    const memberPayload = {
      members: [
        {
          annual_salary: memberData?.annual_salary || 60000,
          cobra: memberData?.cobra || false,
          date_of_birth: memberData?.date_of_birth || '1990-01-01',
          dependents: memberData?.dependents || [],
          external_id: memberData?.external_id,
          fips_code: location.fips_code || '36061', // Manhattan FIPS fallback
          first_name: memberData?.first_name || 'anuja',
          gender: memberData?.gender || 'F',
          hours_per_week: memberData?.hours_per_week || 40,
          household_income: memberData?.household_income || 60000,
          household_size: memberData?.household_size || 1,
          last_name: memberData?.last_name || 'Singh',
          last_used_tobacco: memberData?.last_used_tobacco || null,
          location_id: location.id,
          retiree: memberData?.retiree || false,
          safe_harbor_income: memberData?.safe_harbor_income || 60000,
          zip_code: location.zip_code || '10001', // Manhattan ZIP fallback
          same_household: memberData?.same_household || true
        }
      ]
    };
    console.log("Member payload:", memberPayload);

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

    // Store in MongoDB
    const memberDataToSave = {
      group_id: groupId,
      ...memberResp.data.members[0]
    };

    const savedMember = new Member(memberDataToSave);
    await savedMember.save();

    res.json({ 
      member: memberResp.data.members[0],
      mongoId: savedMember._id
    });
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

    // Also delete from MongoDB
    await Member.deleteMany({ group_id: groupId });

    res.json({ message: 'Members deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
}

// MongoDB CRUD Operations
async function getAllMembers(req, res) {
  try {
    const members = await Member.find();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMemberById(req, res) {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateMember(req, res) {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteMember(req, res) {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { 
  createMember, 
  getMembers, 
  deleteMembers, 
  getAllMembers, 
  getMemberById, 
  updateMember, 
  deleteMember 
};
