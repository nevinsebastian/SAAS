import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { FiPlus, FiEdit, FiUsers, FiPieChart, FiBriefcase, FiLogOut, FiFilter, FiDownload, FiBell, FiImage, FiBarChart } from 'react-icons/fi';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Enhanced Dummy Data
  const dummyData = {
    bookings: [
      { id: 1, customer: "John Doe", vehicle: "Honda City", status: "Booking", date: "2025-02-20", expectedDelivery: "2025-03-01", executive: "Alice", amount: 15000 },
      { id: 2, customer: "Jane Smith", vehicle: "Toyota Corolla", status: "Delivery", date: "2025-02-22", expectedDelivery: "2025-02-28", executive: "Bob", amount: 18000 },
      { id: 3, customer: "Mike Johnson", vehicle: "Hyundai Creta", status: "Completed", date: "2025-02-15", expectedDelivery: "2025-02-25", executive: "Charlie", amount: 20000 },
      { id: 4, customer: "Sarah Williams", vehicle: "Maruti Swift", status: "RTO", date: "2025-02-18", expectedDelivery: "2025-03-05", executive: "Alice", amount: 12000 },
    ],
    salesExecutives: [
      { id: 1, name: "Alice", bookings: 25, pending: 5, conversions: 20, rating: 4.8, branch: "Downtown" },
      { id: 2, name: "Bob", bookings: 18, pending: 3, conversions: 15, rating: 4.5, branch: "Uptown" },
      { id: 3, name: "Charlie", bookings: 15, pending: 2, conversions: 13, rating: 4.7, branch: "Downtown" },
    ],
    financial: {
      totalRevenue: 2500000,
      pendingPayments: 350000,
      loans: 1200000,
      taxes: 250000,
      approvalsPending: [
        { id: 1, customer: "John Doe", loan: 10000, tax: 1500, total: 15000 },
        { id: 2, customer: "Sarah Williams", loan: 8000, tax: 1200, total: 12000 },
      ]
    },
    rtoTasks: [
      { id: 1, vehicle: "Honda City", status: "Pending", customer: "John Doe", days: 5 },
      { id: 2, vehicle: "Toyota Corolla", status: "Completed", customer: "Jane Smith", days: 3 },
      { id: 3, vehicle: "Maruti Swift", status: "In Progress", customer: "Sarah Williams", days: 2 },
    ],
    feedback: [
      { id: 1, customer: "John Doe", rating: 5, comment: "Great service!", aspect: "Sales" },
      { id: 2, customer: "Jane Smith", rating: 4, comment: "Good experience", aspect: "Delivery" },
      { id: 3, customer: "Mike Johnson", rating: 5, comment: "Excellent support", aspect: "Service" },
    ],
    serviceBookings: [
      { id: 1, customer: "John Doe", status: "Pending", date: "2025-03-01", type: "Regular Maintenance" },
      { id: 2, customer: "Mike Johnson", status: "In Progress", date: "2025-02-28", type: "Repair" },
    ],
    notifications: [
      { id: 1, message: "Booking confirmed for John Doe", time: "2025-02-20 10:00" },
      { id: 2, message: "Delivery scheduled for Jane Smith", time: "2025-02-22 14:30" },
    ],
    deliveries: [
      { id: 1, vehicle: "Toyota Corolla", customer: "Jane Smith", status: "On Time", expected: "2025-02-28", actual: "2025-02-27", image: "url1" },
      { id: 2, vehicle: "Hyundai Creta", customer: "Mike Johnson", status: "Delayed", expected: "2025-02-25", actual: "2025-02-27", image: "url2" },
    ],
    employees: [
      { id: 1, name: "Alice Smith", role: "Sales", branch: "Downtown", status: "Active", performance: 92 },
      { id: 2, name: "Bob Johnson", role: "RTO", branch: "Uptown", status: "Active", performance: 85 },
      { id: 3, name: "Charlie Brown", role: "Accounts", branch: "Downtown", status: "Active", performance: 88 },
    ]
  };

  const [dashboardData] = useState({
    totalBookings: dummyData.bookings.length,
    pendingDeliveries: dummyData.bookings.filter(b => b.status !== "Completed").length,
    rtoPending: dummyData.rtoTasks.filter(t => t.status === "Pending").length,
    totalRevenue: dummyData.financial.totalRevenue,
    customerSatisfaction: dummyData.feedback.reduce((sum, f) => sum + f.rating, 0) / dummyData.feedback.length,
    onTimeDeliveries: dummyData.deliveries.filter(d => d.status === "On Time").length,
    serviceCompletionRate: (dummyData.serviceBookings.filter(s => s.status === "Completed").length / dummyData.serviceBookings.length) * 100 || 0
  });

  const salesChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{
      label: 'Sales Revenue',
      data: [1200000, 1500000, 1800000, 2500000],
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      borderColor: 'rgba(99, 102, 241, 1)',
      borderWidth: 2
    }]
  };

  const vehiclePieData = {
    labels: dummyData.bookings.map(b => b.vehicle),
    datasets: [{
      data: dummyData.bookings.map(() => Math.floor(Math.random() * 10) + 1),
      backgroundColor: ['#6366f1', '#14b8a6', '#f97316', '#ef4444']
    }]
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const renderDashboard = () => (
    <div className="dashboard-grid">
      <div className="stats-card accent-purple"><h3>Total Bookings</h3><span>{dashboardData.totalBookings}</span></div>
      <div className="stats-card accent-teal"><h3>Pending Deliveries</h3><span>{dashboardData.pendingDeliveries}</span></div>
      <div className="stats-card accent-purple"><h3>RTO Pending</h3><span>{dashboardData.rtoPending}</span></div>
      <div className="stats-card accent-teal"><h3>Total Revenue</h3><span>${dashboardData.totalRevenue.toLocaleString()}</span></div>
      <div className="stats-card accent-purple"><h3>Customer Satisfaction</h3><span>{dashboardData.customerSatisfaction.toFixed(1)}/5</span></div>
      <div className="stats-card accent-teal"><h3>On-Time Deliveries</h3><span>{dashboardData.onTimeDeliveries}/{dummyData.deliveries.length}</span></div>
      <div className="chart-container">
        <h3>Sales Trend</h3>
        <Line data={salesChartData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
      <div className="chart-container">
        <h3>Top Vehicles</h3>
        <Pie data={vehiclePieData} options={{ responsive: true, maintainAspectRatio: false }} />
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="section">
      <div className="section-header">
        <h2>Sales Management</h2>
        <div className="section-controls">
          <select onChange={(e) => setSelectedFilter(e.target.value)} className="filter-select">
            <option value="all">All Status</option>
            <option value="Booking">Booking</option>
            <option value="Delivery">Delivery</option>
            <option value="Completed">Completed</option>
          </select>
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
              <th>Expected Delivery</th>
              <th>Executive</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.bookings
              .filter(b => selectedFilter === 'all' || b.status === selectedFilter)
              .map(booking => (
                <tr key={booking.id}>
                  <td>{booking.customer}</td>
                  <td>{booking.vehicle}</td>
                  <td>{booking.date}</td>
                  <td>{booking.expectedDelivery}</td>
                  <td>{booking.executive}</td>
                  <td>${booking.amount}</td>
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
            <span>{exec.name} ({exec.branch})</span>
            <span>Bookings: {exec.bookings}</span>
            <span>Conv: {exec.conversions}</span>
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
        <button className="primary-btn"><FiDownload /> Generate Report</button>
      </div>
      <div className="financial-grid">
        <div className="stats-card"><h3>Total Revenue</h3><span>${dummyData.financial.totalRevenue.toLocaleString()}</span></div>
        <div className="stats-card"><h3>Pending Payments</h3><span>${dummyData.financial.pendingPayments.toLocaleString()}</span></div>
        <div className="stats-card"><h3>Loans</h3><span>${dummyData.financial.loans.toLocaleString()}</span></div>
        <div className="stats-card"><h3>Taxes</h3><span>${dummyData.financial.taxes.toLocaleString()}</span></div>
      </div>
      <div className="table-container">
        <h3>Pending Approvals</h3>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Loan Amount</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.financial.approvalsPending.map(approval => (
              <tr key={approval.id}>
                <td>{approval.customer}</td>
                <td>${approval.loan}</td>
                <td>${approval.tax}</td>
                <td>${approval.total}</td>
                <td><button className="primary-btn small">Approve</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRTO = () => (
    <div className="section">
      <div className="section-header">
        <h2>RTO Management</h2>
        <button className="primary-btn"><FiBarChart /> Performance Report</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Days Taken</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.rtoTasks.map(task => (
              <tr key={task.id}>
                <td>{task.vehicle}</td>
                <td>{task.customer}</td>
                <td>{task.status}</td>
                <td>{task.days}</td>
                <td><button className="secondary-btn small">Update</button></td>
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
        <button className="primary-btn"><FiDownload /> Export Trends</button>
      </div>
      <div className="feedback-container">
        {dummyData.feedback.map(fb => (
          <div key={fb.id} className="feedback-card">
            <span>{fb.customer}</span>
            <span>Rating: {fb.rating}/5</span>
            <span>Aspect: {fb.aspect}</span>
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
        <button className="primary-btn"><FiDownload /> Service Report</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Date</th>
              <th>Type</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.serviceBookings.map(service => (
              <tr key={service.id}>
                <td>{service.customer}</td>
                <td>{service.date}</td>
                <td>{service.type}</td>
                <td>{service.status}</td>
                <td><button className="secondary-btn small">View Job Card</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="section">
      <div className="section-header">
        <h2>Notification Logs</h2>
        <button className="primary-btn"><FiBell /> Send Manual Notification</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Message</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.notifications.map(notif => (
              <tr key={notif.id}>
                <td>{notif.message}</td>
                <td>{notif.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderDeliveries = () => (
    <div className="section">
      <div className="section-header">
        <h2>Delivery Tracking</h2>
        <button className="primary-btn"><FiDownload /> Delivery Report</button>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Customer</th>
              <th>Expected</th>
              <th>Actual</th>
              <th>Status</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.deliveries.map(delivery => (
              <tr key={delivery.id}>
                <td>{delivery.vehicle}</td>
                <td>{delivery.customer}</td>
                <td>{delivery.expected}</td>
                <td>{delivery.actual}</td>
                <td>{delivery.status}</td>
                <td><button className="secondary-btn small"><FiImage /> View</button></td>
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
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}><FiPieChart /> Dashboard</li>
            <li className={activeTab === 'sales' ? 'active' : ''} onClick={() => setActiveTab('sales')}><FiBriefcase /> Sales</li>
            <li className={activeTab === 'accounts' ? 'active' : ''} onClick={() => setActiveTab('accounts')}><FiUsers /> Accounts</li>
            <li className={activeTab === 'rto' ? 'active' : ''} onClick={() => setActiveTab('rto')}><FiBriefcase /> RTO</li>
            <li className={activeTab === 'feedback' ? 'active' : ''} onClick={() => setActiveTab('feedback')}><FiUsers /> Feedback</li>
            <li className={activeTab === 'services' ? 'active' : ''} onClick={() => setActiveTab('services')}><FiBriefcase /> Services</li>
            <li className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}><FiBell /> Notifications</li>
            <li className={activeTab === 'deliveries' ? 'active' : ''} onClick={() => setActiveTab('deliveries')}><FiImage /> Deliveries</li>
            <li className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}><FiUsers /> Employees</li>
          </ul>
        </nav>
        <button className="logout-btn" onClick={handleLogout}><FiLogOut /> Logout</button>
      </div>

      <div className="admin-main">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'sales' && renderSales()}
        {activeTab === 'accounts' && renderAccounts()}
        {activeTab === 'rto' && renderRTO()}
        {activeTab === 'feedback' && renderFeedback()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'notifications' && renderNotifications()}
        {activeTab === 'deliveries' && renderDeliveries()}
        {activeTab === 'employees' && (
          <div className="employees-section">
            <div className="section-header">
              <h2>Employee Management</h2>
              <button className="primary-btn" onClick={() => setShowAddEmployeeModal(true)}><FiPlus /> Add Employee</button>
            </div>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Branch</th>
                    <th>Status</th>
                    <th>Performance</th>
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
                      <td>{emp.performance}%</td>
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
                <div className="form-group"><label>Name</label><input /></div>
                <div className="form-group"><label>Role</label>
                  <select>
                    <option>Sales</option>
                    <option>RTO</option>
                    <option>Accounts</option>
                  </select>
                </div>
                <div className="form-group"><label>Branch</label>
                  <select>
                    <option>Downtown</option>
                    <option>Uptown</option>
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