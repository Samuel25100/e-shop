"use client";


import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import TopBar from "./components/topbar";
import "./home.css";

interface Images {
  "_id": string,
  "url": string,
  "alt": string
}

interface Product {
  "_id": string,
  "name": string,
  "slug": string,
  "price": number,
  "discount": number,
  "finalPrice": number,
  "currency": string,
  "categoryId": {name: string} | null,
  "brand": string,
  "images": Images[],
  "stock": number,
  "isActive": boolean,
  "ratingAvg": number,
  "ratingCount": number
}

// Sample product data
/* const products_art = [
  {
    _id: 1,
    name: "Wireless Headphones",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.5,
  },
  {
    _id: 2,
    name: "Smart Watch",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.8,
  },
  {
    _id: 3,
    name: "Running Shoes",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    category: "Fashion",
    rating: 4.3,
  },
  {
    _id: 4,
    name: "Coffee Maker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop",
    category: "Home",
    rating: 4.6,
  },
  {
    _id: 5,
    name: "Laptop Backpack",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    category: "Accessories",
    rating: 4.4,
  },
  {
    _id: 6,
    name: "Bluetooth Speaker",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.7,
  },
  {
    _id: 7,
    name: "Sunglasses",
    price: 159.99,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop",
    category: "Fashion",
    rating: 4.2,
  },
  {
    _id: 8,
    name: "Water Bottle",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
    category: "Sports",
    rating: 4.5,
  },
  {
    _id: 9,
    name: "Desk Lamp",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop",
    category: "Home",
    rating: 4.3,
  },
  {
    _id: 10,
    name: "Gaming Mouse",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop",
    category: "Electronics",
    rating: 4.9,
  },
  {
    _id: 11,
    name: "Yoga Mat",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop",
    category: "Sports",
    rating: 4.4,
  },
  {
    _id: 12,
    name: "Plant Pot",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop",
    category: "Home",
    rating: 4.1,
  },
]; */

export default function HomePage() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartProducts, setCartProducts] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000 });
  const [products, setProducts] = useState<Product[]>([]);

  
  useEffect(() => { 
    async function fetchProducts() {
      const pro = await fetch("/api/products");
      const proJson = await pro.json();
      setProducts(proJson.products);
    }

    fetchProducts();
  }, []); 


  const filteredProducts : Product[] = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.categoryId?.name === selectedCategory;
    const matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const handleAddToCart = (productId: string) => {
    setCartProducts([...cartProducts, productId]);
    setCartCount(cartCount + 1);
    // In real app, this would add to cart in backend
  };
  

  return (
    <div className="page-container">
      <div className="page-container">
      <TopBar cartCount={cartCount} setPriceRange={setPriceRange} 
              selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} 
              searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
      />
      {/* Products Grid */}
      <main className="products-container">
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <Link href={`/products/${product._id}`} className="product-link">
                <div className="product-image-wrapper">
                <img
                  src={product.images[0]?.url || "https://via.placeholder.com/150"}
                  alt={product.name}
                  className="product-image"
                />
                <span className="product-category">{product.categoryId?.name}</span>
                </div>
              </Link>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <div className="product-rating">
                  <span className="rating-stars">
                    {"★".repeat(Math.floor(product.ratingAvg))}
                    {"☆".repeat(5 - Math.floor(product.ratingAvg))}
                  </span>
                  <span className="rating-value">{product.ratingAvg}</span>
                </div>
                <div className="product-price">${product.price}</div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Add to Cart
                </button>
              </div>
              
            </div>
          ))}
        </div>
      </main>
      </div>
    </div>
  );
}