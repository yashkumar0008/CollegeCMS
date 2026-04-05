const express = require('express');
const router = express.Router();
const { getCourses, getCourse, createCourse, updateCourse, deleteCourse, assignFaculty, getMyCourses, getEnrolledCourses } = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/my-courses', authorize('faculty'), getMyCourses);
router.get('/enrolled', authorize('student'), getEnrolledCourses);
router.route('/').get(authorize('admin', 'faculty'), getCourses).post(authorize('admin'), createCourse);
router.route('/:id').get(authorize('admin', 'faculty'), getCourse).put(authorize('admin'), updateCourse).delete(authorize('admin'), deleteCourse);
router.put('/:id/assign-faculty', protect, authorize('admin'), assignFaculty);

module.exports = router;
