import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/wishlist');
      setWishlistItems(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
      setLoading(false);
    }
  };

  const toggleWishlist = async (productId) => {
    if (!user) return;
    try {
      const isFav = wishlistItems.some((item) => item._id === productId);
      if (isFav) {
        const { data } = await api.delete(`/wishlist/${productId}`);
        setWishlistItems(data);
      } else {
        const { data } = await api.post('/wishlist', { productId });
        setWishlistItems(data);
      }
    } catch (err) {
      console.error('Failed to toggle wishlist:', err);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item._id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        fetchWishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
export const useWishlist = () => useContext(WishlistContext);
