const Gallery = require('../models/Gallery');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const getGallery = async (req, res, next) => {
  try {
    const images = await Gallery.find().populate('uploadedBy', 'name').sort({ createdAt: -1 });
    res.json({ success: true, images });
  } catch (error) { next(error); }
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }
    const { title } = req.body;
    const file = req.files.image;
    const result = await uploadToCloudinary(file.data, 'college-cms/gallery', `gallery_${Date.now()}`);

    const image = await Gallery.create({
      title: title || 'Campus Image',
      image: result.secure_url,
      publicId: result.public_id,
      uploadedBy: req.user._id,
    });

    res.status(201).json({ success: true, image });
  } catch (error) { next(error); }
};

const deleteImage = async (req, res, next) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    await deleteFromCloudinary(image.publicId);
    await image.deleteOne();
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) { next(error); }
};

module.exports = { getGallery, uploadImage, deleteImage };
