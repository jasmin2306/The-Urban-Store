import { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../api/axios';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        let apiProducts = [];
        let mongoProducts = [];

        // Fetch from FakeStoreAPI
        try {
          const res = await axios.get('https://fakestoreapi.com/products');
          apiProducts = res.data;
        } catch (e) {
          console.warn('FakeStoreAPI unavailable');
        }

        // Fetch from Backend
        try {
          const res = await API.get('/products');
          mongoProducts = (res.data.products || []).map(p => ({ ...p, id: p._id }));
        } catch (e) {
          console.warn('Backend products unavailable');
        }

        // Combine and remove duplicates based on title (simple heuristic) or ID
        const combined = [...apiProducts, ...mongoProducts];
        const unique = Array.from(new Map(combined.map(item => [item.title, item])).values());
        
        setProducts(unique.slice(0, 8)); // Show top 8 on home
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  if (loading) {
    return (
      <section className="product-section">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-wrapper">
              <div className="spinner"></div>
            </div>
            <p className="loading-text">Curating the finest products...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section className="product-section">
        <div className="container">
          <div className="text-center py-5">
            <div className="error-icon">⚠️</div>
            <h3>Something went wrong</h3>
            <p className="text-muted">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="product-section">
      <div className="container">
        <motion.div
          className="section-header text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="section-badge">Our Collection</span>
          <h2 className="section-title">Premium Selection</h2>
          <p className="section-subtitle">
            Handpicked products that blend quality with style
          </p>
        </motion.div>

        <div className="row g-4">
          {products.map((product, index) => (
            <ProductCard key={product.id || product._id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
