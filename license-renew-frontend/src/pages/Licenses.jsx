import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import './Licenses.css'
import axios from "axios";

const Licenses = () => {
  const [licenses, setLicenses] = useState([]);
  const [activeSection, setActiveSection] = useState('upload');
  const [upload, setUpload] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [licenseData, setLicenseData] = useState({
      name: "",
      expiry_date: "",
      duration: "",
      license_key: "",
  });

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = () => {
    axios.get("http://localhost:8000/licenseS/")
      .then(response => setLicenses(response.data))
      .catch(error => console.error("Error fetching licenses:", error));
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

  const showContent = (section) => {
    console.log(`Section clicked: ${section}`);
    setActiveSection(section);
  };


  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      if(file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
        setError('');
        await handleUpload(file); 
      }
        else {
          setError("Please Upload a PDF file");
        }
    }
    
  };

  const handleUpload = async (file) => {
    setUpload(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload-license/", {
        method: 'POST',
        body: formData,
      }
      );
      if (response.status ===201) {
        setUploadedFile(response.data.file_url);
        alert("Uploaded successful");
      }
      else {
        setError("Failed to upload file");
      }
    }
    catch (error){
      setError("Error on uploading file");
    }
    finally {
      setUpload(false);
    }
  };


// ---UPDATE--- //
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/licenseS/${id}/`)
        .then((res) => setLicenseData(res.data))
        .catch((err) => console.error(err));
}, [id]);

const handleChange = (e) => {
    setLicenseData({ ...licenseData, [e.target.name]: e.target.value });
};

const handleDurationChange = (e) => {
  const months = parseInt(e.target.value, 10);
  if (!isNaN(months)) {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + months);
    setLicenseData({ 
      ...licenseData, 
      duration: months, 
      expiry_date: currentDate.toISOString().split("T")[0]
    });
  }
};

const handleSubmit = (e) => {
    e.preventDefault();
    axios.patch(`http://127.0.0.1:8000/license-update/${id}/`, licenseData)
        .then(() => {
            alert("License updated successfully!");
            navigate("/home");
        })
        .catch((err) => console.error(err));
};

  
  return (
    <div className="page">
        <div className="sidenav">
                <h1>Manage Licenses</h1>

               


                <button onClick={() => showContent('upload')}>
                  UPLOAD
                </button>   

                <button onClick={() => showContent('delete')}>
                  DELETE
                </button>

                <button onClick={() => showContent('add')}>
                  ADD
                </button>

                <button onClick={() => showContent('update')}>
                  EDIT
                </button>
  
        </div>
        <div className="MAIN">
          
          {/* --UPLOAD-- */}
          {activeSection === 'upload' && (
            <div className="file-upload-container">
              <label htmlFor="dropzone-file" className="file-upload-label">
                  <div className="file-upload-content">
                      <svg className="upload-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                      </svg>
                      <p className="upload-text"><span className="upload-bold">Click to upload</span> or drag and drop</p>
                      <p className="upload-info">PDF (MAX. 10MB)</p>
                  </div>
                  <input  
                    id="dropzone-file"
                    type="file" 
                    className="file-input"
                    onChange={handleFileChange}  
                  />
              </label>
             
            </div>
          )}

          {/* --DELETE-- */}
          {activeSection === 'delete' && (
            <div style={{ marginTop: "20px", height: "75vh", display: "flex", flexDirection: "column", padding: "0" }}>
              <div style={{ flex: 1, overflowY: "auto", border: "1px solid #ddd" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ backgroundColor: "lightgray", color: "#0a51cc", borderBottom: "1px solid black" }}>
                      <th style={styles.th}></th>
                      <th style={styles.th}>Holder</th>
                      <th style={styles.th}>Vendor</th>
                      <th style={{ ...styles.th, width: "200px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {licenses.map((license, index) => (
                      <tr key={license.id} style={{ backgroundColor: "white", borderBottom: "1px solid black" }}>
                        <td style={styles.td}>{index + 1}</td>
                        <td style={{ ...styles.td, width: "200px" }}>{license.owner}</td>
                        <td style={styles.td}>{license.provider}</td>
                        <td style={{ ...styles.td, textAlign: "right", paddingRight: "20px" }}>
                          <span style={styles.buttonSpacer}></span>
                          <button onClick={() => handleDelete(license.id)} style={styles.deleteButton}>Delete</button>
                          <span style={styles.buttonSpacer}></span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* --ADD-- */}
          {activeSection === 'add' && (
          <div className="add">
              <div className="applicationF">
                  <form>
                      <label>Full Name: <span>*</span></label>
                      <input type="text" id="fullName" className="Fcontrol" />
          
                      <label>Email: <span>*</span></label>
                      <input type="email" id="email" className="Fcontrol" />
          
                      <label>Phone: <span>*</span></label>
                      <input type="telephone" id="phone" className="Fcontrol" />
          
          
                      <label>Provider: <span>*</span></label>
                      <input type="text" id="issuingAuthority" className="Fcontrol" />
          
                      <label>Amount: <span>*</span></label>
                      <input type="number" id="amount" className="Fcontrol" min="0" step="any" />
          
                      <label>Expiration Date: <span>*</span></label>
                      <input type="date" id="expiryDate" className="Fcontrol" />

                      <input type="file" id="license" className="custom-file-input" />
                      
                      <button-R type="add" className="button-R">
                          Add
                      </button-R>
                  </form>
              </div>
          </div>
          )}

          {/* --UPDATE-- */}
          {activeSection === "update" && (
          <div className="update-container">
            <form onSubmit={handleSubmit} className="update-form">
              <label>License Type:</label>
              <input
                type="text"
                name="licensetype"
                value={licenseData.licensetype || ""}
                onChange={handleChange}
                className="update-input"
                required
              />

              <label>Provider:</label>
              <select
                name="provider"
                value={licenseData.provider || ""}
                onChange={handleChange}
                className="update-input"
                required
              >
                <option value="">Select Provider</option>
                {["Safaricom", "Airtel", "Telkom", "Microsoft", "Google", "Amazon", "Meta", "Apple", "Vodacom"].map((provider) => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </select>


              <label>Duration:</label>
                <select
                  name="duration"
                  value={licenseData.duration}
                  onChange={handleDurationChange}
                  className="update-input"
                  required
                >
                  <option value="">Select Duration</option>
                  {[...Array(100)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} Months
                    </option>
                  ))}
              </select>

              <label>Expiry Date:</label>
              <input
                type="date"
                name="expiry_date"
                value={licenseData.expiry_date || ""}
                onChange={handleChange}
                className="update-input"
                required
                readOnly
              />

              <button type="submit" className="update-button">Update</button>
            </form>
          </div>
        )}
        </div>
    </div>
  );
};

/* --DELETE-- */
const styles = {
  container: {
    height: "70vh",
    display: "flex",
    flexDirection: "column",
    padding: "0",
  },
  scrollWrapper: {
    flex: 1,
    overflowY: "auto",
    border: "1px solid #ddd",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    padding: "2px",
    textAlign: "left",
    borderBottom: "1px solid black",
    backgroundColor: "lightgray",
    color: "black",
    fontSize: "14px",
    marginLeft: "70px",
  },
  td: {
    padding: "4px",
    borderBottom: "1px solid black",
    fontSize: "13px",
  },
  actionTd: {
    textAlign: "right",
    paddingRight: "15px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    padding: "4px 8px", 
    width: "100px",      
    display: "block",    
    margin: "0 auto",
  }
};


export default Licenses;

