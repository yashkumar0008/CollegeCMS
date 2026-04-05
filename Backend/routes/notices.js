const express = require('express');
const router = express.Router();
const { getNotices, getMyNotices, createNotice, deleteNotice } = require('../controllers/noticeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/my', authorize('faculty'), getMyNotices);
router.route('/').get(getNotices).post(authorize('admin', 'faculty'), createNotice);
router.delete('/:id', authorize('admin', 'faculty'), deleteNotice);

module.exports = router;
