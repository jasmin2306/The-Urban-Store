const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'electronics',
        'jewelery',
        'mobiles',
        'beauty',
        'foods',
        'sports',
        'books',
        'furniture',
      ],
    },
    image: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    rating: {
      rate: { type: Number, default: 4.5 },
      count: { type: Number, default: 100 },
    },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', category: 1 });

module.exports = mongoose.model('Product', productSchema);
