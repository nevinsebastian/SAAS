import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminDashboard.css';
import { FiPlus, FiEdit, FiUsers, FiPieChart, FiBriefcase, FiLogOut } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Admin = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchDetails, setBranchDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableBranchDetails, setEditableBranchDetails] = useState({
    name: '',
    address: '',
    branch_manager: '',
    phone_number: ''
  });
  const [newEmployee, setNewEmployee] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role_id: '',
    branch_id: ''
  });

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddEmployee = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://api.tophaventvs.com:8000/admin/create_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Employee added:', data);
        fetchEmployeeData();
      } else {
        const data = await response.json();
        console.error('Error adding employee:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);

  const handleAddEmployeeClick = () => {
    setShowAddEmployeeForm(true);
  };

  const [employeeData, setEmployeeData] = useState({
    totalEmployees: 0,
    salesCount: 0,
    rtoCount: 0,
    accountsCount: 0,
    totalCustomers: 0
  });

  const [customerData, setCustomerData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Customers per Month',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchBranches = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://api.tophaventvs.com:8000/admin/', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBranches(data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchBranchDetails = async (branchId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`https://api.tophaventvs.com:8000/admin/${branchId}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setBranchDetails(data);
      setEditableBranchDetails(data);
    } catch (error) {
      console.error('Error fetching branch details:', error);
    }
  };

  const fetchEmployeeData = useCallback(async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('https://api.tophaventvs.com:8000/admin/users', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const totalEmployees = data.length;
      const salesCount = data.filter(user => user.role_name === 'Sales').length;
      const rtoCount = data.filter(user => user.role_name === 'RTO').length;
      const accountsCount = data.filter(user => user.role_name === 'Accounts').length;

      setEmployeeData(prevState => ({
        ...prevState,
        totalEmployees,
        salesCount,
        rtoCount,
        accountsCount
      }));

      const customerResponse = await fetch('https://api.tophaventvs.com:8000/admin/customers', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const customerData = await customerResponse.json();
      const totalCustomers = customerData.length;

      setEmployeeData(prevState => ({
        ...prevState,
        totalCustomers
      }));

      await fetchCustomerData();
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  }, []);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);

  const fetchCustomerData = async () => {
    const token = localStorage.getItem('token');
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear();
    const months = [];
    for (let i = 0; i < 5; i++) {
      const month = currentMonth - i;
      const year = currentYear;
      if (month < 1) {
        months.push({ month: 12 + month, year: year - 1 });
      } else {
        months.push({ month, year });
      }
    }

    const customerData = [];
    const labels = [];

    for (const month of months) {
      try {
        const response = await fetch(`https://api.tophaventvs.com:8000/admin/monthly-customers?month=${month.month}&year=${month.year}`, {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        customerData.push(data.length);
        labels.push(`${month.month}/${month.year}`);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    }

    setCustomerData(prevState => ({
      ...prevState,
      labels,
      datasets: [
        {
          ...prevState.datasets[0],
          data: customerData
        }
      ]
    }));
  };

  useEffect(() => {
    fetchBranches();
    fetchEmployeeData();
  }, [fetchEmployeeData]);

  useEffect(() => {
    if (selectedBranch) {
      fetchBranchDetails(selectedBranch);
    }
  }, [selectedBranch]);

  const handleBranchClick = (branchId) => {
    setSelectedBranch(branchId);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    const token = localStorage.getItem('token');

    const updatedBranchDetails = {
      name: editableBranchDetails.name,
      address: editableBranchDetails.address,
      branch_manager: editableBranchDetails.branch_manager,
      phone_number: editableBranchDetails.phone_number,
    };

    if (!updatedBranchDetails.name || !updatedBranchDetails.address || !updatedBranchDetails.phone_number || !updatedBranchDetails.branch_manager) {
      console.error('All fields are required');
      return;
    }

    try {
      const response = await fetch(`https://api.tophaventvs.com:8000/admin/${selectedBranch}`, {
        method: 'PUT',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBranchDetails),
      });

      if (response.ok) {
        console.log('Branch updated successfully');
        await fetchBranchDetails(selectedBranch);
        setIsEditing(false);
      } else {
        const data = await response.json();
        console.error('Error saving branch details:', data);
      }
    } catch (error) {
      console.error('Error saving branch details:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableBranchDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h2>Admin Portal</h2>
          <div className="user-profile">
            <div className="avatar">{user?.username[0]}</div>
            <div className="user-info">
              <span className="username">{user?.username}</span>
              <span className="role">Administrator</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
              <FiPieChart />
              Dashboard
            </li>
            <li className={activeTab === 'branches' ? 'active' : ''} onClick={() => setActiveTab('branches')}>
              <FiBriefcase />
              Branches
            </li>
            <li className={activeTab === 'employees' ? 'active' : ''} onClick={() => setActiveTab('employees')}>
              <FiUsers />
              Employees
            </li>
          </ul>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FiLogOut />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-grid">
            <div className="stats-card accent-purple">
              <h3>Total Employees</h3>
              <div className="stats-content">
                <span className="stat-number">{employeeData.totalEmployees}</span>
                <div className="stat-trend positive">+12%</div>
              </div>
            </div>

            <div className="stats-card accent-teal">
              <h3>Total Customers</h3>
              <div className="stats-content">
                <span className="stat-number">{employeeData.totalCustomers}</span>
                <div className="stat-trend positive">+24%</div>
              </div>
            </div>

            <div className="chart-container">
              <h3>Customer Growth</h3>
              <Line data={customerData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                },
                scales: {
                  y: { grid: { color: 'rgba(255,255,255,0.1)' } },
                  x: { grid: { color: 'rgba(255,255,255,0.1)' } }
                }
              }} />
            </div>
          </div>
        )}

        {/* Branches Tab */}
        {activeTab === 'branches' && (
          <div className="branches-section">
            <div className="section-header">
              <h2>Branch Management</h2>
              <button className="primary-btn">
                <FiPlus /> Add Branch
              </button>
            </div>

            <div className="branches-grid">
              {branches.map(branch => (
                <div key={branch.id} className="branch-card">
                  <div className="branch-header">
                    <h4>{branch.name}</h4>
                    <span className="status-dot active"></span>
                  </div>
                  <div className="branch-details">
                    <p><label>Manager:</label> {branch.branch_manager}</p>
                    <p><label>Location:</label> {branch.address}</p>
                    <p><label>Contact:</label> {branch.phone_number}</p>
                  </div>
                  <div className="branch-actions">
                    <button className="icon-btn"><FiEdit /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employees Tab */}
        {activeTab === 'employees' && (
          <div className="employees-section">
            <div className="section-header">
              <h2>Employee Management</h2>
              <button className="primary-btn" onClick={() => setShowAddEmployeeModal(true)}>
                <FiPlus /> Add Employee
              </button>
            </div>

            {/* Employee Table */}
            <div className="employee-table">
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
                  {/* Add employee data rows here */}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Employee Modal */}
        {showAddEmployeeModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Add New Employee</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>First Name</label>
                  <input name="first_name" value={newEmployee.first_name} onChange={handleNewEmployeeChange} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input name="last_name" value={newEmployee.last_name} onChange={handleNewEmployeeChange} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input name="email" value={newEmployee.email} onChange={handleNewEmployeeChange} />
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" name="password" value={newEmployee.password} onChange={handleNewEmployeeChange} />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select name="role_id" value={newEmployee.role_id} onChange={handleNewEmployeeChange}>
                    <option value="">Select Role</option>
                    <option value="1">Sales</option>
                    <option value="2">RTO</option>
                    <option value="3">Accounts</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Branch</label>
                  <select name="branch_id" value={newEmployee.branch_id} onChange={handleNewEmployeeChange}>
                    <option value="">Select Branch</option>
                    {branches.map(branch => (
                      <option key={branch.id} value={branch.id}>{branch.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button className="secondary-btn" onClick={() => setShowAddEmployeeModal(false)}>Cancel</button>
                <button className="primary-btn" onClick={handleAddEmployee}>Create Employee</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;