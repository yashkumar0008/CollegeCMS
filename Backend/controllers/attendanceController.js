const Attendance = require('../models/Attendance');
const Course = require('../models/Course');

// @desc    Mark attendance
// @route   POST /api/attendance
// @access  Faculty
const markAttendance = async (req, res, next) => {
  try {
    const { courseId, date, attendanceData } = req.body;
    // attendanceData: [{ studentId, status }]

    const course = await Course.findOne({ _id: courseId, faculty: req.user._id });
    if (!course) return res.status(403).json({ success: false, message: 'Not authorized for this course' });

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const ops = attendanceData.map(({ studentId, status }) => ({
      updateOne: {
        filter: { student: studentId, course: courseId, date: attendanceDate },
        update: { $set: { student: studentId, course: courseId, faculty: req.user._id, date: attendanceDate, status } },
        upsert: true,
      },
    }));

    await Attendance.bulkWrite(ops);
    res.json({ success: true, message: 'Attendance marked successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance by course (faculty)
// @route   GET /api/attendance/course/:courseId
// @access  Faculty
const getAttendanceByCourse = async (req, res, next) => {
  try {
    const { date } = req.query;
    const query = { course: req.params.courseId };
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      const end = new Date(d);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: d, $lte: end };
    }
    const attendance = await Attendance.find(query)
      .populate('student', 'name email enrollmentNo photo')
      .populate('course', 'name code')
      .sort({ date: -1 });
    res.json({ success: true, attendance });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my attendance (student)
// @route   GET /api/attendance/my
// @access  Student
const getMyAttendance = async (req, res, next) => {
  try {
    const attendance = await Attendance.find({ student: req.user._id })
      .populate('course', 'name code department semester')
      .populate('faculty', 'name')
      .sort({ date: -1 });

    // Calculate per-course stats
    const courseMap = {};
    attendance.forEach((a) => {
      const cid = a.course._id.toString();
      if (!courseMap[cid]) {
        courseMap[cid] = { course: a.course, total: 0, present: 0, records: [] };
      }
      courseMap[cid].total++;
      if (a.status === 'Present') courseMap[cid].present++;
      courseMap[cid].records.push(a);
    });

    const stats = Object.values(courseMap).map((c) => ({
      ...c,
      percentage: c.total > 0 ? ((c.present / c.total) * 100).toFixed(1) : '0.0',
    }));

    res.json({ success: true, attendance, stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all attendance (admin)
// @route   GET /api/attendance
// @access  Admin
const getAllAttendance = async (req, res, next) => {
  try {
    const { studentId, courseId, page = 1, limit = 20 } = req.query;
    const query = {};
    if (studentId) query.student = studentId;
    if (courseId) query.course = courseId;

    const total = await Attendance.countDocuments(query);
    const attendance = await Attendance.find(query)
      .populate('student', 'name email enrollmentNo')
      .populate('course', 'name code')
      .populate('faculty', 'name')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, attendance, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance dates for a course (to check if already marked)
// @route   GET /api/attendance/course/:courseId/dates
// @access  Faculty
const getAttendanceDates = async (req, res, next) => {
  try {
    const dates = await Attendance.distinct('date', { course: req.params.courseId });
    res.json({ success: true, dates });
  } catch (error) {
    next(error);
  }
};

module.exports = { markAttendance, getAttendanceByCourse, getMyAttendance, getAllAttendance, getAttendanceDates };
