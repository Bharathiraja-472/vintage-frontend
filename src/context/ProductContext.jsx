import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await api.get('/products/categories');
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const fetchProducts = async (filters = {}) => {
    setLoading(true);
    try {
      // Build query params
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach((key) => {
        if (filters[key] !== undefined && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const { data } = await api.get(`/products?${queryParams.toString()}`);
      setProducts(data.products);
      setPages(data.pages);
      setTotalProducts(data.totalProducts);
      setCurrentPage(data.page);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setLoading(false);
    }
  };

  const fetchProductById = async (id) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setLoading(false);
      return data;
    } catch (err) {
      console.error('Failed to fetch product details:', err);
      setLoading(false);
      throw err;
    }
  };

  const addProductReview = async (productId, rating, comment) => {
    try {
      const { data } = await api.post(`/products/${productId}/reviews`, { rating, comment });
      // Refresh details to show new reviews
      await fetchProductById(productId);
      return data;
    } catch (err) {
      throw err.response?.data?.message || 'Review post failed';
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        product,
        loading,
        pages,
        totalProducts,
        currentPage,
        fetchProducts,
        fetchProductById,
        addProductReview
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
