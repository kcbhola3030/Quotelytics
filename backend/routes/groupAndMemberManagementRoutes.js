const express = require('express');
const router = express.Router();
const { 
  createGroup, 
  getGroup, 
  getGroups, 
  getGroupById, 
  updateGroup, 
  deleteGroup
} = require('../controllers/groupController');
const { 
  createMember, 
  getMembers, 
  deleteMembers, 
  getAllMembers, 
  getMemberById, 
  updateMember, 
  deleteMember 
} = require('../controllers/memberController');

// Group routes (Ideon API)
router.post('/groups', createGroup);
router.get('/groups/:id', getGroup);

// Group routes (MongoDB CRUD)
router.get('/groups', getGroups);
router.get('/groups/mongo/:id', getGroupById);
router.put('/groups/:id', updateGroup);
router.delete('/groups/:id', deleteGroup);

// Member routes (Ideon API)
router.post('/groups/:groupId/members', createMember);
router.get('/groups/:groupId/members', getMembers);
router.delete('/groups/:groupId/members', deleteMembers);

// Member routes (MongoDB CRUD)
router.get('/members', getAllMembers);
router.get('/members/:id', getMemberById);
router.put('/members/:id', updateMember);
router.delete('/members/:id', deleteMember);


module.exports = router; 