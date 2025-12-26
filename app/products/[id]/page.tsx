"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import TopBar from "@/app/components/topbar";
import "./product.css";

// Sample product data matching your schema
interface Images {
  "_id": string,
  "url": string | undefined,
  "alt": string | undefined
}
export interface Description {
    feature:   String[],
    details:   String,
    specifications: { [key: string]: String },
}

export interface Product {
    _id: string,
    name: string,
    slug:         string,
    description:  Description,
    price:        number,
    discount:     number,
    finalPrice:   number,
    currency:     string,
    categoryId:   {name: string} | null,
    brand:        string,
    images:       Images[],
    stock:        number,
    isActive:     boolean,
    ratingAvg:    number,
    ratingCount:  number,
}


export default function ProductDetailPage() {
  const params = useParams();
  const [quantity, setQuantity] = useState(1);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [product, setProduct] = useState<Product>({
    _id: "",
    name: "",
    slug:         "",
    description:  {
      feature: [],
      details: "",
      specifications: {}
    },
    price:        0,
    discount:     0,
    finalPrice:   0,
    currency:     "",
    categoryId:   null,
    brand:        "",
    images:       [
      {
        _id: "",
        url: undefined,
        alt: undefined
      }
    ],
    stock:        0,
    isActive:     false,
    ratingAvg:    0,
    ratingCount:  0,
  });

  

  useEffect(() => {
    // Check nextjs session
   
    async function fetchProductById(id: any) {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      console.log("Fetched one product:", data.products);
      setProduct(data.products);
      // Update state with fetched product data if necessary
    }

    fetchProductById(params.id);
  }, [params.id]);

  const cities = ["Kampala", "Entebbe", "Jinja", "Mbarara", "Gulu"];
  const areas = {
    "Kampala": ["Central", "Nakawa", "Makindye", "Rubaga", "Kawempe"],
    "Entebbe": ["Municipality", "Katabi", "Nkumba"],
    "Jinja": ["Main Division", "Bugembe", "Walukuba"],
    "Mbarara": ["Central", "Kamukuzi", "Nyamitanga"],
    "Gulu": ["Central", "Layibi", "Pece"]
  };

  const handleAddToCart = (quantity: number) => {
    if (product.stock < quantity) {
      alert("Not enough stock available");
      return;
    }
    setCartCount(quantity + cartCount);
    // In real app, this would add to cart via API
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UG').format(price);
  };

  return (
    <>
    <TopBar cartCount={cartCount} setPriceRange={setPriceRange} 
              selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} 
              searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    <div className="product-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span className="separator">/</span>
        <Link href="/">Electronics</Link>
        <span className="separator">/</span>
        <span className="current">Headphones</span>
      </div>

      <div className="product-layout">
        {/* Left Section: Product Image and Details */}
        <div className="left-section">
          {/* Product Image Gallery */}
          <div className="product-image-section">
            <div className="image-gallery">
              {/* Main Image Display */}
              <div className="main-image-container">
                <img src={product.images[selectedImage].url} alt={product.images[selectedImage].alt}
                  className="product-detail-image" />
                {product.discount > 0 && (
                  <div className="discount-badge">
                    -{product.discount}%
                  </div>
                )}
                {product.stock < 10 && product.stock > 0 && (
                  <div className="stock-badge">
                    Only {product.stock} left!
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="thumbnail-container">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image.url} alt={image.alt} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <div className="brand-name">{product.brand}</div>
            <h1 className="product-title">{product.name}</h1>
            
            {/* Rating */}
            <div className="product-rating-section">
              <div className="rating-stars">
                {"★".repeat(Math.floor(product.ratingAvg))}
                {"☆".repeat(5 - Math.floor(product.ratingAvg))}
              </div>
              <span className="rating-text">{product.ratingAvg} out of 5</span>
              <span className="review-count">({product.ratingCount} reviews)</span>
            </div>

            {/* Price */}
            <div className="product-price-section">
              <span className="price">{product.currency} {formatPrice(product.finalPrice)}</span>
              {product.discount > 0 && (
                <>
                  <span className="original-price">{product.currency} {formatPrice(product.price)}</span>
                  <span className="discount">-{product.discount}%</span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">
                  <svg className="stock-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  In Stock ({product.stock} available)
                </span>
              ) : (
                <span className="out-of-stock">
                  <svg className="stock-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            <div className="cart-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="quantity-select"
                  disabled={product.stock === 0}
                >
                  {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                className="add-to-cart-btn" 
                onClick={() => handleAddToCart(quantity)}
                disabled={product.stock === 0 || !product.isActive}
              >
                <svg className="cart-icon-btn" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>

          {/* Product Description and Features */}
          <div className="product-details-section">
            <div className="details-tabs">
              <button className="tab-btn active">Description</button>
              <button className="tab-btn">Specifications</button>
            </div>

            <div className="details-content">
              <h2 className="details-heading">Product Description</h2>
              <p className="description-text">{product.description.details}</p>

              <h3 className="features-heading">Key Features</h3>
              <ul className="features-list">
                {product.description.feature.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>

              <h3 className="specs-heading">Specifications</h3>
              <table className="specs-table">
                <tbody>
                  {Object.entries(product.description.specifications).map(([key, value]) => (
                    <tr key={key}>
                      <td className="spec-label">{key}</td>
                      <td className="spec-value">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Section: Delivery and Return */}
        <div className="right-section">
          <div className="delivery-card">
            <h2 className="delivery-title">Delivery & Returns</h2>

            {/* Choose Location */}
            <div className="location-section">
              <h3 className="section-heading">Choose your location</h3>
              
              <div className="location-selectors">
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setSelectedArea("");
                  }}
                  className="location-select"
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="location-select"
                  disabled={!selectedCity}
                >
                  <option value="">Select Area</option>
                  {selectedCity && areas[selectedCity as keyof typeof areas]?.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Delivery Options */}
            <div className="delivery-options">
              {/* Pickup Station */}
              <div className="delivery-option">
                <div className="option-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="option-content">
                  <h4 className="option-title">Pickup Station</h4>
                  <p className="option-description">
                    Delivery Fees UGX 2,500
                  </p>
                  <p className="option-description">
                    Ready for pickup between 02 January & 05 January
                  </p>
                  <Link href="#pickup-details" className="details-link">
                    Details
                  </Link>
                </div>
              </div>

              {/* Door Delivery */}
              <div className="delivery-option">
                <div className="option-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div className="option-content">
                  <h4 className="option-title">Door Delivery</h4>
                  <p className="option-description">
                    Delivery Fees UGX 5,000
                  </p>
                  <p className="option-description">
                    Delivery between 02 January & 05 January
                  </p>
                  <Link href="#delivery-details" className="details-link">
                    Details
                  </Link>
                </div>
              </div>

              {/* Return Policy */}
              <div className="delivery-option">
                <div className="option-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
                  </svg>
                </div>
                <div className="option-content">
                  <h4 className="option-title">Return Policy</h4>
                  <p className="option-description">
                    Free return within 7 days for ALL eligible items
                  </p>
                  <Link href="#return-policy" className="details-link">
                    Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}