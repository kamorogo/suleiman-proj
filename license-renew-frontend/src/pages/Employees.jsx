import React, { useState } from "react";

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

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Management</h2>
      <button onClick={() => openModal()} style={{ marginBottom: "10px" }}>
        Add User
      </button>

      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", marginTop: "10px" }}>
        <thead>
          <tr>
            <th></th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr><td colSpan="6" style={{ textAlign: "center" }}>No users added.</td></tr>
          ) : (
            users.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.department}</td>
                <td>
                  <button onClick={() => openModal(user, index)}>Edit</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showModal && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h3>{editingIndex !== null ? "Edit User" : "Add User"}</h3>
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
              <button type="submit">{editingIndex !== null ? "Update" : "Add"}</button>
              <button type="button" onClick={() => setShowModal(false)} style={{ marginLeft: "10px" }}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const modalStyle = {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  width: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};
