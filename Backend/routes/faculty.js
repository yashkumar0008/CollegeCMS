const express = require('express');
const router = express.Router();
const { getFaculty, getFacultyMember, addFaculty, updateFaculty, deleteFaculty, getFacultyProfile } = require('../controllers/facultyController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/profile', authorize('faculty'), getFacultyProfile);
router.route('/').get(authorize('admin'), getFaculty).post(authorize('admin'), addFaculty);
router.route('/:id').get(authorize('admin'), getFacultyMember).put(authorize('admin'), updateFaculty).delete(authorize('admin'), deleteFaculty);

module.exports = router;
