import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LicenseList = () => {
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/licenseS/')
      .then(response => setLicenses(response.data))
      .catch(error => console.error('Error:', error));
  }, []);

  const handleView = (id) => {
    alert(`Viewing details for license: ${id}`);
  };

  return (
    <div style={{ padding: '0', margin: '0' }}>
      <div style={{ overflowY: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'lightgray' , color: 'black'}}>
              <th style={styles.th}></th>
              <th style={styles.th}>Holder</th>
              <th style={styles.th}>Vendor</th>
              <th style={styles.th}>Due Date</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license, index) => (
              <tr key={index}   style={{
                backgroundColor: index % 1 === 0 ? 'white' : 'lightgray',}}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{license.owner}</td>
                <td style={styles.td}>{license.providers}</td>
                <td style={styles.td}>{license.expiry_date}</td>
                <td style={styles.td}>{license.subscription_type}</td>
                <td style={styles.td}>
                  <button onClick={() => handleView(license.id)} style={styles.viewButton}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>
        {
          `
          @media screen and (max-width: 600px) {
            th, td {
              font-size: 0.6rem;
              padding: 6px;
            }

            .viewButton {
              font-size: 0.6rem;
              width: 70px;
            }
          }
          `
        }
      </style>
    </div>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '20px 0',
  },
  headerRow: {
    backgroundColor: 'lightgray',
    color: 'black',
  },
  th: {
    padding: '8px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    fontSize: '1rem',
  },
  td: {
    borderRight: '1px solid #ddd',
    padding: '8px',
    borderBottom: '1px solid #ddd',
    fontSize: '0.9rem',
  },
  oddRow: {
    backgroundColor: '#f9f9f9',
  },
  evenRow: {
    backgroundColor: '#fff',
  },
  viewButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    width: '90px',
  },
};

export default LicenseList;

