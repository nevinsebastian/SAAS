import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { FiPlus, FiEdit, FiUsers, FiPieChart, FiBriefcase, FiLogOut, FiFilter, FiDownload } from 'react-icons/fi';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  // Dummy Data
  const dummyData = {
    bookings: [
      { id: 1, customer: "John Doe", vehicle: "Honda City", status: "Booking", date: "2025-02-20", executive: "Alice" },
      { id: 2, customer: "Jane Smith", vehicle: "Toyota Corolla", status: "Delivery", date: "2025-02-22", executive: "Bob" },
    ],
    salesExecutives: [
      { id: 1, name: "Alice", bookings: 15, pending: 3, rating: 4.8 },
      { id: 2, name: "Bob", bookings: 12, pending: 2, rating: 4.5 },
    ],
    financial: {
      totalRevenue: 1500000,
      pendingPayments: 250000,
      loans: 800000,
      taxes: 150000
    },
    rtoTasks: [
      { id: 1, vehicle: "Honda City", status: "Pending", customer: "John Doe" },
      { id: 2, vehicle: "Toyota Corolla", status: "Completed", customer: "Jane Smith" },
    ],
    feedback: [
      { id: 1, customer: "John Doe", rating: 5, comment: "Great service!" },
      { id: 2, customer: "Jane Smith", rating: 4, comment: "Good experience" },
    ],
    serviceBookings: [
      { id: 1, customer: "John Doe", status: "Pending", date: "2025-03-01" },
    ],
    employees: [
      { id: 1, name: "Alice Smith", role: "Sales", branch: "Downtown", status: "Active" },
      { id: 2, name: "Bob Johnson", role: "RTO", branch: "Uptown", status: "Active" },
    ]
  };

  const [dashboardData, setDashboardData] = useState({
    totalBookings: dummyData.bookings.length,
    pendingDeliveries: dummyData.bookings.filter(b => b.status !== "Completed").length,
    rtoPending: dummyData.rtoTasks.filter(t => t.status === "Pending").length,
    totalRevenue: dummyData.financial.totalRevenue,
    customerSatisfaction: dummyData.feedback.reduce((sum, f) => sum + f.rating, 0) / dummyData.feedback.length
  });

  const salesChartData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [{
      label: 'Sales Performance',
      data: [1200000, 1500000, 1800000],
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 1
    }]
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderDashboard = () => (
    <div className="dashboard-grid">
      <div className="stats-card accent-purple">
        <h3>Total Bookings</h3>
        <div className="stats-content">
          <span className="stat-number">{dashboardData.totalBookings}</span>
          <div className="stat-trend positive">+15%</div>
        </div>
      </div>
      <div className="stats-card accent-teal">
        <h3>Pending Deliveries</h3>
        <div className="stats-content">
          <span className="stat-number">{dashboardData.pendingDeliveries}</span>
          <div className="stat-trend negative">-5%</div>
        </div>
      </div>
      <div className="stats-card accent-purple">
        <h3>RTO Pending</h3>
        <div className="stats-content">
          <span className="stat-number">{dashboardData.rtoPending}</span>
          <div className="stat-trend positive">+10%</div>
        </div>
      </div>
      <div className="stats-card accent-teal">
        <h3>Total Revenue</h3>
        <div className="stats-content">
          <span className="stat-number">${dashboardData.totalRevenue.toLocaleString()}</span>
          <div className="stat-trend positive">+20%</div>
        </div>
      </div>
      <div className="chart-container">
        <h3>Sales Trend</h3>
        <Line data={salesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="section">
      <div className="section-header">
        <h2>Sales Management</h2>
        <div className="section-controls">
          <button className="secondary-btn"><FiFilter /> Filter</button>
          <button className="primary-btn"><FiDownload /> Export</button>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Vehicle</th>
              <th>Date</th>
              <th>Executive</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.bookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.customer}</td>
                <td>{booking.vehicle}</td>
                <td>{booking.date}</td>
                <td>{booking.executive}</td>
                <td>{booking.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="top-performers">
        <h3>Top Performers</h3>
        {dummyData.salesExecutives.map(exec => (
          <div key={exec.id} className="performer-card">
            <span>{exec.name}</span>
            <span>Bookings: {exec.bookings}</span>
            <span>Rating: {exec.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAccounts = () => (
    <div className="section">
      <div className="section-header">
        <h2>Financial Overview</h2>
      </div>
      <div className="financial-grid">
        <div className="stats-card">
          <h3>Total Revenue</h3>
          <span>${dummyData.financial.totalRevenue.toLocaleString()}</span>
        </div>
        <div className="stats-card">
          <h3>Pending Payments</h3>
          <span>${dummyData.financial.pendingPayments.toLocaleString()}</span>
        </div>
        <div className="stats-card">
          <h3>Loans</h3>
          <span>${dummyData.financial.loans.toLocaleString()}</span>
        </div>
        <div className="stats-card">
          <h3>Taxes</h3>
          <span>${dummyData.financial.taxes.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );

  const renderRTO = () => (
    <div className="section">
      <div className="section-header">
        <h2>RTO Management</h2>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.rtoTasks.map(task => (
              <tr key={task.id}>
                <td>{task.vehicle}</td>
                <td>{task.customer}</td>
                <td>{task.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="section">
      <div className="section-header">
        <h2>Customer Feedback</h2>
      </div>
      <div className="feedback-container">
        {dummyData.feedback.map(fb => (
          <div key={fb.id} className="feedback-card">
            <span>{fb.customer}</span>
            <span>Rating: {fb.rating}/5</span>
            <p>{fb.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="section">
      <div className="section-header">
        <h2>Service Bookings</h2>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.serviceBookings.map(service => (
              <tr key={service.id}>
                <td>{service.customer}</td>
                <td>{service.date}</td>
                <td>{service.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Portal</h2>
          <div className="user-profile">
            <div className="avatar">A</div>
            <div className="user-info">
              <span className="username">Admin</span>
              <span className="role">Administrator</span>
            </div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
              <FiPieChart /> Dashboard
            </li>
            <li className={activeTab === 'sales' ? 'active' : ''} onClick={() => setActiveTab('sales')}>
              <FiBriefcase /> Sales
            </li>
            <li className={activeTab === 'accounts' ? 'active' : ''} onClick={() => setActiveTab('accounts')}>
              <FiUsers /> Accounts
            </li>
            <li className={activeTab === 'rto' ? 'active' : ''} onClick={() => setActiveTab('rto')}>
              <FiBriefcase /> RTO
            </li>
            <li className={activeTab === 'feedback' ? 'active' : ''} onClick={() => setActiveTab('feedback')}>
              <FiUsers /> Feedback
            </li>
            <li className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}>
              <FiBriefcase /> Services
            </li>
            <li className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>
              <FiUsers /> Employees
            </li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut /> Logout
        </button>
      </div>

      <div className="admin-main">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'sales' && renderSales()}
        {activeTab === 'accounts' && renderAccounts()}
        {activeTab === 'rto' && renderRTO()}
        {activeTab === 'feedback' && renderFeedback()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'employees' && (
          <div className="employees-section">
            <div className="section-header">
              <h2>Employee Management</h2>
              <button className="primary-btn" onClick={() => setShowAddEmployeeModal(true)}>
                <FiPlus /> Add Employee
              </button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Branch</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyData.employees.map(emp => (
                    <tr key={emp.id}>
                      <td>{emp.name}</td>
                      <td>{emp.role}</td>
                      <td>{emp.branch}</td>
                      <td>{emp.status}</td>
                      <td><button className="icon-btn"><FiEdit /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAddEmployeeModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add New Employee</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select>
                    <option>Sales</option>
                    <option>RTO</option>
                    <option>Accounts</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button className="secondary-btn" onClick={() => setShowAddEmployeeModal(false)}>Cancel</button>
                <button className="primary-btn">Create</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;