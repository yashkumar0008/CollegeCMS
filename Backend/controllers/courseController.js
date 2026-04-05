const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Admin, Faculty
const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .populate('faculty', 'name email photo')
      .populate('students', 'name email enrollmentNo')
      .sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Admin, Faculty
const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('faculty', 'name email photo designation')
      .populate('students', 'name email enrollmentNo photo department semester');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Admin
const createCourse = async (req, res, next) => {
  try {
    const { name, code, description, department, semester, credits, facultyId } = req.body;

    const exists = await Course.findOne({ code: code.toUpperCase() });
    if (exists) return res.status(400).json({ success: false, message: 'Course code already exists' });

    // Find matching students
    const students = await User.find({ role: 'student', department, semester: Number(semester) }).select('_id');

    const course = await Course.create({
      name, code, description, department,
      semester: Number(semester), credits: Number(credits),
      faculty: facultyId || null,
      students: students.map((s) => s._id),
    });

    await course.populate('faculty', 'name email');
    res.status(201).json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Admin
const updateCourse = async (req, res, next) => {
  try {
    const { name, description, credits, facultyId } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });

    course.name = name || course.name;
    course.description = description || course.description;
    course.credits = credits ? Number(credits) : course.credits;
    course.faculty = facultyId !== undefined ? (facultyId || null) : course.faculty;

    await course.save();
    await course.populate('faculty', 'name email');
    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Admin
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    await course.deleteOne();
    res.json({ success: true, message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign faculty to course
// @route   PUT /api/courses/:id/assign-faculty
// @access  Admin
const assignFaculty = async (req, res, next) => {
  try {
    const { facultyId } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { faculty: facultyId || null },
      { new: true }
    ).populate('faculty', 'name email');
    if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
    res.json({ success: true, course });
  } catch (error) {
    next(error);
  }
};

// @desc    Get faculty's assigned courses
// @route   GET /api/courses/my-courses
// @access  Faculty
const getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ faculty: req.user._id })
      .populate('students', 'name email enrollmentNo photo')
      .sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's enrolled courses
// @route   GET /api/courses/enrolled
// @access  Student
const getEnrolledCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ students: req.user._id })
      .populate('faculty', 'name email photo designation')
      .sort({ createdAt: -1 });
    res.json({ success: true, courses });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourses, getCourse, createCourse, updateCourse, deleteCourse, assignFaculty, getMyCourses, getEnrolledCourses };
