import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import API from '../api/axios';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const isNumeric = /^\d+$/.test(id);

        if (isNumeric) {
          try {
            const { data } = await axios.get(
              `https://fakestoreapi.com/products/${id}`
            );
            setProduct(data);
            setLoading(false);
            return;
          } catch {
            // fall through to MongoDB
          }
        }

        const { data } = await API.get(`/products/${id}`);
        setProduct({ ...data, id: data._id });
      } catch (err) {
        console.error('Failed to fetch product:', err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="text-center py-5">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-container">
        <div className="text-center py-5">
          <h3>Product not found</h3>
          <Link to="/products" className="btn btn-urban mt-3">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <div className="breadcrumb-nav">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link> /{' '}
          <span>{product.title?.slice(0, 30)}...</span>
        </div>

        <div className="row g-5 align-items-start">
          <div className="col-lg-6">
            <motion.div
              className="detail-image-wrapper"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={product.image}
                alt={product.title}
                className="detail-image"
              />
            </motion.div>
          </div>

          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="detail-category">{product.category}</span>
              <h1 className="detail-title">{product.title}</h1>

              <div className="detail-rating">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`star ${i < Math.round(product.rating?.rate || 0) ? 'filled' : ''}`}
                  >
                    ★
                  </span>
                ))}
                <span className="ms-2">
                  {product.rating?.rate} ({product.rating?.count} reviews)
                </span>
              </div>

              <h2 className="detail-price">${product.price?.toFixed(2)}</h2>

              <p className="detail-description">{product.description}</p>

              <div className="detail-actions">
                <motion.button
                  className={`btn btn-urban btn-lg ${added ? 'btn-success' : ''}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                >
                  {added ? '✓ Added to Cart' : 'Add to Cart'}
                </motion.button>
              </div>

              <div className="detail-features">
                <div className="feature-item">
                  <span className="feature-icon">🚚</span>
                  <span>Free Shipping</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔄</span>
                  <span>30-Day Returns</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">🔒</span>
                  <span>Secure Checkout</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
