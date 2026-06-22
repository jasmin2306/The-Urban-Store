const express = require('express');
const router = express.Router();
const {
  createRazorpayOrder,
  verifyAndSaveOrder,
  getUserOrders,
  getOrder,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/razorpay', protect, createRazorpayOrder);
router.post('/verify', protect, verifyAndSaveOrder);
router.get('/', protect, getUserOrders);
router.get('/:id', protect, getOrder);

module.exports = router;
