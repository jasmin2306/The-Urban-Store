import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="hero-section d-flex align-items-center">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="hero-badge">New Collection 2026</span>
              <h1 className="hero-title">
                Elevate Your
                <span className="gradient-text"> Style</span>
              </h1>
              <p className="hero-subtitle">
                Discover premium fashion that defines your individuality.
                Curated for those who dare to stand out.
              </p>
              <div className="hero-cta">
                <Link to="/products" className="btn btn-urban btn-lg me-3">
                  Shop Now
                </Link>
                <Link to="/products" className="btn btn-outline-urban btn-lg">
                  Explore Collection
                </Link>
              </div>
            </motion.div>
          </div>
          <div className="col-lg-6">
            <motion.div
              className="hero-visual"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              <div className="hero-glass-card">
                <div className="floating-badge">50% OFF</div>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">10K+</span>
                    <span className="stat-label">Happy Customers</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">500+</span>
                    <span className="stat-label">Premium Products</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <div className="hero-gradient-overlay"></div>
    </section>
  );
};

export default HeroSection;
