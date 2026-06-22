const Razorpay = require('razorpay');
const Order = require('../models/Order');

const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (
    !keyId || keyId.includes('xxxx') ||
    !keySecret || keySecret.includes('xxxx')
  ) {
    return null;
  }
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

exports.createRazorpayOrder = async (req, res) => {
  try {
    const { totalAmount } = req.body;

    const razorpay = getRazorpay();
    if (!razorpay) {
      return res.status(503).json({
        message: 'Razorpay is not configured. Please add real API keys to backend/.env',
      });
    }

    const options = {
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyAndSaveOrder = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      totalAmount,
      shippingAddress,
    } = req.body;

    const crypto = require('crypto');
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (expectedSig !== razorpaySignature) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      paymentInfo: {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        method: req.body.method || 'Unknown',
      },
      paymentStatus: 'paid',
      shippingAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
