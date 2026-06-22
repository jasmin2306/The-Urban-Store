import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { cartCount, cartTotal } = useCart();

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
    >
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="dashboard-greeting">
            <h1>Welcome back, {user?.name}!</h1>
            <p>Here's your shopping overview</p>
          </div>
        </motion.div>

        <div className="row g-4 mt-2">
          <div className="col-md-4">
            <motion.div
              className="dashboard-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="dashboard-card-icon">🛒</div>
              <h3>{cartCount}</h3>
              <p>Items in Cart</p>
            </motion.div>
          </div>
          <div className="col-md-4">
            <motion.div
              className="dashboard-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="dashboard-card-icon">💰</div>
              <h3>${cartTotal.toFixed(2)}</h3>
              <p>Cart Total</p>
            </motion.div>
          </div>
          <div className="col-md-4">
            <motion.div
              className="dashboard-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="dashboard-card-icon">📧</div>
              <h3>{user?.email}</h3>
              <p>Account Email</p>
            </motion.div>
          </div>
        </div>

        <div className="row g-4 mt-2">
          <div className="col-12">
            <div className="d-flex gap-3 justify-content-center">
              <Link to="/orders" className="btn btn-urban">
                View My Orders
              </Link>
              <Link to="/products" className="btn btn-outline-urban">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
