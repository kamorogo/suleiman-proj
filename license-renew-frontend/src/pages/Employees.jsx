import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/Table.jsx';


export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);

  const [subscriptions, setSubscriptions] = useState([
    { name: "Subscription 1", type: "Type 1" },
  ]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [allSelected, setAllSelected] = useState(false);




  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openModal = (user = null, index = null) => {
    if (user) {
      setFormData(user);
      setEditingIndex(index);
    } else {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        department: "",
      });
      setEditingIndex(null);
    }
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editingIndex] = formData;
      setUsers(updatedUsers);
    } else {
      setUsers([...users, formData]);
    }
    setShowModal(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      department: "",
    });
  };


  const handleSelectRow = (index) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(index)) {
        return prevSelectedRows.filter((rowIndex) => rowIndex !== index);
      } else {
        return [...prevSelectedRows, index];
      }
    });
  };

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(subscriptions.map((_, index) => index)); 
    }
    setAllSelected(!allSelected);
  };

  return (
    <div className="employees-page">
      <h1></h1>
      <div className="add-btn-container">
        <button className="add-btn" onClick={() => openModal()}>
          <i class="fa-regular fa-plus"></i>&nbsp;&nbsp; Add
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editingIndex !== null ? "Edit" : "Add"} Employee</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              /><br />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              /><br />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              /><br />
              <input
                type="text"
                name="department"
                placeholder="Department"
                value={formData.department}
                onChange={handleInputChange}
                required
              /><br />
              <div className="modal-actions">
                <button type="submit">{editingIndex !== null ? "Update" : "Save"}</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}


<div className="tables-container" style={{ marginTop: '40px' }}>
        <div className="employees-table">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.firstName} {user.lastName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <div className="card-actions">
                      <button onClick={() => openModal(user, index)} className="btn-edit">
                        Edit
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="employees-table-right">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscriptions.map((sub, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(index)}
                      onChange={() => handleSelectRow(index)}
                      className="select-row-checkbox"
                    />
                  </TableCell>
                  <TableCell>{sub.name}</TableCell>
                  <TableCell>{sub.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>



      <style>{`
       .employees-page {
      background: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    .add-btn-container {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 1rem;
    }

    .add-btn {
      background-color: hsl(224.4, 64.3%, 32.9%);
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;

    }
    .add-btn i {
      font-size: 12px
      }

    
    .tables-container {
      display: flex;
      gap: 20px; 
       overflow: hidden;
    }

 
    .employees-table {
      width: 60%;
      border: 1px solid #333;
      border-radius: 10px;
        overflow: hidden;
    }

  
    .employees-table-right {
      width: 40%;
      border: 1px solid #333;
      border-radius: 10px;
      overflow: hidden;
    }


    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      width: 50%;
      max-width: 600px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
    }

    .modal h2 {
      margin-bottom: 1rem;
    }

    .modal input {
      width: 100%;
      padding: 8px;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }

    .modal-actions {
      display: flex;
      justify-content: space-between;
    }

    .modal-actions button {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
    }

    .modal-actions button:first-child {
      background-color: #003366;
      color: white;
    }

    .modal-actions button:last-child {
      background-color: #ccc;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      caption-side: bottom;
    }

    th, td {
      padding: 12px 15px;
      border: 0px solid #e0e0e0;
    }

    th {
      background-color: #f5f5f5;
      font-weight: bold;
      color: #333;
      text-transform: uppercase;
      font-size: 14px;
      
    }

    td {
      font-size: 13px;
      color: #555;
    }

    tbody tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    tbody tr:hover {
      background-color: #f1f1f1;
    }

    caption {
      margin-top: 1rem;
      font-size: 14px;
      color: #777;
      text-align: center;
    }

      `}</style>
    </div>
  );
}
