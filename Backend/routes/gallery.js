const express = require('express');
const router = express.Router();
const { getGallery, uploadImage, deleteImage } = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.route('/').get(getGallery).post(authorize('admin'), uploadImage);
router.delete('/:id', authorize('admin'), deleteImage);

module.exports = router;
