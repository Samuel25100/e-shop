"use client";

import { useState } from "react";
import "./products_mgn.css";

// Sample products data
const initialProducts = [
  {
    _id: "1",
    name: "Wireless Bluetooth Headphones",
    slug: "wireless-bluetooth-headphones",
    description: "Premium sound quality with noise cancellation",
    price: 120000,
    discount: 25,
    finalPrice: 90000,
    currency: "UGX",
    categoryId: "electronics",
    brand: "AudioTech",
    images: [
      { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop", alt: "Headphones" }
    ],
    stock: 45,
    isActive: true,
    ratingAvg: 4.5,
    ratingCount: 128,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-10")
  },
  {
    _id: "2",
    name: "Smart Watch Series 5",
    slug: "smart-watch-series-5",
    description: "Advanced fitness tracking and notifications",
    price: 199000,
    discount: 0,
    finalPrice: 199000,
    currency: "UGX",
    categoryId: "electronics",
    brand: "TechWear",
    images: [
      { url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop", alt: "Smart Watch" }
    ],
    stock: 0,
    isActive: true,
    ratingAvg: 4.8,
    ratingCount: 89,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-12-11")
  }
];

const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "fashion", name: "Fashion" },
  { id: "home", name: "Home & Living" },
  { id: "sports", name: "Sports & Outdoors" },
  { id: "accessories", name: "Accessories" }
];

export default function ProductManagement() {
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    discount: 0,
    finalPrice: 0,
    currency: "UGX",
    categoryId: "",
    brand: "",
    images: [{ url: "", alt: "" }],
    stock: 0,
    isActive: true
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UG').format(price);
  };

  const calculateFinalPrice = (price: number, discount: number) => {
    return price - (price * discount / 100);
  };

  const handleAddProduct = () => {
    setEditMode(false);
    setCurrentProduct(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: 0,
      discount: 0,
      finalPrice: 0,
      currency: "UGX",
      categoryId: "",
      brand: "",
      images: [{ url: "", alt: "" }],
      stock: 0,
      isActive: true
    });
    setShowModal(true);
  };

  const handleEditProduct = (product: any) => {
    setEditMode(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      discount: product.discount,
      finalPrice: product.finalPrice,
      currency: product.currency,
      categoryId: product.categoryId,
      brand: product.brand,
      images: product.images,
      stock: product.stock,
      isActive: product.isActive
    });
    setShowModal(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p._id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalPrice = calculateFinalPrice(formData.price, formData.discount);
    
    if (editMode && currentProduct) {
      setProducts(products.map(p => 
        p._id === currentProduct._id 
          ? { ...p, ...formData, finalPrice, updatedAt: new Date() }
          : p
      ));
    } else {
      const newProduct = {
        _id: Date.now().toString(),
        ...formData,
        finalPrice,
        ratingAvg: 0,
        ratingCount: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setProducts([newProduct, ...products]);
    }
    
    setShowModal(false);
  };

  const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
    const newImages = [...formData.images];
    newImages[index][field] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImageField = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { url: "", alt: "" }]
    });
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      setFormData({
        ...formData,
        images: formData.images.filter((_, i) => i !== index)
      });
    }
  };

  const toggleProductStatus = (id: string) => {
    setProducts(products.map(p =>
      p._id === id ? { ...p, isActive: !p.isActive, updatedAt: new Date() } : p
    ));
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.categoryId === filterCategory;
    const matchesStatus = filterStatus === "all" ||
                          (filterStatus === "active" && product.isActive) ||
                          (filterStatus === "inactive" && !product.isActive) ||
                          (filterStatus === "in-stock" && product.stock > 0) ||
                          (filterStatus === "out-of-stock" && product.stock === 0);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="products-management">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Product Management</h1>
          <p className="page-subtitle">Manage your product inventory</p>
        </div>
        <button className="btn-primary" onClick={handleAddProduct}>
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id}>
                <td>
                  <div className="product-cell">
                    <img src={product.images[0]?.url} alt={product.name} className="product-thumbnail" />
                    <div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-brand">{product.brand}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="category-badge">
                    {categories.find(c => c.id === product.categoryId)?.name}
                  </span>
                </td>
                <td>
                  <div className="price-cell">
                    <div className="final-price">{product.currency} {formatPrice(product.finalPrice)}</div>
                    {product.discount > 0 && (
                      <div className="original-price">
                        {product.currency} {formatPrice(product.price)}
                        <span className="discount-badge">-{product.discount}%</span>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={product.isActive}
                      onChange={() => toggleProductStatus(product._id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon-action btn-edit"
                      onClick={() => handleEditProduct(product)}
                      title="Edit"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      className="btn-icon-action btn-delete"
                      onClick={() => handleDeleteProduct(product._id)}
                      title="Delete"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="empty-text">No products found</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editMode ? "Edit Product" : "Add New Product"}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-grid">
                {/* Product Name */}
                <div className="form-group full-width">
                  <label className="form-label">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    required
                    placeholder="Enter product name"
                  />
                </div>

                {/* Slug */}
                <div className="form-group full-width">
                  <label className="form-label">Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="form-input"
                    required
                    placeholder="product-url-slug"
                  />
                </div>

                {/* Brand */}
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="form-input"
                    placeholder="Brand name"
                  />
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="form-input"
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div className="form-group">
                  <label className="form-label">Price (UGX) *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="form-input"
                    required
                    min="0"
                    step="1000"
                  />
                </div>

                {/* Discount */}
                <div className="form-group">
                  <label className="form-label">Discount (%)</label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) })}
                    className="form-input"
                    min="0"
                    max="100"
                  />
                </div>

                {/* Stock */}
                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="form-input"
                    required
                    min="0"
                  />
                </div>

                {/* Active Status */}
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <label className="toggle-switch-large">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    />
                    <span className="toggle-slider-large"></span>
                    <span className="toggle-label">{formData.isActive ? 'Active' : 'Inactive'}</span>
                  </label>
                </div>

                {/* Description */}
                <div className="form-group full-width">
                  <label className="form-label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="form-textarea"
                    rows={4}
                    placeholder="Product description"
                  />
                </div>

                {/* Images */}
                <div className="form-group full-width">
                  <label className="form-label">Product Images</label>
                  {formData.images.map((image, index) => (
                    <div key={index} className="image-input-group">
                      <input
                        type="url"
                        value={image.url}
                        onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                        className="form-input"
                        placeholder="Image URL"
                      />
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                        className="form-input"
                        placeholder="Alt text"
                      />
                      {formData.images.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-image"
                          onClick={() => removeImageField(index)}
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" className="btn-add-image" onClick={addImageField}>
                    + Add Another Image
                  </button>
                </div>

                {/* Final Price Preview */}
                {formData.price > 0 && (
                  <div className="form-group full-width">
                    <div className="price-preview">
                      <span>Final Price:</span>
                      <span className="preview-price">
                        UGX {formatPrice(calculateFinalPrice(formData.price, formData.discount))}
                      </span>
                      {formData.discount > 0 && (
                        <span className="preview-discount">
                          (Save {formData.discount}%)
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editMode ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}