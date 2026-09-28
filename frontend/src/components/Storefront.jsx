import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  X, 
  Star, 
  ShoppingCart, 
  PackageOpen 
} from 'lucide-react';

export default function Storefront({ products, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState('default');

  const categories = useMemo(() => {
    return ['All', ...new Set(products.map(p => p.category))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }

    if (sortMode === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortMode === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortMode === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [products, selectedCategory, searchQuery, sortMode]);

  return (
    <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div className="hero-content">
          <span className="hero-tag">
            <ShieldCheck size={14} /> Cloud Native Architecture
          </span>
          <h1 className="hero-title">Discover High-Performance Tech & Essentials</h1>
          <p className="hero-desc">
            Powered by Spring Boot Microservices, Eureka Discovery, Spring Cloud Gateway, and PostgreSQL.
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-val">{products.length}+</span>
              <span className="stat-lbl">Products</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-val">3</span>
              <span className="stat-lbl">Microservices</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-val">Postgres</span>
              <span className="stat-lbl">Database</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="controls-bar">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products, description, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="category-pills">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="sort-box">
          <select value={sortMode} onChange={(e) => setSortMode(e.target.value)}>
            <option value="default">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>
          <PackageOpen size={48} color="var(--text-dark)" style={{ marginBottom: '1rem' }} />
          <h3>No Products Found</h3>
          <p>Try searching for a different keyword or category.</p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map(p => {
            const inStock = p.stockQuantity > 0;
            return (
              <div key={p.id} className="product-card">
                <div className="card-img-wrapper">
                  <img 
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'} 
                    alt={p.name} 
                    className="product-img"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'; }}
                  />
                  <span className="category-badge">{p.category}</span>
                  <span className={`stock-badge ${inStock ? 'in-stock' : 'out-of-stock'}`}>
                    {inStock ? `${p.stockQuantity} in stock` : 'Out of Stock'}
                  </span>
                </div>

                <div className="card-body">
                  <div className="card-rating">
                    <Star size={14} fill="#FBBF24" color="#FBBF24" />
                    <span>{p.rating || 4.5}</span>
                  </div>
                  <h3 className="card-title">{p.name}</h3>
                  <p className="card-desc">
                    {p.description || 'Premium quality product certified and distributed through QuickMart platform.'}
                  </p>
                  <div className="card-footer">
                    <span className="card-price">${Number(p.price).toFixed(2)}</span>
                    <button 
                      className="btn-add-cart"
                      onClick={() => onAddToCart(p)}
                      disabled={!inStock}
                    >
                      <ShoppingCart size={15} /> {inStock ? 'Add to Cart' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
