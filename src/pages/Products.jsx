import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import localProducts from '../data/products';

const categories = [
  { name: 'All', slug: '' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Jewelery', slug: 'jewelery' },
  { name: 'Mobiles', slug: 'mobiles' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Foods', slug: 'foods' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Books', slug: 'books' },
  { name: 'Furniture', slug: 'furniture' },
];

const FAKE_STORE = 'https://fakestoreapi.com/products';

const categoryFilter = {
  electronics: (p) =>
    ['electronics', 'electric'].some((k) =>
      p.category?.toLowerCase().includes(k)
    ),
  jewelery: (p) =>
    ['jewelery', 'jewelry'].some((k) =>
      p.category?.toLowerCase().includes(k)
    ),
  mobiles: (p) => p.category?.toLowerCase() === 'mobiles',
  beauty: (p) => p.category?.toLowerCase() === 'beauty',
  foods: (p) => p.category?.toLowerCase() === 'foods',
  sports: (p) => p.category?.toLowerCase() === 'sports',
  books: (p) => p.category?.toLowerCase() === 'books',
  furniture: (p) => p.category?.toLowerCase() === 'furniture',
};

const Products = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await axios.get(FAKE_STORE);
        const allProducts = [...data, ...localProducts];

        let filtered = allProducts;

        if (categoryParam && categoryFilter[categoryParam]) {
          filtered = allProducts.filter(categoryFilter[categoryParam]);
        }

        if (searchParam) {
          const q = searchParam.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.title?.toLowerCase().includes(q) ||
              p.description?.toLowerCase().includes(q) ||
              p.category?.toLowerCase().includes(q)
          );
        }

        setProducts(filtered);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, searchParam]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">
            {searchParam
              ? `Search: "${searchParam}"`
              : categoryParam
              ? categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)
              : 'All Products'}
          </h1>
          <p className="page-subtitle">
            {searchParam
              ? `${products.length} results found`
              : 'Discover our complete collection'}
          </p>
        </div>
      </div>

      <section className="product-section">
        <div className="container">
          <div className="category-filters mb-4">
            <div className="d-flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isActive =
                  cat.slug === categoryParam || (!cat.slug && !categoryParam);
                return (
                  <Link
                    key={cat.slug}
                    to={
                      cat.slug
                        ? `/products?category=${cat.slug}`
                        : '/products'
                    }
                    className={`category-chip ${isActive ? 'active' : ''}`}
                  >
                    {cat.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-wrapper">
                <div className="spinner"></div>
              </div>
              <p className="loading-text">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
              <h3>Something went wrong</h3>
              <p className="text-muted">{error}</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <h3>No products found</h3>
              <p className="text-muted">Try a different category or search term.</p>
            </div>
          ) : (
            <div className="row g-4">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default Products;
