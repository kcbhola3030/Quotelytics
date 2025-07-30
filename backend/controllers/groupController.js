const axios = require('axios');
const Group = require('../models/group');

const IDEON_API_KEY = process.env.IDEON_API_KEY || 'api-doc-key';
const IDEON_BASE_URL = 'https://api.ideonapi.com';

async function createGroup(req, res) {
  try {
    // const groupPayload = {
    //   group: {
    //     chamber_association: true,
    //     company_name: 'Krishna LLC',
    //     contact_email: 'krishna@krishnallc.com',
    //     contact_name: 'Krishna Charan',
    //     contact_phone: '123-456-7890',
    //     external_id: 'krishna001',
    //     sic_code: '1234'
    //   },
    //   locations: [
    //     {
    //       external_id: 'loc001',
    //       fips_code: '36061', // Manhattan FIPS
    //       name: 'Main Office',
    //       number_of_employees: 10,
    //       primary: true,
    //       zip_code: '10001' // Manhattan ZIP
    //     }
    //   ]
    // };


    const { group, locations } = req.body;

    if (!group || !locations || !Array.isArray(locations) || locations.length === 0) {
      return res.status(400).json({ error: 'Missing group or locations data' });
    }

    // Build the payload for the API
    const groupPayload = {
      group,
      locations
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
    console.log(groupResp.data)

    // Store in MongoDB
    const groupData = {
      id: groupResp.data.group.id,
      company_name: groupResp.data.group.company_name,
      chamber_association: groupResp.data.group.chamber_association,
      sic_code: groupResp.data.group.sic_code,
      external_id: groupResp.data.group.external_id,
      contact_email: groupResp.data.group.contact_email,
      contact_name: groupResp.data.group.contact_name,
      contact_phone: groupResp.data.group.contact_phone,
      locations: groupResp.data.locations 
    };

    const savedGroup = new Group(groupData);
    await savedGroup.save();

    res.json({
      group: groupResp.data.group,
      location: groupResp.data.locations[0],
      mongoId: savedGroup._id
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

// MongoDB CRUD Operations
async function getGroups(req, res) {
  try {
    const groups = await Group.find();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getGroupById(req, res) {
  try {
    const group = await Group.findOne({id:req.params.id});
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function updateGroup(req, res) {
  try {
    const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteGroup(req, res) {
  try {
    // 1. Find the group by Mongo _id to get the Ideon id
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const ideonGroupId = group.id;

    // 2. Delete the group
    await Group.findByIdAndDelete(req.params.id);

    // 3. Delete all members associated with this group (by Ideon id)
    await Member.deleteMany({ group_id: ideonGroupId });

    res.json({ message: 'Group and associated members deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { 
  createGroup, 
  getGroup, 
  getGroups, 
  getGroupById, 
  updateGroup, 
  deleteGroup
};
