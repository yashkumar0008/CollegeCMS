const express = require('express');
const router = express.Router();
const { markAttendance, getAttendanceByCourse, getMyAttendance, getAllAttendance, getAttendanceDates } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.post('/', authorize('faculty'), markAttendance);
router.get('/my', authorize('student'), getMyAttendance);
router.get('/', authorize('admin'), getAllAttendance);
router.get('/course/:courseId', authorize('faculty', 'admin'), getAttendanceByCourse);
router.get('/course/:courseId/dates', authorize('faculty', 'admin'), getAttendanceDates);

module.exports = router;
