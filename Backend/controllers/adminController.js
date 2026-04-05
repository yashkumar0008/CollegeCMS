const User = require('../models/User');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Notice = require('../models/Notice');

const getStats = async (req, res, next) => {
  try {
    const [students, faculty, courses, notices, attendance] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      User.countDocuments({ role: 'faculty' }),
      Course.countDocuments(),
      Notice.countDocuments(),
      Attendance.countDocuments(),
    ]);
    res.json({ success: true, stats: { students, faculty, courses, notices, attendance } });
  } catch (error) { next(error); }
};

module.exports = { getStats };
