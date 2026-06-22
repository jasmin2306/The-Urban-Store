import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    createRazorpayOrder,
    verifyPayment,
  } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentMsg, setPaymentMsg] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleTestCheckout = () => {
    if (!user) {
      setPaymentMsg('Please sign in to checkout');
      return;
    }
    setProcessing(true);
    setPaymentMsg('');

    setTimeout(() => {
      setPaymentMsg('Test order placed successfully! (Demo mode)');
      clearCart();
      setProcessing(false);
    }, 1500);
  };

  const handleCheckout = async () => {
    if (!user) {
      setPaymentMsg('Please sign in to checkout');
      return;
    }

    setProcessing(true);
    setPaymentMsg('');

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setPaymentMsg('Failed to load Razorpay SDK. Click "Test Payment" instead.');
        setProcessing(false);
        return;
      }

      let order;
      try {
        order = await createRazorpayOrder();
      } catch (err) {
        setPaymentMsg(err.message || 'Backend unavailable for payment. Click "Test Payment" for demo.');
        setProcessing(false);
        return;
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey || razorpayKey === 'rzp_test_xxxxxxxxxxxx') {
        setPaymentMsg('Razorpay key not configured. Update VITE_RAZORPAY_KEY_ID in .env');
        setProcessing(false);
        return;
      }

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'The Urban Store',
        description: `Order of ${cart.length} items`,
        order_id: order.id,
        prefill: {
          name: user.name || '',
          email: user.email || '',
        },
        handler: async function (response) {
          try {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              method: 'Unknown',
            });
            setPaymentMsg('Payment successful! Order placed.');
            clearCart();
          } catch {
            setPaymentMsg('Payment verification failed. Contact support.');
          }
          setProcessing(false);
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            setPaymentMsg('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        setPaymentMsg('Payment failed. Please try again.');
        setProcessing(false);
      });
      rzp.open();
    } catch (err) {
      setPaymentMsg(err.message || 'Something went wrong');
      setProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <motion.div
        className="page-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="container">
          <div className="empty-cart text-center py-5">
            <div className="empty-cart-icon">🛒</div>
            <h2>
              {paymentMsg.includes('successful')
                ? 'Order Placed Successfully!'
                : 'Your cart is empty'}
            </h2>
            <p>
              {paymentMsg.includes('successful')
                ? 'Thank you for your purchase.'
                : "Looks like you haven't added anything yet."}
            </p>
            {paymentMsg.includes('successful') && (
              <Link to="/orders" className="btn btn-urban btn-lg me-2">
                View Orders
              </Link>
            )}
            <Link to="/products" className="btn btn-urban btn-lg">
              Start Shopping
            </Link>
          </div>
        </div>
      </motion.div>
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
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="cart-title">Shopping Cart ({cart.length} items)</h1>
          <button className="btn btn-outline-danger btn-sm" onClick={clearCart}>
            Clear Cart
          </button>
        </div>

        {paymentMsg && (
          <div
            className={`alert ${
              paymentMsg.includes('successful') || paymentMsg.includes('placed')
                ? 'alert-success'
                : paymentMsg.includes('Demo')
                ? 'alert-success'
                : 'alert-info'
            }`}
          >
            {paymentMsg}
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-8">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  className="cart-item"
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="cart-item-info">
                    <Link to={`/products/${item.id}`}>
                      <h4>{item.title}</h4>
                    </Link>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-control">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="qty-value">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-link text-danger remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="col-lg-4">
            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="summary-row total">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <motion.button
                className="btn btn-urban w-100 mt-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                disabled={processing}
              >
                {processing ? 'Processing...' : 'Pay with Razorpay'}
              </motion.button>
              <motion.button
                className="btn btn-outline-urban w-100 mt-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTestCheckout}
                disabled={processing}
                style={{ fontSize: '0.85rem' }}
              >
                Test Payment (Demo)
              </motion.button>
              {!user && (
                <p className="text-muted text-center mt-2 small">
                  <Link to="/login">Sign in</Link> to checkout
                </p>
              )}
              <Link
                to="/products"
                className="btn btn-link w-100 mt-2 continue-shopping"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
