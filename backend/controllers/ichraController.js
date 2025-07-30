const axios = require('axios');
const Member = require('../models/member');
const Group = require('../models/group');

const IDEON_API_KEY = process.env.IDEON_API_KEY || 'api-doc-key';
const IDEON_BASE_URL = 'https://api.ideonapi.com';

// Create ICHRA affordability calculation for a group
async function createICHRAffordabilityCalculation(req, res) {
  try {
    const { groupId } = req.params;
    const { ichra_affordability_calculation } = req.body;
    
    // console.log("Creating ICHRA affordability calculation for Group ID:", groupId);
    // console.log("IDEON API KEY:", IDEON_API_KEY);
    
    // Call Ideon API to create ICHRA affordability calculation
    const calculationResp = await axios.post(
      `${IDEON_BASE_URL}/groups/${groupId}/ichra_affordability_calculations`,
      {
        ichra_affordability_calculation: {
          effective_date: ichra_affordability_calculation.effective_date || "2025-08-01",
          plan_year: ichra_affordability_calculation.plan_year || 2025,
          rating_area_location: ichra_affordability_calculation.rating_area_location || "work"
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Vericred-Api-Key': IDEON_API_KEY
        }
      }
    );
    const ichraId = calculationResp.data.ichra_affordability_calculation.id;
    // console.log('Updating group with id:', groupId, 'to ichra_calculation_id:', ichraId);
    const result = await Group.updateOne(
      { id: groupId },
      { $set: { ichra_calculation_id: ichraId } }
    );
    // console.log('Update result:', result);
    // await Member.updateMany(
    //   { group_id: groupId },
    //   { $set: { ichra_calculation_id: ichraId } }
    // );
    res.json({
      group_id: groupId,
      calculation: calculationResp.data
    });
  } catch (err) {
    console.error('ICHRA calculation creation error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
}

// Get ICHRA Affordability Members for a specific ICHRA calculation
async function getICHRAffordabilityMembersById(req, res) {
  try {
    const { ichra_id } = req.params;
    
    // Call Ideon API to get ICHRA affordability members
    const membersResp = await axios.get(
      `${IDEON_BASE_URL}/ichra_affordability_calculations/${ichra_id}/members`,
      {
        headers: {
          'Vericred-Api-Key': IDEON_API_KEY
        }
      }
    );

    // console.log("ICHRA members response:", membersResp.data);

    // Check if response is an array or has a members property
    let membersData = [];
    if (Array.isArray(membersResp.data)) {
      membersData = membersResp.data;
    } else if (membersResp.data && Array.isArray(membersResp.data.members)) {
      membersData = membersResp.data.members;
    } else if (membersResp.data && membersResp.data.members) {
      membersData = [membersResp.data.members];
    } else {
      membersData = [membersResp.data];
    }

    // Add ichra_id to each member object
    const membersWithIchraId = membersData.map(member => ({
      ...member,
      ichra_id: ichra_id
    }));

    res.json({
      ichra_id: ichra_id,
      members: membersWithIchraId
    });
  } catch (err) {
    console.error('ICHRA members error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
}


async function showIchraCalculationForMember(req, res) {
  try {
    const { ichra_id } = req.params; // This is MongoDB _id

    // Find the member in your DB
    // const member = await Member.findById(memberId);
    // if (!member) {
    //   return res.status(404).json({ error: 'Member not found' });
    // }

    // Use the Ideon member id (member.id)
    // const ideonMemberId = member.id;
    // if (!ideonMemberId) {
    //   return res.status(400).json({ error: 'No Ideon member id found for this member' });
    // }

    // Call Ideon API
    const response = await axios.get(
      `${IDEON_BASE_URL}/ichra_affordability_calculations/${ichra_id}/members`,
      {
        headers: {
          'Vericred-Api-Key': IDEON_API_KEY
        }
      }
    );

    res.json({
      // ideon_member_id: ideonMemberId,
      ichra_affordability: response.data
    });
  } catch (error) {
    console.error('Error fetching ICHRA calculation for member:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch ICHRA calculation for member',
      details: error.response?.data || error.message
    });
  }
}

module.exports = { 
  createICHRAffordabilityCalculation,
  getICHRAffordabilityMembersById,
  showIchraCalculationForMember
}; 