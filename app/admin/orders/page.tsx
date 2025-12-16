"use client";

import { useState } from "react";
import "./order_mng.css";

// Sample orders data
const initialOrders = [
  {
    _id: "ORD-001",
    userId: {
      _id: "user1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+256700123456"
    },
    items: [
      {
        productId: "prod1",
        name: "Wireless Headphones",
        price: 90000,
        quantity: 2,
        total: 180000
      },
      {
        productId: "prod2",
        name: "Smart Watch",
        price: 199000,
        quantity: 1,
        total: 199000
      }
    ],
    shippingAddress: {
      line1: "123 Main Street",
      line2: "Apt 4B",
      city: "Kampala",
      country: "Uganda",
      postalCode: "00256"
    },
    paymentId: "pay001",
    totalAmount: 379000,
    currency: "UGX",
    status: "pending",
    placedAt: new Date("2024-12-10T10:30:00"),
    updatedAt: new Date("2024-12-10T10:30:00")
  },
  {
    _id: "ORD-002",
    userId: {
      _id: "user2",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+256700987654"
    },
    items: [
      {
        productId: "prod3",
        name: "Running Shoes",
        price: 129000,
        quantity: 1,
        total: 129000
      }
    ],
    shippingAddress: {
      line1: "456 Oak Avenue",
      line2: "",
      city: "Entebbe",
      country: "Uganda",
      postalCode: "00257"
    },
    paymentId: "pay002",
    totalAmount: 129000,
    currency: "UGX",
    status: "shipped",
    placedAt: new Date("2024-12-09T14:20:00"),
    updatedAt: new Date("2024-12-11T09:15:00")
  },
  {
    _id: "ORD-003",
    userId: {
      _id: "user3",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+256701234567"
    },
    items: [
      {
        productId: "prod4",
        name: "Coffee Maker",
        price: 79000,
        quantity: 1,
        total: 79000
      },
      {
        productId: "prod5",
        name: "Desk Lamp",
        price: 39000,
        quantity: 2,
        total: 78000
      }
    ],
    shippingAddress: {
      line1: "789 Park Road",
      line2: "Suite 12",
      city: "Jinja",
      country: "Uganda",
      postalCode: "00258"
    },
    paymentId: "pay003",
    totalAmount: 157000,
    currency: "UGX",
    status: "delivered",
    placedAt: new Date("2024-12-05T16:45:00"),
    updatedAt: new Date("2024-12-08T11:30:00")
  },
  {
    _id: "ORD-004",
    userId: {
      _id: "user4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+256702345678"
    },
    items: [
      {
        productId: "prod6",
        name: "Bluetooth Speaker",
        price: 59000,
        quantity: 3,
        total: 177000
      }
    ],
    shippingAddress: {
      line1: "321 Lake View",
      line2: "",
      city: "Kampala",
      country: "Uganda",
      postalCode: "00256"
    },
    paymentId: "pay004",
    totalAmount: 177000,
    currency: "UGX",
    status: "paid",
    placedAt: new Date("2024-12-11T08:00:00"),
    updatedAt: new Date("2024-12-11T08:30:00")
  }
];

const statusOptions = [
  { value: "pending", label: "Pending", color: "#f59e0b" },
  { value: "paid", label: "Paid", color: "#3b82f6" },
  { value: "shipped", label: "Shipped", color: "#8b5cf6" },
  { value: "delivered", label: "Delivered", color: "#10b981" },
  { value: "cancelled", label: "Cancelled", color: "#ef4444" },
  { value: "refunded", label: "Refunded", color: "#6b7280" }
];

export default function OrderManagement() {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UG').format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    return statusOptions.find(s => s.value === status)?.color || "#6b7280";
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order =>
      order._id === orderId
        ? { ...order, status: newStatus, updatedAt: new Date() }
        : order
    ));
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm("Are you sure you want to cancel this order?")) {
      handleUpdateStatus(orderId, "cancelled");
    }
  };

  const handleRefundOrder = (orderId: string) => {
    if (confirm("Are you sure you want to refund this order?")) {
      handleUpdateStatus(orderId, "refunded");
    }
  };

  const handlePrintInvoice = (order: any) => {
    // In real app, this would generate and print invoice
    alert(`Printing invoice for order ${order._id}`);
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.userId.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || order.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.placedAt).getTime() - new Date(b.placedAt).getTime();
      } else if (sortBy === "highest") {
        return b.totalAmount - a.totalAmount;
      } else {
        return a.totalAmount - b.totalAmount;
      }
    });

  // Statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    paid: orders.filter(o => o.status === "paid").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    totalRevenue: orders.filter(o => o.status !== "cancelled" && o.status !== "refunded")
      .reduce((sum, o) => sum + o.totalAmount, 0)
  };

  return (
    <div className="orders-management">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Order Management</h1>
          <p className="page-subtitle">Track and manage customer orders</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <h3 className="stat-value">{stats.total}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-orange">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <h3 className="stat-value">{stats.pending}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Shipped</p>
            <h3 className="stat-value">{stats.shipped}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">UGX {formatPrice(stats.totalRevenue)}</h3>
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
            placeholder="Search by order ID, customer name, or email..."
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
          {statusOptions.map(status => (
            <option key={status.value} value={status.value}>{status.label}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest Amount</option>
          <option value="lowest">Lowest Amount</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td className="font-medium">{order._id}</td>
                <td>
                  <div className="customer-cell">
                    <div className="customer-name">{order.userId.name}</div>
                    <div className="customer-email">{order.userId.email}</div>
                  </div>
                </td>
                <td>
                  <div className="items-count">{order.items.length} item(s)</div>
                </td>
                <td className="font-medium">
                  {order.currency} {formatPrice(order.totalAmount)}
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                    className="status-select"
                    style={{ borderColor: getStatusColor(order.status) }}
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="date-cell">{formatDate(order.placedAt)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon-action btn-view"
                      onClick={() => handleViewDetails(order)}
                      title="View Details"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      className="btn-icon-action btn-print"
                      onClick={() => handlePrintInvoice(order)}
                      title="Print Invoice"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                    </button>
                    {order.status === "paid" || order.status === "pending" ? (
                      <button
                        className="btn-icon-action btn-cancel"
                        onClick={() => handleCancelOrder(order._id)}
                        title="Cancel Order"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ) : null}
                    {order.status === "delivered" ? (
                      <button
                        className="btn-icon-action btn-refund"
                        onClick={() => handleRefundOrder(order._id)}
                        title="Refund Order"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="empty-text">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Order Details - {selectedOrder._id}</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {/* Order Status */}
              <div className="detail-section">
                <div className="detail-header">
                  <h3 className="detail-title">Order Information</h3>
                  <span
                    className="status-badge-large"
                    style={{ backgroundColor: getStatusColor(selectedOrder.status) }}
                  >
                    {statusOptions.find(s => s.value === selectedOrder.status)?.label}
                  </span>
                </div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Order ID:</span>
                    <span className="detail-value">{selectedOrder._id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Placed At:</span>
                    <span className="detail-value">{formatDate(selectedOrder.placedAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Last Updated:</span>
                    <span className="detail-value">{formatDate(selectedOrder.updatedAt)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Payment ID:</span>
                    <span className="detail-value">{selectedOrder.paymentId}</span>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              <div className="detail-section">
                <h3 className="detail-title">Customer Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedOrder.userId.name}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedOrder.userId.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedOrder.userId.phone}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="detail-section">
                <h3 className="detail-title">Shipping Address</h3>
                <div className="address-box">
                  <p>{selectedOrder.shippingAddress.line1}</p>
                  {selectedOrder.shippingAddress.line2 && <p>{selectedOrder.shippingAddress.line2}</p>}
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.country}
                    {selectedOrder.shippingAddress.postalCode && ` - ${selectedOrder.shippingAddress.postalCode}`}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="detail-section">
                <h3 className="detail-title">Order Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{selectedOrder.currency} {formatPrice(item.price)}</td>
                        <td>{item.quantity}</td>
                        <td className="font-medium">{selectedOrder.currency} {formatPrice(item.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-right font-medium">Total Amount:</td>
                      <td className="total-amount">
                        {selectedOrder.currency} {formatPrice(selectedOrder.totalAmount)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => handlePrintInvoice(selectedOrder)}
              >
                <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print Invoice
              </button>
              <button className="btn-close" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

