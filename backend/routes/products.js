const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getCategories,
  createProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/admin');

router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/', protect, adminOnly, createProduct);

module.exports = router;
