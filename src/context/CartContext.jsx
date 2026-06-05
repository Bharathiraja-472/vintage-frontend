import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

  // Fetch cart from database whenever user state changes
  useEffect(() => {
    if (user && user.role !== 'admin') {
      fetchCart();
    } else {
      setCartItems([]);
      setCoupon(null);
      setDiscountAmount(0);
    }
  }, [user]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCartItems(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity, size, color) => {
    try {
      const { data } = await api.post('/cart', { productId, quantity, size, color });
      setCartItems(data);
      return data;
    } catch (err) {
      console.error('Failed to add to cart:', err);
      throw err.response?.data?.message || 'Failed to add item';
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      setCartItems(data);
    } catch (err) {
      console.error('Failed to update quantity:', err);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      setCartItems(data);
      // Recalculate coupon if active
      if (coupon) {
        recalculateCoupon(data);
      }
    } catch (err) {
      console.error('Failed to remove from cart:', err);
    }
  };

  const applyCoupon = async (code) => {
    setCouponError('');
    try {
      const subtotalVal = getSubtotal();
      const { data } = await api.post('/coupons/verify', {
        code,
        purchaseAmount: subtotalVal
      });

      setCoupon(data);
      setDiscountAmount(data.discountVal);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Coupon verification failed';
      setCouponError(msg);
      throw msg;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscountAmount(0);
    setCouponError('');
  };

  const recalculateCoupon = async (items) => {
    if (!coupon) return;
    try {
      const subtotalVal = items.reduce((acc, item) => {
        const p = item.product.salePrice > 0 ? item.product.salePrice : item.product.price;
        return acc + p * item.quantity;
      }, 0);

      const { data } = await api.post('/coupons/verify', {
        code: coupon.code,
        purchaseAmount: subtotalVal
      });
      setCoupon(data);
      setDiscountAmount(data.discountVal);
    } catch (err) {
      // If min purchase fails now, drop coupon
      removeCoupon();
    }
  };

  const clearCart = () => {
    setCartItems([]);
    removeCoupon();
  };

  // Computations
  const getSubtotal = () => {
    return cartItems.reduce((acc, item) => {
      if (!item.product) return acc;
      const p = item.product.salePrice > 0 ? item.product.salePrice : item.product.price;
      return acc + p * item.quantity;
    }, 0);
  };

  const getTax = () => {
    // 5% traditional apparel GST
    return Math.round(getSubtotal() * 0.05);
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    // Free shipping above 1500 INR
    return subtotal > 1500 ? 0 : 100;
  };

  const getGrandTotal = () => {
    return getSubtotal() + getTax() + getShipping() - discountAmount;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        coupon,
        discountAmount,
        couponError,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        applyCoupon,
        removeCoupon,
        clearCart,
        getSubtotal,
        getTax,
        getShipping,
        getGrandTotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
export const useCart = () => useContext(CartContext);
