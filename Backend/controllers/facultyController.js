const User = require('../models/User');
const Course = require('../models/Course');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get all faculty
// @route   GET /api/faculty
// @access  Admin
const getFaculty = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const query = { role: 'faculty' };
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }
    const total = await User.countDocuments(query);
    const faculty = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, faculty, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single faculty
// @route   GET /api/faculty/:id
// @access  Admin
const getFacultyMember = async (req, res, next) => {
  try {
    const member = await User.findOne({ _id: req.params.id, role: 'faculty' }).select('-password');
    if (!member) return res.status(404).json({ success: false, message: 'Faculty not found' });
    res.json({ success: true, faculty: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Add faculty
// @route   POST /api/faculty
// @access  Admin
const addFaculty = async (req, res, next) => {
  try {
    const { name, email, password, phone, address, department, designation, qualification, experience } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: 'Email already exists' });

    let photo = '';
    let photoPublicId = '';
    if (req.files && req.files.photo) {
      const file = req.files.photo;
      const result = await uploadToCloudinary(file.data, 'college-cms/faculty', `faculty_${Date.now()}`);
      photo = result.secure_url;
      photoPublicId = result.public_id;
    }

    const faculty = await User.create({
      name, email, password, phone, address, department,
      designation, qualification, experience, role: 'faculty', photo, photoPublicId,
    });

    res.status(201).json({ success: true, faculty: { ...faculty.toObject(), password: undefined } });
  } catch (error) {
    next(error);
  }
};

// @desc    Update faculty
// @route   PUT /api/faculty/:id
// @access  Admin
const updateFaculty = async (req, res, next) => {
  try {
    const member = await User.findOne({ _id: req.params.id, role: 'faculty' });
    if (!member) return res.status(404).json({ success: false, message: 'Faculty not found' });

    const { name, phone, address, department, designation, qualification, experience, password } = req.body;

    if (req.files && req.files.photo) {
      if (member.photoPublicId) await deleteFromCloudinary(member.photoPublicId);
      const file = req.files.photo;
      const result = await uploadToCloudinary(file.data, 'college-cms/faculty', `faculty_${Date.now()}`);
      member.photo = result.secure_url;
      member.photoPublicId = result.public_id;
    }

    member.name = name || member.name;
    member.phone = phone || member.phone;
    member.address = address || member.address;
    member.department = department || member.department;
    member.designation = designation || member.designation;
    member.qualification = qualification || member.qualification;
    member.experience = experience || member.experience;
    if (password) member.password = password;

    await member.save();
    res.json({ success: true, faculty: { ...member.toObject(), password: undefined } });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete faculty
// @route   DELETE /api/faculty/:id
// @access  Admin
const deleteFaculty = async (req, res, next) => {
  try {
    const member = await User.findOne({ _id: req.params.id, role: 'faculty' });
    if (!member) return res.status(404).json({ success: false, message: 'Faculty not found' });

    if (member.photoPublicId) await deleteFromCloudinary(member.photoPublicId);
    await Course.updateMany({ faculty: member._id }, { $set: { faculty: null } });
    await member.deleteOne();

    res.json({ success: true, message: 'Faculty deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get faculty profile (self)
// @route   GET /api/faculty/profile
// @access  Faculty
const getFacultyProfile = async (req, res, next) => {
  try {
    const faculty = await User.findById(req.user._id).select('-password');
    const courses = await Course.find({ faculty: req.user._id }).populate('students', 'name email enrollmentNo photo');
    res.json({ success: true, faculty, courses });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFaculty, getFacultyMember, addFaculty, updateFaculty, deleteFaculty, getFacultyProfile };
