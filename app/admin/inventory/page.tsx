"use client";


import { useState } from "react";
import "./stock_mng.css";

// Sample inventory data
const initialInventory = [
  {
    _id: "1",
    productId: "prod1",
    name: "Wireless Bluetooth Headphones",
    sku: "WBH-001",
    brand: "AudioTech",
    categoryId: "electronics",
    stock: 45,
    lowStockThreshold: 20,
    price: 90000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
    lastRestocked: new Date("2024-11-15"),
    status: "in-stock"
  },
  {
    _id: "2",
    productId: "prod2",
    name: "Smart Watch Series 5",
    sku: "SW-002",
    brand: "TechWear",
    categoryId: "electronics",
    stock: 8,
    lowStockThreshold: 15,
    price: 199000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
    lastRestocked: new Date("2024-10-20"),
    status: "low-stock"
  },
  {
    _id: "3",
    productId: "prod3",
    name: "Running Shoes Pro",
    sku: "RS-003",
    brand: "SportMax",
    categoryId: "fashion",
    stock: 0,
    lowStockThreshold: 25,
    price: 129000,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
    lastRestocked: new Date("2024-09-10"),
    status: "out-of-stock"
  },
  {
    _id: "4",
    productId: "prod4",
    name: "Coffee Maker Deluxe",
    sku: "CM-004",
    brand: "BrewMaster",
    categoryId: "home",
    stock: 12,
    lowStockThreshold: 20,
    price: 79000,
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=200&h=200&fit=crop",
    lastRestocked: new Date("2024-11-01"),
    status: "low-stock"
  },
  {
    _id: "5",
    productId: "prod5",
    name: "Laptop Backpack",
    sku: "LB-005",
    brand: "TravelPro",
    categoryId: "accessories",
    stock: 67,
    lowStockThreshold: 30,
    price: 49000,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
    lastRestocked: new Date("2024-12-01"),
    status: "in-stock"
  }
];

export default function InventoryManagement() {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [currentItem, setCurrentItem] = useState<any>(null);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "subtract">("add");
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);
  const [batchAdjustmentAmount, setBatchAdjustmentAmount] = useState(0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UG').format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'in-stock': return 'status-in-stock';
      case 'low-stock': return 'status-low-stock';
      case 'out-of-stock': return 'status-out-of-stock';
      default: return '';
    }
  };

  const updateStockStatus = (stock: number, threshold: number) => {
    if (stock === 0) return 'out-of-stock';
    if (stock <= threshold) return 'low-stock';
    return 'in-stock';
  };

  const handleAdjustStock = (item: any) => {
    setCurrentItem(item);
    setAdjustmentAmount(0);
    setAdjustmentType("add");
    setShowAdjustModal(true);
  };

  const handleSubmitAdjustment = () => {
    if (!currentItem) return;

    setInventory(inventory.map(item => {
      if (item._id === currentItem._id) {
        const newStock = adjustmentType === "add" 
          ? item.stock + adjustmentAmount 
          : Math.max(0, item.stock - adjustmentAmount);
        const newStatus = updateStockStatus(newStock, item.lowStockThreshold);
        return { 
          ...item, 
          stock: newStock, 
          status: newStatus,
          lastRestocked: new Date()
        };
      }
      return item;
    }));

    setShowAdjustModal(false);
  };

  const handleMarkSoldOut = (id: string) => {
    if (confirm("Mark this product as sold out?")) {
      setInventory(inventory.map(item => 
        item._id === id 
          ? { ...item, stock: 0, status: 'out-of-stock' }
          : item
      ));
    }
  };

  const handleBatchUpdate = () => {
    if (selectedItems.length === 0) {
      alert("Please select items to update");
      return;
    }
    setShowBatchModal(true);
  };

  const handleSubmitBatchUpdate = () => {
    setInventory(inventory.map(item => {
      if (selectedItems.includes(item._id)) {
        const newStock = item.stock + batchAdjustmentAmount;
        const newStatus = updateStockStatus(newStock, item.lowStockThreshold);
        return { 
          ...item, 
          stock: Math.max(0, newStock), 
          status: newStatus,
          lastRestocked: new Date()
        };
      }
      return item;
    }));

    setSelectedItems([]);
    setBatchAdjustmentAmount(0);
    setShowBatchModal(false);
  };

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(item => item._id));
    }
  };

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    totalProducts: inventory.length,
    inStock: inventory.filter(i => i.status === 'in-stock').length,
    lowStock: inventory.filter(i => i.status === 'low-stock').length,
    outOfStock: inventory.filter(i => i.status === 'out-of-stock').length,
    totalValue: inventory.reduce((sum, item) => sum + (item.stock * item.price), 0)
  };

  return (
    <div className="inventory-management">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Inventory Management</h1>
          <p className="page-subtitle">Track and manage your product stock levels</p>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleBatchUpdate}
          disabled={selectedItems.length === 0}
        >
          <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Batch Update ({selectedItems.length})
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Products</p>
            <h3 className="stat-value">{stats.totalProducts}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">In Stock</p>
            <h3 className="stat-value">{stats.inStock}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-orange">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Low Stock Alerts</p>
            <h3 className="stat-value">{stats.lowStock}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-red">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Out of Stock</p>
            <h3 className="stat-value">{stats.outOfStock}</h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, SKU, or brand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

        <div className="inventory-value">
          <span className="value-label">Total Inventory Value:</span>
          <span className="value-amount">UGX {formatPrice(stats.totalValue)}</span>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {stats.lowStock > 0 && (
        <div className="alert-banner">
          <svg className="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="alert-title">Low Stock Alert</h4>
            <p className="alert-text">
              {stats.lowStock} product{stats.lowStock > 1 ? 's' : ''} running low on stock. 
              {stats.outOfStock > 0 && ` ${stats.outOfStock} product${stats.outOfStock > 1 ? 's are' : ' is'} out of stock.`}
            </p>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                  onChange={toggleSelectAll}
                  className="checkbox"
                />
              </th>
              <th>Product</th>
              <th>SKU</th>
              <th>Current Stock</th>
              <th>Status</th>
              <th>Last Restocked</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(item => (
              <tr key={item._id} className={selectedItems.includes(item._id) ? 'selected-row' : ''}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => toggleSelectItem(item._id)}
                    className="checkbox"
                  />
                </td>
                <td>
                  <div className="product-cell">
                    <img src={item.image} alt={item.name} className="product-thumbnail" />
                    <div>
                      <div className="product-name">{item.name}</div>
                      <div className="product-brand">{item.brand}</div>
                    </div>
                  </div>
                </td>
                <td className="sku-cell">{item.sku}</td>
                <td>
                  <div className="stock-cell">
                    <span className="stock-number">{item.stock}</span>
                    {item.stock <= item.lowStockThreshold && item.stock > 0 && (
                      <span className="threshold-text">
                        (Below {item.lowStockThreshold})
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${getStatusClass(item.status)}`}>
                    {item.status === 'in-stock' && 'In Stock'}
                    {item.status === 'low-stock' && 'Low Stock'}
                    {item.status === 'out-of-stock' && 'Out of Stock'}
                  </span>
                </td>
                <td className="date-cell">{formatDate(item.lastRestocked)}</td>
                <td className="value-cell">
                  UGX {formatPrice(item.stock * item.price)}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon-action btn-adjust"
                      onClick={() => handleAdjustStock(item)}
                      title="Adjust Stock"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </button>
                    {item.stock > 0 && (
                      <button
                        className="btn-icon-action btn-soldout"
                        onClick={() => handleMarkSoldOut(item._id)}
                        title="Mark Sold Out"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredInventory.length === 0 && (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="empty-text">No inventory items found</p>
          </div>
        )}
      </div>

      {/* Adjust Stock Modal */}
      {showAdjustModal && currentItem && (
        <div className="modal-overlay" onClick={() => setShowAdjustModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Adjust Stock</h2>
              <button className="modal-close" onClick={() => setShowAdjustModal(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="product-info-modal">
                <img src={currentItem.image} alt={currentItem.name} className="modal-product-image" />
                <div>
                  <h3 className="modal-product-name">{currentItem.name}</h3>
                  <p className="modal-product-sku">SKU: {currentItem.sku}</p>
                  <p className="modal-current-stock">
                    Current Stock: <strong>{currentItem.stock}</strong>
                  </p>
                </div>
              </div>

              <div className="adjustment-controls">
                <label className="adjustment-label">Adjustment Type:</label>
                <div className="adjustment-type-buttons">
                  <button
                    className={`type-btn ${adjustmentType === 'add' ? 'active' : ''}`}
                    onClick={() => setAdjustmentType('add')}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Stock
                  </button>
                  <button
                    className={`type-btn ${adjustmentType === 'subtract' ? 'active' : ''}`}
                    onClick={() => setAdjustmentType('subtract')}
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                    Remove Stock
                  </button>
                </div>
              </div>

              <div className="adjustment-amount">
                <label className="adjustment-label">Quantity:</label>
                <input
                  type="number"
                  value={adjustmentAmount}
                  onChange={(e) => setAdjustmentAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="adjustment-input"
                  min="0"
                  placeholder="Enter quantity"
                />
              </div>

              <div className="new-stock-preview">
                <span>New Stock:</span>
                <span className="preview-value">
                  {adjustmentType === 'add' 
                    ? currentItem.stock + adjustmentAmount
                    : Math.max(0, currentItem.stock - adjustmentAmount)
                  }
                </span>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAdjustModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-submit" 
                onClick={handleSubmitAdjustment}
                disabled={adjustmentAmount === 0}
              >
                Apply Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Update Modal */}
      {showBatchModal && (
        <div className="modal-overlay" onClick={() => setShowBatchModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Batch Update Stock</h2>
              <button className="modal-close" onClick={() => setShowBatchModal(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <p className="batch-info">
                Update stock for {selectedItems.length} selected product{selectedItems.length > 1 ? 's' : ''}
              </p>

              <div className="batch-list">
                {inventory.filter(item => selectedItems.includes(item._id)).map(item => (
                  <div key={item._id} className="batch-item">
                    <img src={item.image} alt={item.name} className="batch-item-image" />
                    <div className="batch-item-info">
                      <span className="batch-item-name">{item.name}</span>
                      <span className="batch-item-stock">Current: {item.stock}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="batch-adjustment">
                <label className="adjustment-label">Add/Remove Quantity:</label>
                <input
                  type="number"
                  value={batchAdjustmentAmount}
                  onChange={(e) => setBatchAdjustmentAmount(parseInt(e.target.value) || 0)}
                  className="adjustment-input"
                  placeholder="Enter quantity (use negative to remove)"
                />
                <p className="batch-hint">
                  Use positive numbers to add stock, negative to remove
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowBatchModal(false)}>
                Cancel
              </button>
              <button 
                className="btn-submit" 
                onClick={handleSubmitBatchUpdate}
                disabled={batchAdjustmentAmount === 0}
              >
                Update All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
