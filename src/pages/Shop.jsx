import React, { useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { ProductContext } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';

const Shop = () => {
  const { products, categories, fetchProducts, loading, pages, currentPage, totalProducts } = useContext(ProductContext);
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [gender, setGender] = useState(searchParams.get('gender') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [size, setSize] = useState(searchParams.get('size') || '');
  const [color, setColor] = useState(searchParams.get('color') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [specialCollection, setSpecialCollection] = useState(searchParams.get('specialCollection') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Synchronize component states when URL search parameters update
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setGender(searchParams.get('gender') || '');
    setCategory(searchParams.get('category') || '');
    setSize(searchParams.get('size') || '');
    setColor(searchParams.get('color') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSort(searchParams.get('sort') || 'newest');
    setSpecialCollection(searchParams.get('specialCollection') || '');
    setPage(Number(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Load products based on updated filters
  useEffect(() => {
    fetchProducts({
      search,
      gender,
      category,
      size,
      color,
      minPrice,
      maxPrice,
      sort,
      specialCollection,
      page,
      limit: 12
    });
  }, [search, gender, category, size, color, minPrice, maxPrice, sort, specialCollection, page]);

  const updateUrlParams = (newParams) => {
    const updated = new URLSearchParams(searchParams);
    
    // Set or delete values
    Object.keys(newParams).forEach((key) => {
      const val = newParams[key];
      if (val === null || val === undefined || val === '') {
        updated.delete(key);
      } else {
        updated.set(key, val);
      }
    });

    // Reset to page 1 on filter changes
    if (newParams.page === undefined) {
      updated.set('page', '1');
    }

    setSearchParams(updated);
  };

  const handleClearFilters = () => {
    setSearch('');
    setGender('');
    setCategory('');
    setSize('');
    setColor('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setSpecialCollection('');
    setSearchParams(new URLSearchParams());
  };

  const colorsList = ['White', 'Gold', 'Beige', 'Black', 'Yellow', 'Green', 'Maroon', 'Orange'];
  const sizesList = ['S', 'M', 'L', 'XL', 'XXL', '2-3 Yrs', '4-5 Yrs', '6-7 Yrs', '8-9 Yrs', '10-12 Yrs'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title & Counter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-luxuryGray-dark/20">
        <div>
          <h1 className="text-3xl font-serif font-bold text-charcoal">Luxury Catalog</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            Showing {totalProducts} handloom masterpieces
          </p>
        </div>

        {/* Sorting & Filter Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 border border-luxuryGray-dark/40 px-3 py-1.5 rounded bg-white">
            <ArrowUpDown size={14} className="text-gray-400" />
            <select
              value={sort}
              onChange={(e) => updateUrlParams({ sort: e.target.value })}
              className="text-xs font-semibold focus:outline-none bg-transparent"
            >
              <option value="newest">Sort: Newest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="popularity">Sort: Popularity</option>
            </select>
          </div>

          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center space-x-1.5 border border-luxuryGray-dark/40 px-3 py-1.5 rounded bg-white text-xs font-semibold"
          >
            <Filter size={14} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-luxuryGray">
            <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal flex items-center gap-1.5">
              <SlidersHorizontal size={14} />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleClearFilters}
              className="text-[10px] uppercase font-bold text-gold hover:text-gold-dark transition-colors flex items-center gap-1"
            >
              <RotateCcw size={10} />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Input Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal">Keyword Search</label>
            <input
              type="text"
              placeholder="e.g. Saree, Linen, Shirt..."
              value={search}
              onChange={(e) => updateUrlParams({ search: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-luxuryGray-dark/30 rounded focus:outline-none focus:border-gold placeholder-gray-400"
            />
          </div>

          {/* Categories Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal">Departments</label>
            <div className="flex flex-col space-y-1.5 text-xs">
              {categories.map((cat) => (
                <label key={cat._id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={category === cat.slug}
                    onChange={() => updateUrlParams({ category: cat.slug, gender: '' })}
                    className="text-gold focus:ring-gold"
                  />
                  <span className={category === cat.slug ? 'text-gold font-semibold' : 'text-gray-600'}>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-charcoal">Price Range (₹)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => updateUrlParams({ minPrice: e.target.value })}
                className="w-1/2 text-xs px-2.5 py-1.5 border border-luxuryGray-dark/30 rounded focus:outline-none bg-white"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => updateUrlParams({ maxPrice: e.target.value })}
                className="w-1/2 text-xs px-2.5 py-1.5 border border-luxuryGray-dark/30 rounded focus:outline-none bg-white"
              />
            </div>
          </div>

        </aside>

        {/* Mobile Filter Modal/Drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex md:hidden bg-charcoal/50 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-auto space-y-6 self-start shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-luxuryGray">
                <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal">Filter Catalog</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-xs uppercase font-bold text-gray-400">Close</button>
              </div>

              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                {/* Search */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-charcoal">Keyword Search</label>
                  <input
                    type="text"
                    placeholder="Keyword Search..."
                    value={search}
                    onChange={(e) => updateUrlParams({ search: e.target.value })}
                    className="w-full text-xs px-3 py-2 border rounded focus:outline-none bg-white"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-charcoal block">Department</label>
                  <div className="flex flex-col space-y-1">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center space-x-2 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="mobileCategory"
                          checked={category === cat.slug}
                          onChange={() => updateUrlParams({ category: cat.slug, gender: '' })}
                          className="text-gold focus:ring-gold"
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-charcoal block">Price Range (₹)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => updateUrlParams({ minPrice: e.target.value })}
                      className="w-1/2 text-xs px-2 py-1.5 border rounded focus:outline-none bg-white"
                    />
                    <span className="text-gray-400 text-xs">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => updateUrlParams({ maxPrice: e.target.value })}
                      className="w-1/2 text-xs px-2 py-1.5 border rounded focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 border-t pt-4">
                <button
                  onClick={handleClearFilters}
                  className="w-1/2 border py-2 text-xs uppercase font-bold text-gray-500 rounded"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-1/2 bg-gold text-charcoal py-2 text-xs uppercase font-bold rounded"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Catalog Grid & Pagination */}
        <main className="md:col-span-3 space-y-12">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-96 rounded-lg"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white border rounded-lg shadow-sm space-y-4">
              <p className="text-sm text-gray-500 font-sans">No products found matching your luxury search parameters.</p>
              <button
                onClick={handleClearFilters}
                className="bg-charcoal text-white hover:bg-gold hover:text-charcoal px-5 py-2 text-xs uppercase tracking-wider font-bold rounded transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {pages > 1 && (
                <div className="flex items-center justify-center space-x-4 border-t border-luxuryGray pt-6">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => updateUrlParams({ page: currentPage - 1 })}
                    className="p-2 border rounded hover:bg-beige-light disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <div className="flex items-center space-x-1">
                    {[...Array(pages)].map((_, i) => {
                      const pNum = i + 1;
                      return (
                        <button
                          key={pNum}
                          onClick={() => updateUrlParams({ page: pNum })}
                          className={`text-xs px-3.5 py-1.5 rounded transition-all font-semibold ${
                            currentPage === pNum ? 'bg-gold text-charcoal font-bold' : 'border hover:bg-beige-light'
                          }`}
                        >
                          {pNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    disabled={currentPage === pages}
                    onClick={() => updateUrlParams({ page: currentPage + 1 })}
                    className="p-2 border rounded hover:bg-beige-light disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>

      </div>

    </div>
  );
};

export default Shop;
