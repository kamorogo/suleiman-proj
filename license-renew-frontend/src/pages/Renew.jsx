import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Renew = () => {
  const [license, setLicense] = useState(null);
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const [document, setDocument] = useState(null);
  const [subscriptionType, setSubscriptionType] = useState("");
  const [provider, setProvider] = useState("");
  const [renewalHistory, setRenewalHistory] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    if (!id) return;
  
    axios.get(`http://127.0.0.1:8000/licenseS/${id}/`).then((res) => {
      const data = res.data;
      setLicense(data);
      setSubscriptionType(data.subscription_type || "");
      setProvider(data.provider || "");
      setRenewalHistory(Array.isArray(data.renewal_history) ? data.renewal_history : []);
    });
  }, [id]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("new_expiry_date", newExpiryDate);
    formData.append("renewal_document", document);
    formData.append("subscription_type", subscriptionType);
    formData.append("provider", provider);

    try {
      await axios.post(
        `http://127.0.0.1:8000/licenseS/${id}/renew/`,
        formData
      );
      alert("License renewed successfully!");
    } catch (error) {
      console.error(error);
      alert("Renewal failed.");
    }
  };

  if (!license) return <div>Loading...</div>;

  return (
    <div className="renew-form-container">
      
      <div className="license-info">
        <div><strong>Associated User:</strong> {license.users?.first_name} {license.users?.last_name}</div>
        <div><strong>Current Expiry Date:</strong> {license.expiry_date}</div>
        <div><strong>Provider:</strong> {license.providers}</div>
        <div><strong>Subscription Type:</strong> {license.subscription_type}</div>
        <div><strong>Status:</strong> {license.status}</div>
      </div>

      <h2>Renew License</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>New Expiry Date</label>
          <input
            type="date"
            className="input"
            onChange={(e) => setNewExpiryDate(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Upload Receipt</label> &nbsp;
          <input
            type="file"
            onChange={(e) => setDocument(e.target.files[0])}
            required
          />
        </div>
        <div className="form-group">
          <label>Provider</label>
          <input
            className="input"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Subscription Type</label>
          <select
            className="input"
            value={subscriptionType}
            onChange={(e) => setSubscriptionType(e.target.value)}
          >
            <option value="0">Trial</option>
            <option value="1">Monthly</option>
            <option value="3">Quarterly</option>
            <option value="6">Semi-Annual</option>
            <option value="12">Annual</option>
            <option value="24">Biennial</option>
            <option value="36">Triennial</option>
            <option value="48">Quadrennial</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>

      <div className="renewal-history">
        <h2>Renewal History</h2>
        <table className="history-table">
          <thead>
            <tr>
              <th>Old Expiry Date</th>
              <th>New Expiry Date</th>
              <th>Renewal Date</th>
              <th>Renewed By</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {renewalHistory.map((history, index) => (
              <tr key={index}>
                <td>{history.old_expiry_date}</td>
                <td>{history.new_expiry_date}</td>
                <td>{history.renewal_date}</td>
                <td>{history.renewed_by}</td>
                <td>{history.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>
        {`
        /* Container */
.renew-form-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Title */
.renew-form-container h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
}

/* License Information */
.license-info {
  margin-bottom: 1.5rem;
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
}

.license-info div {
  margin-bottom: 0.8rem;
}

/* Form */
.form-group {
  margin-bottom: 1.2rem;
}

.input {
  width: 100%;
  padding: 0.6rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
}

.input:focus {
  border-color: #3b82f6;
  outline: none;
}

textarea.input {
  min-height: 100px;
}

.btn {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #2563eb;
}

/* Renewal History */
.renewal-history {
  margin-top: 2rem;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.history-table th, .history-table td {
  padding: 1rem;
  border: 1px solid #ddd;
  text-align: left;
}

.history-table th {
  background-color: #f2f2f2;
}

.history-table tr:nth-child(even) {
  background-color: #f9f9f9;
}
`}
      </style>
    </div>
  );
};

export default Renew;
