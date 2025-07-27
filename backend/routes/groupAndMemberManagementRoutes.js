const express = require('express');
const router = express.Router();
const { createGroup, getGroup } = require('../controllers/groupController');
const { createMember, getMembers, deleteMembers } = require('../controllers/memberController');

// Group routes
router.post('/groups', createGroup);
router.get('/groups/:id', getGroup);

// Member routes
router.post('/groups/:groupId/members', createMember);
router.get('/groups/:groupId/members', getMembers);
router.delete('/groups/:groupId/members', deleteMembers);

module.exports = router; 