"use client";


import { useState } from "react";
import "./customers_mng.css";

// Sample customers data
const initialCustomers = [
  {
    _id: "user1",
    name: "John Doe",
    email: "john@example.com",
    password: "hashed_password",
    profile: "https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff",
    role: "user",
    phone: "+256700123456",
    addresses: {
      line1: "123 Main Street",
      line2: "Apt 4B",
      city: "Kampala",
      country: "Uganda",
      postalCode: "00256"
    },
    wishlist: [],
    cartId: "cart1",
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-10"),
    orderHistory: [
      {
        orderId: "ORD-001",
        date: new Date("2024-12-10"),
        total: 379000,
        status: "pending",
        items: 3
      },
      {
        orderId: "ORD-015",
        date: new Date("2024-11-25"),
        total: 150000,
        status: "delivered",
        items: 2
      }
    ],
    totalOrders: 2,
    totalSpent: 529000,
    lastOrderDate: new Date("2024-12-10")
  },
  {
    _id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    password: "hashed_password",
    profile: "https://ui-avatars.com/api/?name=Jane+Smith&background=10b981&color=fff",
    role: "user",
    phone: "+256700987654",
    addresses: {
      line1: "456 Oak Avenue",
      line2: "",
      city: "Entebbe",
      country: "Uganda",
      postalCode: "00257"
    },
    wishlist: [],
    cartId: "cart2",
    isActive: true,
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-12-11"),
    orderHistory: [
      {
        orderId: "ORD-002",
        date: new Date("2024-12-09"),
        total: 129000,
        status: "shipped",
        items: 1
      }
    ],
    totalOrders: 1,
    totalSpent: 129000,
    lastOrderDate: new Date("2024-12-09")
  },
  {
    _id: "user3",
    name: "Mike Johnson",
    email: "mike@example.com",
    password: "hashed_password",
    profile: "https://ui-avatars.com/api/?name=Mike+Johnson&background=f59e0b&color=fff",
    role: "user",
    phone: "+256701234567",
    addresses: {
      line1: "789 Park Road",
      line2: "Suite 12",
      city: "Jinja",
      country: "Uganda",
      postalCode: "00258"
    },
    wishlist: [],
    cartId: "cart3",
    isActive: false,
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-12-05"),
    orderHistory: [
      {
        orderId: "ORD-003",
        date: new Date("2024-12-05"),
        total: 157000,
        status: "delivered",
        items: 3
      },
      {
        orderId: "ORD-020",
        date: new Date("2024-11-15"),
        total: 89000,
        status: "delivered",
        items: 1
      },
      {
        orderId: "ORD-025",
        date: new Date("2024-10-20"),
        total: 245000,
        status: "cancelled",
        items: 2
      }
    ],
    totalOrders: 3,
    totalSpent: 491000,
    lastOrderDate: new Date("2024-12-05")
  },
  {
    _id: "user4",
    name: "Sarah Williams",
    email: "sarah@example.com",
    password: "hashed_password",
    profile: "https://ui-avatars.com/api/?name=Sarah+Williams&background=8b5cf6&color=fff",
    role: "admin",
    phone: "+256702345678",
    addresses: {
      line1: "321 Lake View",
      line2: "",
      city: "Kampala",
      country: "Uganda",
      postalCode: "00256"
    },
    wishlist: [],
    cartId: "cart4",
    isActive: true,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-12-11"),
    orderHistory: [
      {
        orderId: "ORD-004",
        date: new Date("2024-12-11"),
        total: 177000,
        status: "paid",
        items: 3
      }
    ],
    totalOrders: 1,
    totalSpent: 177000,
    lastOrderDate: new Date("2024-12-11")
  }
];

export default function CustomerManagement() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UG').format(price);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: "#f59e0b",
      paid: "#3b82f6",
      shipped: "#8b5cf6",
      delivered: "#10b981",
      cancelled: "#ef4444",
      refunded: "#6b7280"
    };
    return colors[status] || "#6b7280";
  };

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const handleToggleStatus = (customerId: string) => {
    setCustomers(customers.map(customer =>
      customer._id === customerId
        ? { ...customer, isActive: !customer.isActive, updatedAt: new Date() }
        : customer
    ));
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      setCustomers(customers.filter(c => c._id !== customerId));
    }
  };

  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);
      const matchesRole = filterRole === "all" || customer.role === filterRole;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && customer.isActive) ||
        (filterStatus === "inactive" && !customer.isActive);
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "most-orders") {
        return b.totalOrders - a.totalOrders;
      } else if (sortBy === "highest-spent") {
        return b.totalSpent - a.totalSpent;
      }
      return 0;
    });

  // Statistics
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.isActive).length,
    inactive: customers.filter(c => !c.isActive).length,
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0),
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0)
  };

  return (
    <div className="customers-management">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer Management</h1>
          <p className="page-subtitle">Manage and view customer information</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon stat-icon-blue">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Customers</p>
            <h3 className="stat-value">{stats.total}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-green">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Active Customers</p>
            <h3 className="stat-value">{stats.active}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-orange">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Orders</p>
            <h3 className="stat-value">{stats.totalOrders}</h3>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon stat-icon-purple">
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
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="most-orders">Most Orders</option>
          <option value="highest-spent">Highest Spent</option>
        </select>
      </div>

      {/* Customers Table */}
      <div className="customers-table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Location</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(customer => (
              <tr key={customer._id}>
                <td>
                  <div className="customer-cell">
                    <img src={customer.profile} alt={customer.name} className="customer-avatar" />
                    <div>
                      <div className="customer-name">{customer.name}</div>
                      <div className="customer-id">ID: {customer._id}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="contact-cell">
                    <div className="contact-email">{customer.email}</div>
                    <div className="contact-phone">{customer.phone}</div>
                  </div>
                </td>
                <td>
                  <div className="location-cell">
                    <div>{customer.addresses.city}</div>
                    <div className="location-country">{customer.addresses.country}</div>
                  </div>
                </td>
                <td className="font-medium">{customer.totalOrders}</td>
                <td className="font-medium">UGX {formatPrice(customer.totalSpent)}</td>
                <td>
                  <span className={`role-badge ${customer.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                    {customer.role}
                  </span>
                </td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={customer.isActive}
                      onChange={() => handleToggleStatus(customer._id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon-action btn-view"
                      onClick={() => handleViewDetails(customer)}
                      title="View Details"
                    >
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      className="btn-icon-action btn-delete"
                      onClick={() => handleDeleteCustomer(customer._id)}
                      title="Delete Customer"
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

        {filteredCustomers.length === 0 && (
          <div className="empty-state">
            <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="empty-text">No customers found</p>
          </div>
        )}
      </div>

      {/* Customer Details Modal */}
      {showDetailsModal && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Customer Details</h2>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              {/* Customer Profile */}
              <div className="detail-section">
                <div className="profile-header">
                  <img src={selectedCustomer.profile} alt={selectedCustomer.name} className="profile-avatar" />
                  <div className="profile-info">
                    <h3 className="profile-name">{selectedCustomer.name}</h3>
                    <p className="profile-role">
                      <span className={`role-badge ${selectedCustomer.role === 'admin' ? 'role-admin' : 'role-user'}`}>
                        {selectedCustomer.role}
                      </span>
                      <span className={`status-badge ${selectedCustomer.isActive ? 'status-active' : 'status-inactive'}`}>
                        {selectedCustomer.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="detail-section">
                <h3 className="detail-title">Personal Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Customer ID:</span>
                    <span className="detail-value">{selectedCustomer._id}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedCustomer.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone:</span>
                    <span className="detail-value">{selectedCustomer.phone}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Member Since:</span>
                    <span className="detail-value">{formatDate(selectedCustomer.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="detail-section">
                <h3 className="detail-title">Address</h3>
                <div className="address-box">
                  <p>{selectedCustomer.addresses.line1}</p>
                  {selectedCustomer.addresses.line2 && <p>{selectedCustomer.addresses.line2}</p>}
                  <p>
                    {selectedCustomer.addresses.city}, {selectedCustomer.addresses.country}
                    {selectedCustomer.addresses.postalCode && ` - ${selectedCustomer.addresses.postalCode}`}
                  </p>
                </div>
              </div>

              {/* Order Statistics */}
              <div className="detail-section">
                <h3 className="detail-title">Order Statistics</h3>
                <div className="stats-row">
                  <div className="stat-box">
                    <div className="stat-box-label">Total Orders</div>
                    <div className="stat-box-value">{selectedCustomer.totalOrders}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-label">Total Spent</div>
                    <div className="stat-box-value">UGX {formatPrice(selectedCustomer.totalSpent)}</div>
                  </div>
                  <div className="stat-box">
                    <div className="stat-box-label">Last Order</div>
                    <div className="stat-box-value">{formatDate(selectedCustomer.lastOrderDate)}</div>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="detail-section">
                <h3 className="detail-title">Order History</h3>
                {selectedCustomer.orderHistory.length > 0 ? (
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCustomer.orderHistory.map((order: any, index: number) => (
                        <tr key={index}>
                          <td className="font-medium">{order.orderId}</td>
                          <td>{formatDate(order.date)}</td>
                          <td>{order.items} item(s)</td>
                          <td className="font-medium">UGX {formatPrice(order.total)}</td>
                          <td>
                            <span
                              className="status-dot"
                              style={{ backgroundColor: getStatusColor(order.status) }}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-orders">No orders yet</p>
                )}
              </div>
            </div>

            <div className="modal-footer">
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