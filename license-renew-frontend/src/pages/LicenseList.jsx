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
    <div style={{ padding: '0' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: 'lightgray' , color: '#0a51cc'}}>
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
                backgroundColor: index % 2 === 0 ? 'white' : 'lightgray',}}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{license.holder}</td>
                <td style={styles.td}>{license.issuing_authority}</td>
                <td style={styles.td}>{license.expiry_date}</td>
                <td style={styles.td}>{license.type_license}</td>
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
    </div>
  );
};

const styles = {
  th: {
    padding: '10px',
    textAlign: 'left',
    borderBottom: '1px solid #ddd',
    borderRight: '0.5px solid #ddd',
  },
  td: {
    borderRight: '1px solid #ddd',
    padding: '5px',
    borderBottom: '1px solid #ddd'
  },
  tr: {
    backgroundColor: '#fff'
  },
  viewButton: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer'
  }
};

export default LicenseList;














// const handleDelete = async (license_number) => {
//   if (!window.confirm('Are you sure you want to delete...')) return;

//   try {
//     await axios.delete(`http://localhost:8000/delete-license/${license_number}/`);
//     // setLicenses  
//     console.log('License deleted successfully..!')
//   } catch (error) {
//     console.error('Error deleting license:', error);
//   }
// };