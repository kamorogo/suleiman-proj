import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DashboardHome() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://127.0.0.1:8000/api/admins/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
    }
  };

  const handleAddAdmin = async () => {
    const name = prompt('Enter new admin name:');
    if (!name) return;

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://127.0.0.1:8000/api/admins/',
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAdmins(prev => [...prev, res.data]);
    } catch (error) {
      console.error('Error adding admin:', error);
    }
  };

  const handleEditAdmin = async (id) => {
    const newName = prompt('Enter new name:');
    if (!newName) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://127.0.0.1:8000/api/admins/${id}/`,
        { name: newName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAdmins();
    } catch (error) {
      console.error('Error editing admin:', error);
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!window.confirm('Are you sure you want to delete this admin?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://127.0.0.1:8000/api/admins/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(prev => prev.filter(admin => admin.id !== id));
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  return (
    <div className="dashboard">
        <div className="dashboard-cards">
            <DashboardCard title="Total Subscriptions" value="120" />
            <DashboardCard title="Tracked Employees" value="45" />
            <DashboardCard title=" Renewing in Next 30 Days" value="12" />
            <DashboardCard title="Active Licenses" value="10" />
            <DashboardCard title="Expired Licenses" value="3" />
            <DashboardCard title="Renewed This Month" value="8" />
        </div>

        <div className="admin-section">
            <div className="admin-header">
            <h2></h2>
            <button onClick={handleAddAdmin}>+ Add New Admin</button>
            </div>
            <ul className="admin-list">
            {admins.map(admin => (
                <li key={admin.id} className="admin-item">
                <span>{admin.name}</span>
                <span className="admin-role">{admin.role}</span>
                <div className="admin-actions">
                    <button onClick={() => handleEditAdmin(admin.id)} className="edit-btn">Edit</button>
                    <button onClick={() => handleDeleteAdmin(admin.id)} className="delete-btn">Delete</button>
                </div>
                </li>
            ))}
            </ul>
        </div>
    </div>
  );
}

function DashboardCard({ title, value }) {
  return (
    <div className="card">
      <h3 className="card-title">{title}</h3>
      <p className="card-value">{value}</p>

      <style>
        {`.dashboard {
            display: flex;
            flex-direction: column;
            gap: 40px;
            padding: 24px;
            }

            .dashboard-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 16px;
            }

            .card {
            background-color: hsl(224.4, 64.3%, 32.9%);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
            }

            .card-title {
            font-size: 14px;
            color: white;
            }

            .card-value {
            margin-top: 8px;
            font-size: 24px;
            font-weight: bold;
            color: white;
            }

            .admin-section {
            background: white;
            padding: 24px;
            border-radius: 8px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
            }

            .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            }

            .admin-header h2 {
            font-size: 20px;
            font-weight: 600;
            }

            .admin-header button {
            padding: 8px 16px;
            background-color: hsl(224.4, 64.3%, 32.9%);;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            }

            .admin-header button:hover {
            background-color: #004c99;
            }

            .admin-list {
            list-style: none;
            padding: 0;
            margin: 0;
            }

            .admin-item {
            display: flex;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid #eee;
            }

            .admin-role {
            font-size: 14px;
            color: #777;
            }
            `}
      </style>
    </div>
  );
}
