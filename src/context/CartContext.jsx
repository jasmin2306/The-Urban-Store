import { createContext, useContext, useReducer, useEffect } from 'react';
import API from '../api/axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

const loadCart = () => {
  try {
    const saved = localStorage.getItem('urban-cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.find((item) => item.id === action.payload.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }
    case 'REMOVE_FROM_CART':
      return state.filter((item) => item.id !== action.payload);
    case 'UPDATE_QUANTITY':
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(1, action.payload.quantity) }
          : item
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], loadCart);

  useEffect(() => {
    localStorage.setItem('urban-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) =>
    dispatch({ type: 'ADD_TO_CART', payload: product });

  const removeFromCart = (id) =>
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });

  const updateQuantity = (id, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const createRazorpayOrder = async () => {
    try {
      const { data } = await API.post('/orders/razorpay', {
        totalAmount: cartTotal,
      });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create order');
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      const items = cart.map((item) => ({
        productId: item._id || item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const { data } = await API.post('/orders/verify', {
        ...paymentData,
        items,
        totalAmount: cartTotal,
        shippingAddress: paymentData.shippingAddress || {},
      });
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Payment verification failed');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        createRazorpayOrder,
        verifyPayment,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
