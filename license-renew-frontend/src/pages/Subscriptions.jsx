import { useState } from 'react';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    authority: '',
    expiry: '',
    type: '',
    amount: '',
    reference: '',
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openModal = (sub = null, index = null) => {
    if (sub) {
      setForm(sub);
      setEditIndex(index);
    } else {
      setForm({
        name: '',
        authority: '',
        expiry: '',
        type: '',
        amount: '',
        reference: '',
      });
      setEditIndex(null);
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const updated = [...subscriptions];
      updated[editIndex] = form;
      setSubscriptions(updated);
    } else {
      setSubscriptions([...subscriptions, form]);
    }
    setShowModal(false);
    setForm({
      name: '',
      authority: '',
      expiry: '',
      type: '',
      amount: '',
      reference: '',
    });
    setEditIndex(null);
  };

  const handleDelete = (index) => {
    const updated = [...subscriptions];
    updated.splice(index, 1);
    setSubscriptions(updated);
  };

  return (
    <div className="subscriptions-page">
      <h1></h1>
      <div className="add-btn-container">
        <button className="add-btn" onClick={() => openModal()}>
          + Add Subscription
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editIndex !== null ? 'Edit' : 'Add'} Subscription</h2>
            <form onSubmit={handleSubmit}>
              <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
              <input name="authority" placeholder="Issuing Authority" value={form.authority} onChange={handleChange} required />
              <input type="date" name="expiry" value={form.expiry} onChange={handleChange} required />
              <input name="type" placeholder="Subscription Type" value={form.type} onChange={handleChange} required />
              <input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
              <input name="reference" placeholder="Reference Number" value={form.reference} onChange={handleChange} required />
              <div className="modal-actions">
                <button type="submit">{editIndex !== null ? 'Update' : 'Save'}</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="subscription-list">
        {subscriptions.map((sub, index) => (
          <div key={index} className="subscription-card">
            <div className="card-details">
              <h3>{sub.name}</h3>
              <p><strong>Authority:</strong> {sub.authority}</p>
              <p><strong>Expiry:</strong> {sub.expiry}</p>
              <p><strong>Type:</strong> {sub.type}</p>
              <p><strong>Amount:</strong> ${sub.amount}</p>
              <p><strong>Ref:</strong> {sub.reference}</p>
            </div>
            <div className="card-actions">
              <button onClick={() => openModal(sub, index)}>Edit</button>
              <button onClick={() => handleDelete(index)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .subscriptions-page {
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

        .subscription-list {
          display: grid;
          gap: 1rem;
        }

        .subscription-card {
          background: #fff;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: start;
        }

        .card-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card-actions button {
          padding: 6px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }

        .card-actions button:first-child {
          background-color: #0066cc;
          color: white;
        }

        .delete-btn {
          background-color: #cc0000;
          color: white;
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
        }
      `}</style>
    </div>
  );
}
