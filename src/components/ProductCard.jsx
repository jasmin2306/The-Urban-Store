import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, index = 0 }) => {
  const { addToCart } = useCart();
  const productId = product.id || product._id;

  const handleImgError = (e) => {
    e.target.src = 'https://placehold.co/400x400/2a2a2a/ffffff?text=No+Image';
  };

  return (
    <motion.div
      className="col-md-6 col-lg-4 col-xl-3"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <div className="product-card">
        <Link to={`/products/${productId}`} className="product-image-link">
          <div className="product-image-wrapper">
            <img
              src={product.image}
              alt={product.title}
              className="product-image"
              loading="lazy"
              onError={handleImgError}
            />
            <div className="product-overlay">
              <span className="view-details">View Details</span>
            </div>
          </div>
        </Link>
        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <Link to={`/products/${productId}`}>
            <h3 className="product-title">{product.title}</h3>
          </Link>
          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`star ${i < Math.round(product.rating?.rate || 0) ? 'filled' : ''}`}
              >
                ★
              </span>
            ))}
            <span className="rating-count">({product.rating?.count || 0})</span>
          </div>
          <div className="product-footer">
            <span className="product-price">${product.price.toFixed(2)}</span>
            <motion.button
              className="btn btn-urban btn-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
