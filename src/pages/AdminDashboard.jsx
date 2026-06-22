import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes, usersRes] = await Promise.all([
          API.get('/admin/stats'),
          API.get('/admin/orders'),
          API.get('/admin/users'),
        ]);
        setStats(statsRes.data);
        setOrders(ordersRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error('Admin fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { orderStatus: status });
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: status } : o))
      );
    } catch (err) {
      console.error('Failed to update order:', err);
    }
  };

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
        <h1 className="cart-title mb-4">Admin Dashboard</h1>

        <div className="mb-4">
          <div className="d-flex gap-2 flex-wrap">
            {['dashboard', 'orders', 'users'].map((tab) => (
              <button
                key={tab}
                className={`category-chip ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'dashboard' && stats && (
          <div className="row g-4">
            <div className="col-md-4">
              <motion.div
                className="dashboard-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="dashboard-card-icon">💰</div>
                <h3>${stats.totalRevenue?.toFixed(2)}</h3>
                <p>Total Revenue</p>
              </motion.div>
            </div>
            <div className="col-md-4">
              <motion.div
                className="dashboard-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="dashboard-card-icon">📦</div>
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders ({stats.paidOrders} paid)</p>
              </motion.div>
            </div>
            <div className="col-md-4">
              <motion.div
                className="dashboard-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="dashboard-card-icon">👥</div>
                <h3>{stats.totalUsers}</h3>
                <p>Registered Users</p>
              </motion.div>
            </div>

            <div className="col-12 mt-4">
              <div className="cart-summary">
                <h3>Recent Orders</h3>
                <div className="table-responsive">
                  <table className="table table-borderless align-middle mt-3">
                    <thead>
                      <tr style={{ color: 'var(--text-muted)' }}>
                        <th>Order</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders?.map((order) => (
                        <tr key={order._id}>
                          <td>#{order._id?.slice(-8).toUpperCase()}</td>
                          <td>{order.user?.name || 'N/A'}</td>
                          <td>${order.totalAmount?.toFixed(2)}</td>
                          <td>
                            <span
                              className={`badge bg-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge bg-${order.orderStatus === 'delivered' ? 'success' : order.orderStatus === 'shipped' ? 'info' : 'warning'}`}
                            >
                              {order.orderStatus}
                            </span>
                          </td>
                          <td>
                            <small>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="cart-summary">
            <h3>All Orders ({orders.length})</h3>
            <div className="table-responsive mt-3">
              <table className="table table-borderless align-middle">
                <thead>
                  <tr style={{ color: 'var(--text-muted)' }}>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id?.slice(-8).toUpperCase()}</td>
                      <td>
                        <div>{order.user?.name || 'N/A'}</div>
                        <small className="text-muted">
                          {order.user?.email || ''}
                        </small>
                      </td>
                      <td>
                        <small>
                          {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                        </small>
                      </td>
                      <td>
                        <strong>${order.totalAmount?.toFixed(2)}</strong>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${order.paymentStatus === 'paid' ? 'success' : 'warning'}`}
                        >
                          {order.paymentStatus}
                        </span>
                        {order.paymentInfo?.razorpayPaymentId && (
                          <div>
                            <small className="text-muted">
                              ID: {order.paymentInfo.razorpayPaymentId.slice(-10)}
                            </small>
                          </div>
                        )}
                      </td>
                      <td>
                        <span
                          className={`badge bg-${order.orderStatus === 'delivered' ? 'success' : order.orderStatus === 'shipped' ? 'info' : 'warning'}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          style={{ background: 'var(--input-bg)', color: 'var(--text-primary)', border: '1px solid var(--border-glass)' }}
                          value={order.orderStatus}
                          onChange={(e) =>
                            updateOrderStatus(order._id, e.target.value)
                          }
                        >
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="cart-summary">
            <h3>Registered Users ({users.length})</h3>
            <div className="table-responsive mt-3">
              <table className="table table-borderless align-middle">
                <thead>
                  <tr style={{ color: 'var(--text-muted)' }}>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span
                          className={`badge bg-${u.role === 'admin' ? 'danger' : 'primary'}`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <small>
                          {new Date(u.createdAt).toLocaleDateString()}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
