const Notice = require('../models/Notice');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

// @desc    Get all notices
// @route   GET /api/notices
// @access  All authenticated
const getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find()
      .populate('postedBy', 'name role photo')
      .sort({ createdAt: -1 });
    res.json({ success: true, notices });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my notices (faculty)
// @route   GET /api/notices/my
// @access  Faculty
const getMyNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find({ postedBy: req.user._id })
      .populate('postedBy', 'name role')
      .sort({ createdAt: -1 });
    res.json({ success: true, notices });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notice
// @route   POST /api/notices
// @access  Admin, Faculty
const createNotice = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    let image = '';
    let imagePublicId = '';

    if (req.files && req.files.image) {
      const file = req.files.image;
      const result = await uploadToCloudinary(file.data, 'college-cms/notices', `notice_${Date.now()}`);
      image = result.secure_url;
      imagePublicId = result.public_id;
    }

    const notice = await Notice.create({
      title, description, image, imagePublicId,
      postedBy: req.user._id,
      role: req.user.role,
    });

    await notice.populate('postedBy', 'name role photo');
    res.status(201).json({ success: true, notice });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Admin (any), Faculty (own)
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: 'Notice not found' });

    if (req.user.role === 'faculty' && notice.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this notice' });
    }

    if (notice.imagePublicId) await deleteFromCloudinary(notice.imagePublicId);
    await notice.deleteOne();
    res.json({ success: true, message: 'Notice deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotices, getMyNotices, createNotice, deleteNotice };
