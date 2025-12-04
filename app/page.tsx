"use client";


import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import "./home.css";

// Sample product data
const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Running Shoes",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    category: "Fashion",
    rating: 4.3,
  },
  {
    id: 4,
    name: "Coffee Maker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
    category: "Home",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Laptop Backpack",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    category: "Accessories",
    rating: 4.4,
  },
  {
    id: 6,
    name: "Bluetooth Speaker",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.7,
  },
  {
    id: 7,
    name: "Sunglasses",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Fashion",
    rating: 4.2,
  },
  {
    id: 8,
    name: "Water Bottle",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
    category: "Sports",
    rating: 4.5,
  },
  {
    id: 9,
    name: "Desk Lamp",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
    category: "Home",
    rating: 4.3,
  },
  {
    id: 10,
    name: "Gaming Mouse",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.9,
  },
  {
    id: 11,
    name: "Yoga Mat",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
    category: "Sports",
    rating: 4.4,
  },
  {
    id: 12,
    name: "Plant Pot",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop",
    category: "Home",
    rating: 4.1,
  },
];

export default function HomePage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["All", "Electronics", "Fashion", "Home", "Sports", "Accessories"];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (productId: number) => {
    setCartCount(cartCount + 1);
    // In real app, this would add to cart in backend
  };

  return (
    <div className="page-container">
      {/* Top Navigation Bar - Fixed */}
      <header className="top-bar">
        <div className="top-bar-content">
          {/* Logo */}
          <Link href="/" className="logo">
            <span className="logo-text">eCom</span>
          </Link>

          {/* Delivery Location */}
          <div className="delivery-location">
            <div className="location-label">Deliver to</div>
            <div className="location-text">
              <svg className="location-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              New York, 10001
            </div>
          </div>

          {/* Categories Dropdown */}
          <div className="categories-dropdown">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-select"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Search Bar */}
          <div className="search-container">
            <button
              className="filter-button"
              onClick={() => setShowFilters(!showFilters)}
              title="Filters"
            >
              <svg className="filter-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-button">
              <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* Cart */}
          <Link href="/cart" className="cart-link">
            <svg className="cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="cart-label">Cart</span>
            <span className="cart-count">{cartCount}</span>
          </Link>

          {/* User Account */}
          <div className="user-account">
            {session?.user ? (
              <Link href="/account" className="user-link">
                <div className="user-greeting">Hello, {session.user.name?.split(' ')[0]}</div>
                <div className="user-account-text">Account</div>
              </Link>
            ) : (
              <Link href="/api/auth/login" className="user-link">
                <div className="user-greeting">Hello, Sign in</div>
                <div className="user-account-text">Account & Lists</div>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Filter Panel (Optional) */}
      {showFilters && (
        <div className="filter-panel">
          <h3>Filters</h3>
          <div className="filter-options">
            <label>
              <input type="checkbox" /> Price: Under $50
            </label>
            <label>
              <input type="checkbox" /> Price: $50 - $100
            </label>
            <label>
              <input type="checkbox" /> Price: Over $100
            </label>
            <label>
              <input type="checkbox" /> Rating: 4★ & above
            </label>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <main className="products-container">
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card">
              <div className="product-image-wrapper">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <span className="product-category">{product.category}</span>
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-rating">
                  <span className="rating-stars">
                    {"★".repeat(Math.floor(product.rating))}
                    {"☆".repeat(5 - Math.floor(product.rating))}
                  </span>
                  <span className="rating-value">{product.rating}</span>
                </div>
                <div className="product-price">${product.price}</div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}