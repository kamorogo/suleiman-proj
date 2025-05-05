import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function RenewalsPage() {
  const [expiredSubscriptions, setExpiredSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/subscriptions/?status=expired')
      .then(res => setExpiredSubscriptions(res.data))
      .catch(err => console.error('Error fetching expired subscriptions:', err));
  }, []);

  const handleRenewClick = (subscription) => {
    setSelectedSubscription(subscription);
    setShowModal(true);
  };

  const handleProceed = () => {
    navigate(`/payment/${selectedSubscription.id}`);
  };

  return (
    <div className="renewals-page">
      <h2>Expired Subscriptions</h2>
      <table className="renewals-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Provider</th>
            <th>Department</th>
            <th>Expired On</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expiredSubscriptions.map(sub => (
            <tr key={sub.id}>
              <td>{sub.name}</td>
              <td>{sub.provider}</td>
              <td>{sub.department}</td>
              <td>{sub.expiry_date}</td>
              <td><button className="renew-btn" onClick={() => handleRenewClick(sub)}>Renew</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedSubscription && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Renew Subscription</h3>
            <p><strong>Name:</strong> {selectedSubscription.name}</p>
            <p><strong>Provider:</strong> {selectedSubscription.provider}</p>
            <p><strong>Department:</strong> {selectedSubscription.department}</p>
            <p><strong>Expired On:</strong> {selectedSubscription.expiry_date}</p>
            <div className="modal-actions">
              <button className="proceed-btn" onClick={handleProceed}>Proceed</button>
              <button className="decline-btn" onClick={() => setShowModal(false)}>Decline</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .renewals-page {
           background: white;
        padding: 24px;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);4
        }
        h2 {
        font-weight: 400;
        }
        .renewals-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        .renewals-table th,
        .renewals-table td {
          border: 1px solid #ccc;
          padding: 10px;
          text-align: left;
          font-weight: 350;
        }
        .renew-btn {
          padding: 6px 12px;
          background-color: #003366;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal {
          background: white;
          padding: 24px;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 0 10px rgba(0,0,0,0.25);
        }
        .modal-actions {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .proceed-btn {
          background-color: green;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
        }
        .decline-btn {
          background-color: #aaa;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
