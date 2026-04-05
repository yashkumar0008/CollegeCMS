const express = require('express');
const router = express.Router();
const { getStudents, getStudent, addStudent, updateStudent, deleteStudent } = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(authorize('admin'), getStudents).post(authorize('admin'), addStudent);
router.route('/:id').get(authorize('admin'), getStudent).put(authorize('admin'), updateStudent).delete(authorize('admin'), deleteStudent);

module.exports = router;
