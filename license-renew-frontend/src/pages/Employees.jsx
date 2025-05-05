import { useState, useEffect } from 'react';
import axios from 'axios';

export default function EmployeeManager() {
  const [employees, setEmployees] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(null);
  const [employeeForm, setEmployeeForm] = useState({
    firstName: '',
    lastName: '',
    department: '',
    email: ''
  });
  const [actionMenuIndex, setActionMenuIndex] = useState(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/employees/')
      .then(response => setEmployees(response.data))
      .catch(error => console.error("Error fetching employees:", error));

    axios.get('http://127.0.0.1:8000/api/subscriptions/')
      .then(response => setSubscriptions(response.data))
      .catch(error => console.error("Error fetching subscriptions:", error));
  }, []);

  const handleEmployeeChange = (e) => {
    setEmployeeForm({ ...employeeForm, [e.target.name]: e.target.value });
  };

  const addEmployee = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/employees/', employeeForm)
      .then(response => {
        setEmployees([...employees, response.data]);
        setEmployeeForm({ firstName: '', lastName: '', department: '', email: '' });
        setShowEmployeeModal(false);
      })
      .catch(error => console.error("Error adding employee:", error));
  };

  const assignSubscription = (sub) => {
    const updated = [...employees];
    const emp = updated[currentEmployeeIndex];

    if (!emp.assigned?.find(s => s.id === sub.id)) {
      emp.assigned = emp.assigned || [];
      emp.assigned.push(sub);
      setEmployees(updated);

      axios.post(`http://127.0.0.1:8000/api/employees/${emp.id}/assign_subscription/`, {
        subscription_id: sub.id
      }).catch(error => console.error("Error assigning subscription:", error));
    }

    setShowAssignModal(false);
  };

  return (
    <div className={`employee-page ${showEmployeeModal || showAssignModal ? 'dimmed' : ''}`}>
      <div className="header">
        <h2>Employees</h2>
        <button className="add-btn" onClick={() => setShowEmployeeModal(true)}>+ Add Employee</button>
      </div>

      {showEmployeeModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Employee</h3>
            <form onSubmit={addEmployee}>
              <input name="firstName" value={employeeForm.firstName} onChange={handleEmployeeChange} placeholder="First Name" required />
              <input name="lastName" value={employeeForm.lastName} onChange={handleEmployeeChange} placeholder="Last Name" required />
              <input name="department" value={employeeForm.department} onChange={handleEmployeeChange} placeholder="Department" required />
              <input name="email" type="email" value={employeeForm.email} onChange={handleEmployeeChange} placeholder="Email" required />
              <div className="modal-actions">
                <button type="submit">Add</button>
                <button type="button" onClick={() => setShowEmployeeModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Assign Subscription</h3>
            {subscriptions.map(sub => (
              <button key={sub.id} onClick={() => assignSubscription(sub)}>{sub.name}</button>
            ))}
            <button onClick={() => setShowAssignModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      <div className="employee-list">
        {employees.map((emp, index) => (
          <div key={emp.id} className="employee-card">
            <div>
              <h4>{emp.firstName} {emp.lastName}</h4>
              <p><strong>Department:</strong> {emp.department}</p>
              <p><strong>Email:</strong> {emp.email}</p>
              <p><strong>Subscriptions:</strong> {emp.assigned?.map(s => s.name).join(', ') || 'None'}</p>
            </div>
            <div className="actions">
              <button onClick={() => {
                setCurrentEmployeeIndex(index);
                setShowAssignModal(true);
              }}>+ Assign</button>
              <div className="dots" onClick={() => setActionMenuIndex(index)}>
                ⋯
                {actionMenuIndex === index && (
                  <div className="popup-menu">
                    <button onClick={() => alert('Edit logic')}>Edit</button>
                    <button onClick={() => alert('Delete logic')}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
            html, body, #root {
        margin: 0;
        padding: 0;
        height: 100%;
         background-color: hsl(214.3 94.6% 92.7%); 
        }
        
        // .employee-page {
        //   padding: 0;
        // }
        .dimmed {
          background-color: rgba(0,0,0,0.2);
        }
           h2 {
        font-weight: 400;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .add-btn {
          background-color: hsl(224.4, 64.3%, 32.9%);
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
           overflow: hidden;
        }
        .employee-list {
          display: grid;
          gap: 1rem;
        }
        .employee-card {
          background: #fff;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
          display: flex;
          justify-content: space-between;
          align-items: center;
          position: relative;
           overflow: hidden;
        }
        .actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .employee-card button {
          background: #003366;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          cursor: pointer;
          margin-bottom: 8px;
        }
        .dots {
          font-size: 24px;
          cursor: pointer;
          position: relative;
        }
        .popup-menu {
          position: absolute;
          top: 30px;
          right: 0;
          background: white;
          border: 1px solid #ccc;
          border-radius: 4px;
          z-index: 5;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
           overflow: hidden;
        }
        .popup-menu button {
          display: block;
          width: 100%;
          padding: 8px 12px;
          background: white;
          border: none;
          text-align: left;
          cursor: pointer;
        }
        .popup-menu button:hover {
          background: #f0f0f0;
        }
        .modal-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }
        .modal {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.08);
        }
        .modal input {
          width: 100%;
          padding: 10px;
          margin-bottom: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .modal-actions {
          display: flex;
          justify-content: space-between;
        }
        .modal-actions button {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .modal-actions button:first-child {
          background: #003366;
          color: white;
        }
      `}</style>
    </div>
  );
}
