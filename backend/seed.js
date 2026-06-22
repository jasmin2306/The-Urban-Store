require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Product = require('./models/Product');
const User = require('./models/User');
const connectDB = require('./config/db');

const categoryMap = {
  electronics: ['electronics', 'electric'],
  jewelery: ['jewelery', 'jewelry'],
  mobiles: ['phone', 'mobile', 'smartphone'],
  beauty: ['beauty', 'beauty', 'personal care'],
  foods: ['food', 'grocery', 'snack'],
  sports: ['sports', 'fitness', 'athletic'],
  books: ['books', 'book', 'novel'],
  furniture: ['furniture', 'home decor', 'furnish'],
};

const extendedProducts = [
  {
    title: 'Wireless Noise Cancelling Headphones',
    price: 299.99,
    description: 'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio.',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    rating: { rate: 4.7, count: 2340 },
  },
  {
    title: 'Smart Watch Pro Series',
    price: 449.99,
    description: 'Advanced smartwatch with health monitoring, GPS tracking, and 7-day battery life.',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1546868871-af0de0ae72e1?w=400',
    rating: { rate: 4.5, count: 1890 },
  },
  {
    title: 'iPhone 15 Pro Max',
    price: 1199.99,
    description: 'Latest smartphone with A17 Pro chip, 48MP camera system, and titanium design.',
    category: 'mobiles',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    rating: { rate: 4.8, count: 5600 },
  },
  {
    title: 'Samsung Galaxy S24 Ultra',
    price: 1099.99,
    description: 'Premium Android smartphone with built-in S Pen, 200MP camera, and AI features.',
    category: 'mobiles',
    image: 'https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=400',
    rating: { rate: 4.6, count: 4200 },
  },
  {
    title: 'Luxury Skincare Set',
    price: 89.99,
    description: 'Complete skincare routine with vitamin C serum, hyaluronic acid, and retinol cream.',
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
    rating: { rate: 4.4, count: 890 },
  },
  {
    title: 'Luxury Gold Diamond Necklace',
    price: 459.99,
    description: '18K gold plated necklace with genuine diamond accents. Elegant design perfect for special occasions.',
    category: 'jewelery',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400',
    rating: { rate: 4.7, count: 890 },
  },
  {
    title: 'Pearl Stud Earrings Set',
    price: 89.99,
    description: 'Genuine freshwater pearl stud earrings in sterling silver. Hypoallergenic and timeless.',
    category: 'jewelery',
    image: 'https://images.unsplash.com/photo-1611107683228-e8b19c90c0d1?w=400',
    rating: { rate: 4.5, count: 1240 },
  },
  {
    title: 'Stainless Steel Men\'s Watch',
    price: 249.99,
    description: 'Premium stainless steel analog watch with sapphire crystal glass and water resistance.',
    category: 'jewelery',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400',
    rating: { rate: 4.6, count: 2100 },
  },
  {
    title: 'Silver Chain Bracelet',
    price: 129.99,
    description: 'Handcrafted sterling silver chain bracelet with secure lobster clasp. 8 inches length.',
    category: 'jewelery',
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400',
    rating: { rate: 4.4, count: 670 },
  },
  {
    title: 'Organic Almond Butter',
    price: 14.99,
    description: 'Creamy organic almond butter. No added sugar, no palm oil. Rich in protein and healthy fats.',
    category: 'foods',
    image: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=400',
    rating: { rate: 4.3, count: 3200 },
  },
  {
    title: 'Premium Green Tea Collection',
    price: 24.99,
    description: 'Selection of 5 premium Japanese green teas. Includes matcha, sencha, and genmaicha.',
    category: 'foods',
    image: 'https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?w=400',
    rating: { rate: 4.5, count: 1800 },
  },
  {
    title: 'Professional Makeup Kit',
    price: 129.99,
    description: '50-piece professional makeup palette with eyeshadows, lipsticks, and brushes.',
    category: 'beauty',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400',
    rating: { rate: 4.3, count: 670 },
  },
  {
    title: 'Organic Protein Powder',
    price: 49.99,
    description: 'Plant-based protein powder with 25g protein per serving. Vanilla flavor.',
    category: 'foods',
    image: 'https://images.unsplash.com/photo-1622485831931-0c3692aae204?w=400',
    rating: { rate: 4.2, count: 1500 },
  },
  {
    title: 'Gourmet Coffee Beans',
    price: 34.99,
    description: 'Premium Arabica coffee beans from Colombia. Medium roast, 1kg bag.',
    category: 'foods',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
    rating: { rate: 4.6, count: 2100 },
  },
  {
    title: 'Professional Yoga Mat',
    price: 79.99,
    description: 'Extra thick non-slip yoga mat with alignment lines. Includes carrying strap.',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
    rating: { rate: 4.5, count: 3200 },
  },
  {
    title: 'Adjustable Dumbbell Set',
    price: 199.99,
    description: 'Space-saving adjustable dumbbells from 5-52.5 lbs each. Quick-change weight system.',
    category: 'sports',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
    rating: { rate: 4.7, count: 1800 },
  },
  {
    title: 'The Art of Programming',
    price: 39.99,
    description: 'Comprehensive guide to modern software development. Covers algorithms, data structures, and design patterns.',
    category: 'books',
    image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    rating: { rate: 4.8, count: 4500 },
  },
  {
    title: 'Bestseller Novel Collection',
    price: 59.99,
    description: 'Set of 5 award-winning novels spanning mystery, romance, and science fiction.',
    category: 'books',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    rating: { rate: 4.4, count: 2800 },
  },
  {
    title: 'Modern Leather Sofa',
    price: 1299.99,
    description: 'Premium genuine leather 3-seater sofa with memory foam cushions and adjustable headrests.',
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
    rating: { rate: 4.6, count: 430 },
  },
  {
    title: 'Minimalist Desk with Storage',
    price: 449.99,
    description: 'Spacious wooden desk with built-in cable management and 6 storage drawers.',
    category: 'furniture',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400',
    rating: { rate: 4.3, count: 560 },
  },
  {
    title: 'OnePlus 12 Pro',
    price: 899.99,
    description: 'Flagship smartphone with Snapdragon 8 Gen 3, 100W charging, and Hasselblad camera.',
    category: 'mobiles',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
    rating: { rate: 4.5, count: 3100 },
  },
  {
    title: 'Wireless Bluetooth Earbuds',
    price: 179.99,
    description: 'True wireless earbuds with active noise cancellation, IPX5 waterproof rating.',
    category: 'electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400',
    rating: { rate: 4.3, count: 5600 },
  },
];

const seed = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    console.log('Cleared existing products');

    const { data: fakeProducts } = await axios.get(
      'https://fakestoreapi.com/products'
    );

    const mapped = fakeProducts.map((p) => {
      let category = 'electronics';
      const cat = p.category.toLowerCase();
      for (const [key, keywords] of Object.entries(categoryMap)) {
        if (keywords.some((k) => cat.includes(k))) {
          category = key;
          break;
        }
      }
      return {
        title: p.title,
        price: p.price,
        description: p.description,
        category,
        image: p.image,
        rating: p.rating || { rate: 4.5, count: 100 },
      };
    });

    const allProducts = [...mapped, ...extendedProducts];
    await Product.insertMany(allProducts);

    const adminExists = await User.findOne({ email: 'admin@urbanstore.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@urbanstore.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('Admin created: admin@urbanstore.com / admin123');
    }

    console.log(`Seeded ${allProducts.length} products across 8 categories`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seed();
