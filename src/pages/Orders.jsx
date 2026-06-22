import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';

const statusColors = {
  processing: 'warning',
  shipped: 'info',
  delivered: 'success',
  cancelled: 'danger',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="page-container d-flex justify-content-center align-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="container">
        <h1 className="cart-title mb-4">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-5">
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3>No orders yet</h3>
            <p className="text-muted">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map((order) => (
              <motion.div
                key={order._id}
                className="col-12"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="cart-item flex-column flex-md-row">
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <small className="text-muted">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </small>
                        <span
                          className={`ms-2 badge bg-${statusColors[order.orderStatus] || 'secondary'}`}
                        >
                          {order.orderStatus}
                        </span>
                        <span
                          className={`ms-2 badge bg-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                      <strong className="text-nowrap">
                        ${order.totalAmount?.toFixed(2)}
                      </strong>
                    </div>

                    <div className="d-flex flex-wrap gap-3">
                      {order.items?.map((item, i) => (
                        <div key={i} className="d-flex align-items-center gap-2" style={{ maxWidth: 200 }}>
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{ width: 40, height: 40, objectFit: 'contain' }}
                          />
                          <small className="text-truncate">{item.title}</small>
                          <small className="text-muted">x{item.quantity}</small>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2">
                      <small className="text-muted">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </small>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Orders;
