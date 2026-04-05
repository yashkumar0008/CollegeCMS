const User = require('../models/User');
const Course = require('../models/Course');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get all students
// @route   GET /api/students
// @access  Admin
const getStudents = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { role: 'student' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { enrollmentNo: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await User.countDocuments(query);
    const students = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, students, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Admin
const getStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' }).select('-password');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });
    res.json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

// @desc    Add student
// @route   POST /api/students
// @access  Admin
const addStudent = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, enrollmentNo, department, semester, batch } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already exists' });

    let photo = '';
    let photoPublicId = '';

    if (req.files && req.files.photo) {
      const file = req.files.photo;
      const result = await uploadToCloudinary(file.data, 'college-cms/students', `student_${Date.now()}`);
      photo = result.secure_url;
      photoPublicId = result.public_id;
    }

    const student = await User.create({
      name, email, password, phone, address, enrollmentNo, department,
      semester: Number(semester), batch, role: 'student', photo, photoPublicId,
    });

    // Auto-enroll in courses matching department+semester
    await Course.updateMany({ department, semester: Number(semester) }, { $addToSet: { students: student._id } });

    res.status(201).json({ success: true, student: { ...student.toObject(), password: undefined } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Admin
const updateStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    const { name, phone, address, enrollmentNo, department, semester, batch, password } = req.body;

    if (req.files && req.files.photo) {
      if (student.photoPublicId) await deleteFromCloudinary(student.photoPublicId);
      const file = req.files.photo;
      const result = await uploadToCloudinary(file.data, 'college-cms/students', `student_${Date.now()}`);
      student.photo = result.secure_url;
      student.photoPublicId = result.public_id;
    }

    student.name = name || student.name;
    student.phone = phone || student.phone;
    student.address = address || student.address;
    student.enrollmentNo = enrollmentNo || student.enrollmentNo;
    student.department = department || student.department;
    student.semester = semester ? Number(semester) : student.semester;
    student.batch = batch || student.batch;
    if (password) student.password = password;

    await student.save();
    res.json({ success: true, student: { ...student.toObject(), password: undefined } });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Admin
const deleteStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: 'student' });
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    if (student.photoPublicId) await deleteFromCloudinary(student.photoPublicId);
    await Course.updateMany({}, { $pull: { students: student._id } });
    await student.deleteOne();

    res.json({ success: true, message: 'Student deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStudents, getStudent, addStudent, updateStudent, deleteStudent };
