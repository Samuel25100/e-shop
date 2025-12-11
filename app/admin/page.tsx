// ============================================
// File: /app/admin/page.tsx
// ============================================
"use client";

import { useState } from "react";
import Link from "next/link";
import "./main.css";
import AdminSidebar from "../components/admin_sidebar";

// Sample analytics data
const analyticsData = {
  totalSales: 45680000,
  todaySales: 2340000,
  totalOrders: 1234,
  pendingOrders: 45,
  totalCustomers: 8976,
  newCustomersToday: 23,
  lowStockItem: 12,
  
  monthlySales: [
    { month: "Jan", sales: 3200000 },
    { month: "Feb", sales: 3800000 },
    { month: "Mar", sales: 4100000 },
    { month: "Apr", sales: 3900000 },
    { month: "May", sales: 4500000 },
    { month: "Jun", sales: 4800000 },
    { month: "Jul", sales: 5200000 },
    { month: "Aug", sales: 4900000 },
    { month: "Sep", sales: 5400000 },
    { month: "Oct", sales: 5800000 },
    { month: "Nov", sales: 6100000 },
    { month: "Dec", sales: 5900000 }
  ],
  
  recentOrders: [
    { id: "ORD-001", customer: "John Doe", amount: 450000, status: "Pending", date: "2024-12-11" },
    { id: "ORD-002", customer: "Jane Smith", amount: 280000, status: "Completed", date: "2024-12-11" },
    { id: "ORD-003", customer: "Mike Johnson", amount: 890000, status: "Processing", date: "2024-12-10" },
    { id: "ORD-004", customer: "Sarah Williams", amount: 320000, status: "Completed", date: "2024-12-10" },
    { id: "ORD-005", customer: "David Brown", amount: 560000, status: "Shipped", date: "2024-12-09" }
  ],
  
  topProducts: [
    { name: "Wireless Headphones", sold: 342, revenue: 30780000, stock: 45 },
    { name: "Smart Watch", sold: 289, revenue: 57511000, stock: 23 },
    { name: "Running Shoes", sold: 234, revenue: 30186000, stock: 67 },
    { name: "Coffee Maker", sold: 198, revenue: 15840000, stock: 12 },
    { name: "Laptop Backpack", sold: 187, revenue: 9350000, stock: 8 }
  ],
  
  lowStockItems: [
    { name: "Laptop Backpack", stock: 8, reorderLevel: 20 },
    { name: "Coffee Maker", stock: 12, reorderLevel: 25 },
    { name: "Desk Lamp", stock: 15, reorderLevel: 30 },
    { name: "Gaming Mouse", stock: 18, reorderLevel: 35 }
  ],
  
  revenueBreakdown: [
    { category: "Electronics", revenue: 18500000, percentage: 40.5 },
    { category: "Fashion", revenue: 13700000, percentage: 30.0 },
    { category: "Home", revenue: 9140000, percentage: 20.0 },
    { category: "Sports", revenue: 4340000, percentage: 9.5 }
  ]
};

export default function AdminDashboard() {
  

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      default: return '';
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="main-content">
        {/* Top Header */}
        <header className="content-header">
          <h1 className="page-title">Dashboard Analytics</h1>
          <div className="header-actions">
            <button className="btn-secondary">
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="user-profile">
              <img src="https://ui-avatars.com/api/?name=Admin&background=f59e0b&color=fff" alt="Admin" className="avatar" />
              <span className="user-name">Admin User</span>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon stat-icon-blue">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Sales</p>
              <h3 className="stat-value">{formatPrice(analyticsData.totalSales)}</h3>
              <p className="stat-change positive">+12.5% from last month</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-green">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Orders</p>
              <h3 className="stat-value">{analyticsData.totalOrders.toLocaleString()}</h3>
              <p className="stat-change positive">+8.2% from last month</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-purple">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Total Customers</p>
              <h3 className="stat-value">{analyticsData.totalCustomers.toLocaleString()}</h3>
              <p className="stat-change positive">+23 new today</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon stat-icon-red">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="stat-content">
              <p className="stat-label">Low Stock Items</p>
              <h3 className="stat-value">{analyticsData.lowStockItems.length}</h3>
              <p className="stat-change negative">Needs attention</p>
            </div>
          </div>
        </div>

        {/* Charts and Tables Section */}
        <div className="dashboard-grid">
          {/* Monthly Sales Chart */}
          <div className="dashboard-card chart-card">
            <h2 className="card-title">Monthly Sales</h2>
            <div className="chart-container">
              <div className="bar-chart">
                {analyticsData.monthlySales.map((data, index) => (
                  <div key={index} className="bar-wrapper">
                    <div 
                      className="bar"
                      style={{ height: `${(data.sales / 6500000) * 100}%` }}
                      title={formatPrice(data.sales)}
                    ></div>
                    <span className="bar-label">{data.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="dashboard-card">
            <h2 className="card-title">Revenue Breakdown</h2>
            <div className="revenue-list">
              {analyticsData.revenueBreakdown.map((item, index) => (
                <div key={index} className="revenue-item">
                  <div className="revenue-info">
                    <span className="revenue-category">{item.category}</span>
                    <span className="revenue-amount">{formatPrice(item.revenue)}</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="revenue-percentage">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="dashboard-card full-width">
            <h2 className="card-title">Recent Orders</h2>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="font-medium">{order.id}</td>
                      <td>{order.customer}</td>
                      <td className="font-medium">{formatPrice(order.amount)}</td>
                      <td>
                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.date}</td>
                      <td>
                        <button className="btn-link">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="dashboard-card">
            <h2 className="card-title">Top Selling Products</h2>
            <div className="product-list">
              {analyticsData.topProducts.map((product, index) => (
                <div key={index} className="product-item">
                  <div className="product-rank">{index + 1}</div>
                  <div className="product-details">
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-stats">
                      {product.sold} sold • {formatPrice(product.revenue)}
                    </p>
                  </div>
                  <div className="product-stock">
                    <span className={product.stock < 20 ? 'stock-low' : 'stock-ok'}>
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Alert */}
          <div className="dashboard-card">
            <h2 className="card-title">Low Stock Alert</h2>
            <div className="alert-list">
              {analyticsData.lowStockItems.map((item, index) => (
                <div key={index} className="alert-item">
                  <div className="alert-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="alert-content">
                    <h4 className="alert-title">{item.name}</h4>
                    <p className="alert-text">
                      Stock: {item.stock} • Reorder: {item.reorderLevel}
                    </p>
                  </div>
                  <button className="btn-small">Reorder</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


