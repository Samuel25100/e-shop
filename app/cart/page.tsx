"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TopBar from "@/app/components/topbar";
import "./cart.css";

// Sample cart data matching your schema
const initialCartData = {
  userId: "user123",
  items: [
    {
      _id: "item1",
      productId: {
        _id: "prod1",
        name: "Wireless Bluetooth Headphones",
        slug: "wireless-bluetooth-headphones",
        brand: "AudioTech",
        images: [
          {
            url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
            alt: "Wireless Headphones"
          }
        ],
        stock: 45,
        isActive: true
      },
      quantity: 2,
      price: 90000,
      total: 180000
    },
    {
      _id: "item2",
      productId: {
        _id: "prod2",
        name: "Smart Watch Series 5",
        slug: "smart-watch-series-5",
        brand: "TechWear",
        images: [
          {
            url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
            alt: "Smart Watch"
          }
        ],
        stock: 20,
        isActive: true
      },
      quantity: 1,
      price: 199000,
      total: 199000
    },
    {
      _id: "item3",
      productId: {
        _id: "prod3",
        name: "Running Shoes Pro",
        slug: "running-shoes-pro",
        brand: "SportMax",
        images: [
          {
            url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
            alt: "Running Shoes"
          }
        ],
        stock: 15,
        isActive: true
      },
      quantity: 1,
      price: 129000,
      total: 129000
    }
  ],
  totalItems: 4,
  totalPrice: 508000,
  currency: "UGX",
  updatedAt: new Date()
};

export default function CartPage() {
  const router = useRouter();
  const [cartData, setCartData] = useState(initialCartData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UG').format(price);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCartData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item._id === itemId) {
          // Check if quantity exceeds stock
          if (newQuantity > item.productId.stock) {
            alert(`Only ${item.productId.stock} items available in stock`);
            return item;
          }
          const newTotal = item.price * newQuantity;
          return { ...item, quantity: newQuantity, total: newTotal };
        }
        return item;
      });

      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + item.total, 0);

      return {
        ...prev,
        items: updatedItems,
        totalItems,
        totalPrice,
        updatedAt: new Date()
      };
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setCartData((prev) => {
      const updatedItems = prev.items.filter((item) => item._id !== itemId);
      const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = updatedItems.reduce((sum, item) => sum + item.total, 0);

      return {
        ...prev,
        items: updatedItems,
        totalItems,
        totalPrice,
        updatedAt: new Date()
      };
    });
  };

  const handleClearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      setCartData({
        ...cartData,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        updatedAt: new Date()
      });
    }
  };

  const handleCheckout = () => {
    // In real app, navigate to checkout page
    router.push("/checkout");
  };

  return (
    <>
      <TopBar
        cartCount={cartData.totalItems}
        setPriceRange={setPriceRange}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <div className="cart-page">
        <div className="cart-container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Shopping Cart</span>
          </div>

          <h1 className="cart-heading">Shopping Cart</h1>

          {cartData.items.length === 0 ? (
            // Empty Cart State
            <div className="empty-cart">
              <svg className="empty-cart-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="empty-cart-title">Your cart is empty</h2>
              <p className="empty-cart-text">Add items to get started</p>
              <Link href="/" className="continue-shopping-btn">
                Continue Shopping
              </Link>
            </div>
          ) : (
            // Cart with Items
            <div className="cart-layout">
              {/* Left Section - Cart Items */}
              <div className="cart-items-section">
                <div className="cart-header">
                  <h2 className="items-count">{cartData.totalItems} Item(s)</h2>
                  <button className="clear-cart-btn" onClick={handleClearCart}>
                    Clear Cart
                  </button>
                </div>

                <div className="cart-items-list">
                  {cartData.items.map((item) => (
                    <div key={item._id} className="cart-item">
                      {/* Product Image */}
                      <Link href={`/products/${item.productId._id}`} className="item-image-link">
                        <img
                          src={item.productId.images[0].url}
                          alt={item.productId.images[0].alt}
                          className="item-image"
                        />
                      </Link>

                      {/* Product Details */}
                      <div className="item-details">
                        <Link href={`/products/${item.productId._id}`} className="item-name-link">
                          <h3 className="item-name">{item.productId.name}</h3>
                        </Link>
                        <p className="item-brand">{item.productId.brand}</p>
                        <p className="item-stock">
                          {item.productId.stock > 0 ? (
                            <span className="in-stock-text">In Stock</span>
                          ) : (
                            <span className="out-of-stock-text">Out of Stock</span>
                          )}
                        </p>
                        {item.productId.stock < 10 && item.productId.stock > 0 && (
                          <p className="low-stock-warning">
                            Only {item.productId.stock} left in stock
                          </p>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="item-quantity">
                        <label className="quantity-label">Quantity:</label>
                        <div className="quantity-controls">
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            −
                          </button>
                          <span className="quantity-value">{item.quantity}</span>
                          <button
                            className="quantity-btn"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            disabled={item.quantity >= item.productId.stock}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="item-price">
                        <p className="price-label">Price:</p>
                        <p className="price-value">
                          {cartData.currency} {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Total */}
                      <div className="item-total">
                        <p className="total-label">Total:</p>
                        <p className="total-value">
                          {cartData.currency} {formatPrice(item.total)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(item._id)}
                        title="Remove item"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Continue Shopping */}
                <div className="continue-shopping">
                  <Link href="/" className="continue-shopping-link">
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Right Section - Order Summary */}
              <div className="order-summary-section">
                <div className="order-summary-card">
                  <h2 className="summary-title">Order Summary</h2>

                  <div className="summary-details">
                    <div className="summary-row">
                      <span className="summary-label">Items ({cartData.totalItems}):</span>
                      <span className="summary-value">
                        {cartData.currency} {formatPrice(cartData.totalPrice)}
                      </span>
                    </div>

                    <div className="summary-row">
                      <span className="summary-label">Shipping:</span>
                      <span className="summary-value">
                        {cartData.currency} {formatPrice(5000)}
                      </span>
                    </div>

                    <div className="summary-row">
                      <span className="summary-label">Tax (18%):</span>
                      <span className="summary-value">
                        {cartData.currency} {formatPrice(cartData.totalPrice * 0.18)}
                      </span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-row summary-total">
                      <span className="summary-label">Order Total:</span>
                      <span className="summary-value">
                        {cartData.currency} {formatPrice(cartData.totalPrice + 5000 + (cartData.totalPrice * 0.18))}
                      </span>
                    </div>
                  </div>

                  <button className="checkout-btn" onClick={handleCheckout}>
                    Proceed to Checkout
                  </button>

                  {/* Promo Code */}
                  <div className="promo-code-section">
                    <input
                      type="text"
                      placeholder="Enter promo code"
                      className="promo-input"
                    />
                    <button className="apply-promo-btn">Apply</button>
                  </div>

                  {/* Payment Methods */}
                  <div className="payment-methods">
                    <p className="payment-label">We Accept:</p>
                    <div className="payment-icons">
                      <span className="payment-icon">💳</span>
                      <span className="payment-icon">📱</span>
                      <span className="payment-icon">💰</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

