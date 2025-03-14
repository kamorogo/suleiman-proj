import React, { useState, useEffect } from "react";
import axios from "axios";

const LicenseForm = () => {
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/licenseS/")
      .then(response => setLicenses(response.data))
      .catch(error => console.error("Error fetching licenses:", error));
  }, []);

  const handleEdit = (license) => {
    alert(`Editing license for ${license.id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete your license?`)) return;
    try {
      await axios.delete(`http://localhost:8000/license-delete/${id}/`);
      setLicenses(licenses.filter(l => l.id !== id));
    } catch (error) {
      console.error("Error deleting license:", error);
    }
  };

  const handleRetrieve = (license) => {
    alert(`Retrieving data for ${license.id}`);
  };

  return (
    <div style={{ padding: "0" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "lightgray", color: "#0a51cc", borderBottom: "1px solid black" }}>
              <th style={styles.th}></th>
              <th style={styles.th}>Holder</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Vendor</th>
              <th style={{ ...styles.th, width: "300px" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license, index) => (
              <tr key={license.id} style={{ backgroundColor: "white", borderBottom: "1px solid black" }}>
                <td style={styles.td}>{index + 1}</td>
                <td style={{ ...styles.td, width: "400px" }}>{license.owner}</td>
                <td style={styles.td}>
                  <span style={{
                    padding: "3px 8px",
                    borderRadius: "5px",
                    color: "white",
                    backgroundColor: license.renew_status === "Completed" ? "green" : "red",
                  }}>
                    {license.renew_status}
                  </span>
                </td>
                <td style={styles.td}>{license.issuing_authority}</td>
                <td style={{ ...styles.td, textAlign: "right", paddingRight: "20px" }}>
                  <button onClick={() => handleEdit(license)} style={styles.editButton}>Edit</button>
                  <span style={styles.buttonSpacer}></span>
                  <button onClick={() => handleDelete(license)} style={styles.deleteButton}>Delete</button>
                  <span style={styles.buttonSpacer}></span>
                  <button onClick={() => handleRetrieve(license)} style={styles.retrieveButton}>Retrieve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  th: {
    padding: "15px",
    textAlign: "left",
    borderBottom: "1px solid black",
    borderRight: '0.5px solid black',
  },
  td: {
    padding: "8px",
    borderBottom: "1px solid black",
    borderRight: '0.4px solid black',
  },
  editButton: {
    padding: "5px 10px",
    backgroundColor: "#ffc107",
    color: "black",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  },
  deleteButton: {
    padding: "5px 10px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  },
  retrieveButton: {
    padding: "5px 10px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "3px",
    cursor: "pointer"
  },
  buttonSpacer: {
    display: "inline-block",
    width: "15px"
  }
};

export default LicenseForm;








