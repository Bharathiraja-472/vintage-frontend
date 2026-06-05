import React, { useEffect, useState, useContext } from 'react';
import { LayoutDashboard, ShoppingBag, Truck, Users, Plus, Edit2, Trash2, ShieldAlert, Sparkles, Check, X, Search, Info } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import api, { getImageUrl } from '../utils/api';

const AdminDashboard = () => {
  const { categories } = useContext(ProductContext);
  
  const [activeTab, setActiveTab] = useState('analytics');

  // Stats / Analytics State
  const [stats, setStats] = useState({ totalProducts: 0, totalUsers: 0, totalOrders: 0, totalRevenue: 0 });
  const [lowStockList, setLowStockList] = useState([]);
  const [ordersSummary, setOrdersSummary] = useState([]);
  const [monthlySalesTrend, setMonthlySalesTrend] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Products State
  const [productsList, setProductsList] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', sku: '', category: '', gender: 'Men', brand: 'Vintage Collection',
    price: '', salePrice: '', stock: '', sizesStr: 'S, M, L, XL, XXL',
    colorsStr: 'White, Gold, Beige', images: [], specialCollection: 'None',
    description: ''
  });

  // Orders State
  const [ordersList, setOrdersList] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Users State
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Notifications
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Initial loads
  useEffect(() => {
    fetchAnalytics();
    fetchProducts();
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchAnalytics = async () => {
    setLoadingStats(true);
    try {
      const { data } = await api.get('/admin/analytics');
      setStats(data.analytics);
      setLowStockList(data.lowStockProducts);
      setOrdersSummary(data.statusSummary);
      setMonthlySalesTrend(data.monthlySales);
      setLoadingStats(false);
    } catch (err) {
      console.error(err);
      setLoadingStats(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=100'); // Fetch large list for admin management
      setProductsList(data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { data } = await api.get('/admin/orders');
      setOrdersList(data);
      setLoadingOrders(false);
    } catch (err) {
      console.error(err);
      setLoadingOrders(false);
    }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const { data } = await api.get('/admin/users');
      setUsersList(data);
      setLoadingUsers(false);
    } catch (err) {
      console.error(err);
      setLoadingUsers(false);
    }
  };

  // ----------------------------------------------------
  // PRODUCT LOGIC
  // ----------------------------------------------------
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const { data } = await api.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setNewProduct(prev => ({
        ...prev,
        images: [...prev.images, data.url]
      }));
      setSuccessMsg('Image uploaded successfully!');
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
      e.target.value = null;
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setNewProduct(prev => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()]
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (indexToRemove) => {
    setNewProduct(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    // Pre-validations
    if (!newProduct.name || !newProduct.category || !newProduct.price || !newProduct.stock || !newProduct.description) {
      setErrorMsg('Please fill in all mandatory fields (Product Name, Description, Category, Price, Stock).');
      return;
    }

    if (newProduct.images.length === 0) {
      setErrorMsg('Product must have at least 1 image.');
      return;
    }

    const sizes = newProduct.sizesStr.split(',').map(s => s.trim()).filter(s => s !== '');
    // Default fallback colors
    const colors = ['White', 'Gold', 'Beige'];

    // Auto-generate SKU
    const generatedSku = editingProduct 
      ? newProduct.sku 
      : 'VC-' + newProduct.name.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8) + '-' + Math.floor(1000 + Math.random() * 9000);

    // Map category name to gender payload
    const selectedCategoryObj = categories.find(cat => cat._id && cat._id.toString() === newProduct.category.toString());
    const categoryName = selectedCategoryObj ? selectedCategoryObj.name.trim().toLowerCase() : '';
    
    let gender = 'Unisex';
    if (categoryName === 'men') {
      gender = 'Men';
    } else if (categoryName === 'women') {
      gender = 'Women';
    } else if (categoryName === 'kids') {
      gender = 'Kids';
    }

    const payload = {
      name: newProduct.name,
      sku: generatedSku,
      description: newProduct.description,
      category: newProduct.category,
      gender: gender,
      brand: newProduct.brand,
      price: Number(newProduct.price),
      salePrice: newProduct.salePrice ? Number(newProduct.salePrice) : 0,
      stock: Number(newProduct.stock),
      sizes,
      colors,
      images: newProduct.images,
      specialCollection: 'None'
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
        setSuccessMsg('Product updated successfully!');
      } else {
        await api.post('/products', payload);
        setSuccessMsg('New product created successfully!');
      }
      
      // Reset Form
      setNewProduct({
        name: '', sku: '', category: categories[0]?._id || '', gender: 'Men', brand: 'Vintage Collection',
        price: '', salePrice: '', stock: '', sizesStr: 'S, M, L, XL, XXL',
        colorsStr: 'White, Gold, Beige', images: [], specialCollection: 'None', description: ''
      });
      setEditingProduct(null);
      setShowProductForm(false);
      
      // Refresh listings
      fetchProducts();
      fetchAnalytics();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEditProduct = (prod) => {
    setEditingProduct(prod);
    setNewProduct({
      name: prod.name,
      sku: prod.sku,
      category: prod.category?._id || '',
      gender: prod.gender || 'Men',
      brand: prod.brand || 'Vintage Collection',
      price: prod.price,
      salePrice: prod.salePrice || '',
      stock: prod.stock,
      sizesStr: prod.sizes ? prod.sizes.join(', ') : 'S, M, L, XL, XXL',
      colorsStr: 'White, Gold, Beige',
      images: prod.images || [],
      specialCollection: 'None',
      description: prod.description || ''
    });
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This will delete associated reviews.')) {
      return;
    }

    try {
      await api.delete(`/products/${productId}`);
      setSuccessMsg('Product deleted successfully.');
      fetchProducts();
      fetchAnalytics();
    } catch (err) {
      setErrorMsg('Failed to delete product.');
    }
  };

  // ----------------------------------------------------
  // ORDER LOGIC
  // ----------------------------------------------------
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      setSuccessMsg(`Order status successfully updated to ${newStatus}`);
      fetchOrders();
      fetchAnalytics();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update order status');
    }
  };

  // ----------------------------------------------------
  // CUSTOMER BLOCK LOGIC
  // ----------------------------------------------------
  const handleToggleUserBlock = async (userId, currentBlockState) => {
    const newState = !currentBlockState;
    if (!window.confirm(`Are you sure you want to ${newState ? 'BLOCK' : 'UNBLOCK'} this user?`)) {
      return;
    }

    try {
      await api.put(`/admin/users/${userId}/block`, { isBlocked: newState });
      setSuccessMsg(`User successfully ${newState ? 'blocked' : 'unblocked'}`);
      fetchUsers();
      fetchAnalytics();
    } catch (err) {
      setErrorMsg('Failed to change user block status.');
    }
  };

  // Filtered Products for admin search listing
  const filteredProductsList = productsList.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.sku.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center pb-4 border-b">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">Management Dashboard</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Vintage Collection Store Administrative Console</p>
        </div>
        <div className="flex items-center space-x-2 text-xs font-bold text-gold-premium bg-charcoal px-3 py-1.5 rounded shadow">
          <Sparkles size={14} />
          <span>Admin Workspace</span>
        </div>
      </div>

      {/* Message Notifications */}
      {successMsg && (
        <div className="flex items-center justify-between text-xs text-green-700 bg-green-50 border border-green-200 p-3 rounded animate-fadeIn">
          <span>{successMsg}</span>
          <button onClick={() => setSuccessMsg('')}><Check size={14} /></button>
        </div>
      )}
      {errorMsg && (
        <div className="flex items-center justify-between text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded animate-fadeIn">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg('')}><X size={14} /></button>
        </div>
      )}

      {/* Sub tabs Menu */}
      <div className="flex border-b text-xs uppercase tracking-wider font-semibold">
        <button
          onClick={() => { setActiveTab('analytics'); fetchAnalytics(); }}
          className={`px-5 py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'analytics' ? 'border-gold text-gold-premium' : 'border-transparent text-gray-400 hover:text-charcoal'
          }`}
        >
          <LayoutDashboard size={14} />
          <span>Analytics</span>
        </button>
        <button
          onClick={() => { setActiveTab('products'); fetchProducts(); }}
          className={`px-5 py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'products' ? 'border-gold text-gold-premium' : 'border-transparent text-gray-400 hover:text-charcoal'
          }`}
        >
          <ShoppingBag size={14} />
          <span>Products</span>
        </button>
        <button
          onClick={() => { setActiveTab('orders'); fetchOrders(); }}
          className={`px-5 py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'orders' ? 'border-gold text-gold-premium' : 'border-transparent text-gray-400 hover:text-charcoal'
          }`}
        >
          <Truck size={14} />
          <span>Orders</span>
        </button>
        <button
          onClick={() => { setActiveTab('users'); fetchUsers(); }}
          className={`px-5 py-3 border-b-2 flex items-center gap-1.5 transition-colors ${
            activeTab === 'users' ? 'border-gold text-gold-premium' : 'border-transparent text-gray-400 hover:text-charcoal'
          }`}
        >
          <Users size={14} />
          <span>Customers</span>
        </button>
      </div>

      {/* ----------------------------------------------------
          TAB 1: ANALYTICS
          ---------------------------------------------------- */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {loadingStats ? (
            <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
          ) : (
            <>
              {/* Counters Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white border rounded-lg p-5 shadow-sm space-y-1.5">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Products</p>
                  <p className="text-2xl font-bold text-charcoal">{stats.totalProducts}</p>
                </div>
                <div className="bg-white border rounded-lg p-5 shadow-sm space-y-1.5">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Users</p>
                  <p className="text-2xl font-bold text-charcoal">{stats.totalUsers}</p>
                </div>
                <div className="bg-white border rounded-lg p-5 shadow-sm space-y-1.5">
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Total Orders</p>
                  <p className="text-2xl font-bold text-charcoal">{stats.totalOrders}</p>
                </div>
                <div className="bg-white border border-gold-premium/30 bg-gold/5 rounded-lg p-5 shadow-sm space-y-1.5">
                  <p className="text-[10px] text-gold-dark uppercase font-bold tracking-wider">Total Revenue</p>
                  <p className="text-2xl font-bold text-charcoal">₹{stats.totalRevenue}</p>
                </div>
              </div>

              {/* Low Stock Warnings Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Low Stock Warning */}
                <div className="bg-white border rounded-lg p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-serif font-bold text-charcoal border-b pb-2 flex items-center gap-1.5">
                    <ShieldAlert size={16} className="text-red-500" />
                    <span>Low Stock Alert System (Stock &lt; 10)</span>
                  </h3>

                  {lowStockList.length === 0 ? (
                    <p className="text-xs text-green-700 bg-green-50 p-4 border border-green-200 rounded text-center">
                      Good news! No products are currently running low on stock.
                    </p>
                  ) : (
                    <div className="max-h-64 overflow-y-auto space-y-2 pr-1 text-xs">
                      {lowStockList.map((p) => (
                        <div key={p._id} className="flex items-center justify-between border-b pb-2">
                          <div className="flex gap-2.5 items-center">
                            <img src={getImageUrl(p.images?.[0])} alt={p.name} className="w-8 h-10 object-cover rounded border" />
                            <div>
                              <p className="font-bold text-charcoal truncate max-w-[200px]">{p.name}</p>
                              <p className="text-[10px] text-gray-400">SKU: {p.sku}</p>
                            </div>
                          </div>
                          <span className="bg-red-50 text-red-700 font-bold border border-red-200 px-2 py-0.5 rounded">
                            {p.stock} Left
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sales distribution by orderStatus */}
                <div className="bg-white border rounded-lg p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-serif font-bold text-charcoal border-b pb-2 flex items-center gap-1.5">
                    <Info size={16} className="text-gold" />
                    <span>Sales Milestones Summary</span>
                  </h3>
                  <div className="grid grid-cols-3 gap-3 text-center text-xs">
                    {ordersSummary.map((sum, index) => (
                      <div key={index} className="border p-3 rounded bg-beige-light/25">
                        <p className="font-bold text-charcoal text-lg">{sum.count}</p>
                        <p className="text-[10px] text-gray-400 font-semibold uppercase">{sum._id}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 2: PRODUCTS
          ---------------------------------------------------- */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          
          {/* Header search & create buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full text-xs p-2.5 pl-10 border rounded focus:outline-none placeholder-gray-400"
              />
              <Search size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setNewProduct({
                  name: '', sku: '', category: categories[0]?._id || '', gender: 'Men', brand: 'Vintage Collection',
                  price: '', salePrice: '', stock: '', sizesStr: 'S, M, L, XL, XXL',
                  colorsStr: 'White, Gold, Beige', images: [], specialCollection: 'None', description: ''
                });
                setShowProductForm(!showProductForm);
              }}
              className="bg-charcoal hover:bg-gold text-white hover:text-charcoal text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded transition-all flex items-center gap-1 shadow"
            >
              <Plus size={14} />
              <span>{showProductForm ? 'Close Editor' : 'Create New Product'}</span>
            </button>
          </div>

          {/* Add / Edit Product Form */}
          {showProductForm && (
            <form onSubmit={handleProductSubmit} className="bg-white border rounded-lg p-6 shadow-sm space-y-4 text-xs">
              <h3 className="text-sm font-serif font-bold text-charcoal border-b pb-2 uppercase text-gold-dark">
                {editingProduct ? `Edit: ${newProduct.sku}` : 'Add New Luxury Garment'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Silk Saree"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Category Department *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>


                {/* Original Price */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Original Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="1999"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </div>

                {/* Sale Price */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Discount Sale Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1499"
                    value={newProduct.salePrice}
                    onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </div>

                {/* Stock */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Inventory Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="20"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </div>

                {/* Sizes */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Sizes (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="S, M, L, XL, XXL"
                    value={newProduct.sizesStr}
                    onChange={(e) => setNewProduct({ ...newProduct, sizesStr: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </div>

                {/* Brand */}
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Brand</label>
                  <input
                    type="text"
                    placeholder="Vintage Collection"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Product Description *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Provide details about fabric, weave pattern, and care instructions..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-2 border rounded focus:outline-none resize-y"
                />
              </div>

              {/* Upload & Images Manager */}
              <div className="space-y-3 pt-2 border-t">
                <label className="text-[10px] font-bold uppercase tracking-wider text-charcoal">Product Images *</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* File Upload Input */}
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center space-y-2 bg-beige-light/10">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">Option A: Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-charcoal file:text-white hover:file:bg-gold hover:file:text-charcoal cursor-pointer w-full"
                    />
                    {uploadingImage && <span className="text-[10px] text-gold-premium animate-pulse font-semibold">Uploading image file...</span>}
                  </div>

                  {/* URL Textbox Input */}
                  <div className="p-4 border border-dashed border-gray-300 rounded-lg flex flex-col justify-center space-y-2 bg-beige-light/10">
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">Option B: Add Image URL</span>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        className="flex-grow p-2 border rounded focus:outline-none text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddImageUrl}
                        className="bg-charcoal text-white hover:bg-gold hover:text-charcoal px-4 py-2 font-bold uppercase rounded text-[10px] tracking-wider transition-colors"
                      >
                        Add URL
                      </button>
                    </div>
                  </div>

                </div>

                {/* Uploaded Images Thumbnails */}
                {newProduct.images.length > 0 ? (
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">Selected Images ({newProduct.images.length})</span>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {newProduct.images.map((img, idx) => (
                        <div key={idx} className="relative group aspect-[3/4] rounded border overflow-hidden bg-beige-light shadow-sm">
                          <img src={img} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow transition-colors"
                            title="Remove Image"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-red-500 italic">No images selected yet. Please upload at least 1 image file or add a valid image URL.</p>
                )}
              </div>

              {/* Submit panel */}
              <div className="flex justify-end gap-3 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                  className="px-4 py-2 border rounded uppercase text-[11px] font-bold text-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-charcoal text-white hover:bg-gold hover:text-charcoal px-6 py-2 uppercase text-[11px] font-bold rounded transition-colors"
                >
                  {editingProduct ? 'Save Updates' : 'Add Catalog Product'}
                </button>
              </div>

            </form>
          )}

          {/* Catalog Listing Table */}
          <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto text-xs text-left">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-beige-light/35 border-b uppercase text-[10px] text-gray-400 font-bold">
                    <th className="p-3">Product Image</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Price</th>
                    <th className="p-3 text-center">Stock</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProductsList.map((prod) => (
                    <tr key={prod._id} className="hover:bg-beige-light/10">
                      <td className="p-3">
                        <img src={getImageUrl(prod.images?.[0])} alt={prod.name} className="w-8 h-10 object-cover rounded border" />
                      </td>
                      <td className="p-3 font-semibold text-charcoal">{prod.sku}</td>
                      <td className="p-3 truncate max-w-[200px]">{prod.name}</td>
                      <td className="p-3">{prod.category?.name || 'Uncategorized'}</td>
                      <td className="p-3 text-right">
                        {prod.salePrice > 0 ? (
                          <div className="flex flex-col">
                            <span className="text-gray-400 line-through">₹{prod.price}</span>
                            <span className="font-bold text-red-600">₹{prod.salePrice}</span>
                          </div>
                        ) : (
                          <span className="font-bold text-charcoal">₹{prod.price}</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded font-bold ${
                            prod.stock <= 0
                              ? 'bg-red-100 text-red-800'
                              : prod.stock < 10
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {prod.stock}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center space-x-2.5">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            className="text-gray-400 hover:text-gold transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod._id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ----------------------------------------------------
          TAB 3: ORDERS
          ---------------------------------------------------- */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {loadingOrders ? (
            <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
          ) : (
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto text-xs text-left">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-beige-light/35 border-b uppercase text-[10px] text-gray-400 font-bold">
                      <th className="p-3">Order ID</th>
                      <th className="p-3">User</th>
                      <th className="p-3">Grand Total</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3 text-center">Current Status</th>
                      <th className="p-3 text-center">Modify Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ordersList.map((order) => (
                      <tr key={order._id} className="hover:bg-beige-light/10">
                        <td className="p-3 font-semibold text-charcoal">{order._id.substring(0, 10)}...</td>
                        <td className="p-3">
                          <p className="font-semibold text-charcoal">{order.user?.name}</p>
                          <p className="text-[10px] text-gray-400">{order.user?.email}</p>
                        </td>
                        <td className="p-3 font-bold text-gold-dark">₹{order.totalPrice}</td>
                        <td className="p-3">
                          <p className="font-semibold text-charcoal">{order.paymentMethod}</p>
                          <p className={`text-[10px] ${order.paymentStatus === 'Completed' ? 'text-green-600' : 'text-gray-400'}`}>
                            {order.paymentStatus}
                          </p>
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-bold uppercase text-[9px] tracking-wider ${
                              order.orderStatus === 'Delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.orderStatus === 'Cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                            className="bg-white border rounded p-1 text-[11px] focus:outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Packed">Packed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ----------------------------------------------------
          TAB 4: CUSTOMERS
          ---------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {loadingUsers ? (
            <div className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
          ) : (
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto text-xs text-left">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-beige-light/35 border-b uppercase text-[10px] text-gray-400 font-bold">
                      <th className="p-3">Customer Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Joined Date</th>
                      <th className="p-3 text-center">Blocked Status</th>
                      <th className="p-3 text-center">Control Settings</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {usersList.map((cust) => (
                      <tr key={cust._id} className="hover:bg-beige-light/10">
                        <td className="p-3 font-semibold text-charcoal">{cust.name}</td>
                        <td className="p-3 text-gray-600">{cust.email}</td>
                        <td className="p-3 text-gray-600">{cust.phone || 'N/A'}</td>
                        <td className="p-3 text-gray-400">
                          {new Date(cust.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                              cust.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {cust.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleToggleUserBlock(cust._id, cust.isBlocked)}
                            className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-colors ${
                              cust.isBlocked
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-red-500 hover:bg-red-600 text-white'
                            }`}
                          >
                            {cust.isBlocked ? 'Unblock' : 'Block User'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
