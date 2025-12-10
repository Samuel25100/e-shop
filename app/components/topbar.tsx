"use client";


import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import "./topbar.css";


export default function TopBar({
  cartCount,
  setPriceRange,
  setSelectedCategory,
  selectedCategory,
  setSearchQuery,
  searchQuery
}: {
  cartCount: number;
  setPriceRange: (range: { min: number; max: number }) => void;
  setSelectedCategory: (category: string) => void;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}) {
  const { data: session } = useSession();
  const [showFilters, setShowFilters] = useState(false);
  const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 20000 });

  const categories = ["All", "Electronics", "Fashion", "Home", "Sports", "Accessories"];


  const handleApplyPrice = () => {
    setPriceRange(tempPriceRange);
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setTempPriceRange({ ...tempPriceRange, min: value });

    const percent = (value / 250000) * 100;
    e.target.style.setProperty("--value", `${percent}%`);
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setTempPriceRange({ ...tempPriceRange, max: value });

    const percent = (value / 250000) * 100;
    e.target.style.setProperty("--value", `${percent}%`);
  };
  

  return (
    <>
      {/* Top Navigation Bar - Fixed */}
      <header className="top-bar">
        <div className="top-bar-content">
          {/* Logo */}
          <Link href="/" className="logo">
            <span className="logo-text">ECom</span>
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
          <div className="filter-content">
            {/* Price Range Filter */}
            <div className="price-filter">
              <div className="price-header">
                <span className="price-label">PRICE (USD)</span>
                <button className="apply-btn" onClick={handleApplyPrice}>
                  Apply
                </button>
              </div>
              
              {/* Range Slider */}
              <div className="price-slider">
                <input
                  type="range"
                  min="0"
                  max="250000"
                  value={tempPriceRange.min}
                  onChange={handleMinPriceChange}
                  className="range-input range-min"
                />
                <input
                  type="range"
                  min="0"
                  max="250000"
                  value={tempPriceRange.max}
                  onChange={handleMaxPriceChange}
                  className="range-input range-max"
                />
              </div>

              {/* Price Input Fields */}
              <div className="price-inputs">
                <input
                  type="number"
                  value={tempPriceRange.min}
                  onChange={handleMinPriceChange}
                  className="price-input"
                  placeholder="Min"
                />
                <span className="price-separator">-</span>
                <input
                  type="number"
                  value={tempPriceRange.max}
                  onChange={handleMaxPriceChange}
                  className="price-input"
                  placeholder="Max"
                />
              </div>
            </div>

            {/* Other Filters */}
            <div className="other-filters">
              <label>
                <input type="checkbox" /> Rating: 4★ & above
              </label>
              <label>
                <input type="checkbox" /> Free Shipping
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}