import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Licenses = () => {
  const [licenses, setLicenses] = useState([]);
  const [activeSection, setActiveSection] = useState('upload');
  const [upload, setUpload] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const navigate = useNavigate();
  // --state for Add 
  const [formData, setFormData] = useState({
    subscription_type: "",
    service_provider: "",
    amount_paid: "",
    duration: "",
    issue_date: "",
    expiry_date: "",
});
  const [file, setFile] = useState(null);
  
  // --state for Edit form data
  const { id } = useParams();
  const [licenseData, setLicenseData] = useState({
      licensetype: "",
      provider: "",
      duration: "",
  });
  




  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = async () => {
    try {
      const response = await fetch("http://localhost:8000/licenseS/");
      const data = await response.json();
      console.log("Fetched data:", data); 
      setLicenses(data);
    } catch (error) {
      console.error("Error fetching licenses:", error);
    }
  };

  const showContent = (section) => {
    console.log(`Section clicked: ${section}`);
    setActiveSection(section);
  };

// // ---UPLOAD--- //
//   const handleFileChange = async (event) => {
//     const selectedFile = event.target.files[0];
//     setFile(selectedFile);

//     if (selectedFile) {
//       // Validate file type and size
//       if (selectedFile.type === 'application/pdf' && selectedFile.size <= 10 * 1024 * 1024) {
//         setError('');
//         await handleUpload(selectedFile);
//       } else {
//         setError("Please Upload a PDF file (Max 10MB)");
//       }
//     }
//   };

//   const handleUpload = async (file) => {
//     setUpload(true);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       const response = await fetch("http://127.0.0.1:8000/upload-license/", {
//         method: 'POST',
//         body: formData,
//       });

//       if (response.ok) {

//         const data = await response.json();
//         setUploadedFile(data.file_url); 
//         alert("Uploaded successfully");

//         setFile(null);
//         setError('');
//         setUploadedFile(null);
//         fetchLicenses();
//       } else {
//         setError("Failed to upload file");
//       }
//     } catch (error) {
//       setError("Error on uploading file");
//     } finally {
//       setUpload(false);
//     }
//   };

  // ----DELETE---- //
  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete your license?`)) return;
    try {
      await axios.delete(`http://localhost:8000/license-delete/${id}/`);
      setLicenses(licenses.filter(l => l.id !== id));
      fetchLicenses();
    } catch (error) {
      console.error("Error deleting license:", error);
    }
  };


   // ---ADD--- //
   const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleFileChanges = (e) => {
    setFile(e.target.files[0]);
};

const handleUpload = async () => {
    if (!file) {
        alert("Please select a file first!");
        return;
    }

    const data = new FormData();
    data.append("document", file);

    try {
        const response = await axios.post("http://127.0.0.1:8000/api/license/extract/", data);
        
        // Update form fields with extracted data
        setFormData({
            subscription_type: response.data.subscription_type || "",
            service_provider: response.data.service_provider || "",
            amount_paid: response.data.amount_paid || "",
            duration: response.data.duration || "",
            issue_date: response.data.issue_date || "",
            expiry_date: response.data.expiry_date || "",
        });

        alert("Text extracted and form pre-filled!");
    } catch (error) {
        console.error("Error extracting text:", error);
        alert("Failed to extract text");
    }
};

const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
    });
    if (file) {
        data.append("document", file);
    }

    try {
        await axios.post("http://127.0.0.1:8000/api/license-add/", data);
        alert("License Created Successfully!");
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to create license");
    }
};
  

// ---UPDATE/EDIT--- //
useEffect(() => {
  const fetchLicenses = async () => {
    try {
      const response = await fetch(`http://localhost:8000/licenseS/${id}`);
      const data = await response.json();
      console.log("Fetched data:", data); 
      setLicenses(data);
    } catch (error) {
      console.error("Error fetching licenses:", error);
    }
  };

  if (id) fetchLicenses();
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

const handleEditSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.put(`http://127.0.0.1:8000/license-update/${id}/`, licenseData);
    alert("License updated successfully");
    fetchLicenses();
  } catch (error) {
    console.error("Error updating license:", error);
  }
};
  
  return (
    <div className="page">
      
      <a href="/" class="previous round">&#8249;</a>

        <div className="sidenav">
               

                <button onClick={() => showContent('upload')}>
                  UPLOAD
                </button>   

                <button onClick={() => showContent('delete')}>
                  DELETE
                </button>

                <button onClick={() => showContent('create')}>
                  CREATE
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
                    onChange={handleFileChanges}  
                  />

                {/* Display uploaded file inside the same container */}
                  {file && (
                    <div className="uploaded-file-preview">
                      <p>Uploaded File: {file.name}</p>
                      {/* Display a PDF preview if it's a PDF */}
                      {file.type === 'application/pdf' ? (
                        <embed
                          src={URL.createObjectURL(file)}
                          type="application/pdf"
                          width="20%"
                          height="100"
                        />
                      ) : (
                        <p>File preview not available. Only PDF files are supported.</p>
                      )}
                    </div>
                )}
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
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Provider</th>
                      <th style={styles.th}>Duration</th>
                      <th style={{ ...styles.th, width: "200px" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {licenses.map((license, index) => (
                      <tr key={license.id} style={{ backgroundColor: "white", borderBottom: "1px solid black" }}>
                        <td style={styles.td}>{index + 1}</td>
                        <td style={{ ...styles.td, width: "100px"}}>{license.subscription_type}</td>
                        <td style={styles.td}>{license.providers}</td>
                        <td style={styles.td}>{license.duration}</td>
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
          {activeSection === 'create' && (
            <div className="create">
              <form onSubmit={handleSubmit} className="applicationF">
                
                <input type="file" onChange={handleFileChanges} />
                <button type="button" onClick={handleUpload}>Extract Data</button>

                <label>Subcription Type: </label>
                <input type="text" name="subscription_type" value={formData.subscription_type} onChange={handleChanges} placeholder="Subscription Type" />
                
                <label>Service Provider: </label>
                <select type="text" name="service_provider" value={formData.service_provider} onChange={handleChanges} placeholder="Service Provider" >
                    <option value="">Select Provider</option>
                      {["Safaricom", "Airtel", "Telkom", "Microsoft", "Google", "Amazon", "Meta", "Apple", "Vodacom"].map((provider) => (
                        <option key={provider} value={provider}>
                          {provider}
                        </option>
                      ))}
                </select>
                
                <label>Amount: </label>
                <input type="number" name="amount_paid" value={formData.amount_paid} onChange={handleChanges} placeholder="Amount Paid" />
                
                <label>Duration: <span>*</span></label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChanges} placeholder="Duration (Months)" />
                
                <label>Issued On: </label>
                <input type="date" name="issue_date" value={formData.issue_date} onChange={handleChanges} />
                
                <label>Expires On: </label>
                <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChanges} />

                <button type="submit">Submit</button>
              
              </form>
            </div>
          )}

          {/* --UPDATE/EDIT-- */}
              {/* {activeSection === "update" && (
              <div className="update-container">
                <form onSubmit={handleEditSubmit} className="update-form">
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
                    {["Safaricom", "Airtel", "Telkom", "IBM","Microsoft", "Google", "Amazon", "Meta", "Apple", "Vodacom"].map((provider) => (
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
            )} */}
        </div>
      <style jsx >
        {
          `
          .page  {
              border: 5px solid grey;
              margin: 10px;  
              padding: 5px;
              position: relative;
          }
          .previous {
              color: black;
              position: absolute;
              bottom: 10px;
              left: 10px;
              padding: 10px 14px;
              font-size: 18px;
              border-radius: 50%;
              text-align: center;
              font-weight: bold;
              transition: 0.3s;
          }
          .sidenav {
              margin-top: 20px; 
              padding: 20px;
              width: 250px;
              min-height: 60vh;
              position: absolute;
              left: 10px;
              top: 50px;
              max-width: 30%;
              left: 2%;
              margin-left: 0;
          }
          .sidenav h1 {
              font-weight: normal;
              font-size: 14px;
              text-align: center;
          }
          .sidenav a {
              padding: 6px 8px 6px 16px;
              text-decoration: none;
              font-size: 14px;
              font-weight: 600;
              color: black;
              display: grid;
          }
          .sidenav a:hover {
              color: #064579;
          }
          button {
              border: none;
              background: #FFF;
              border: 1px solid rgba(27, 31, 35, 0.15);
              border-radius: 6px;
              padding: 5px 10px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              cursor: pointer;
              margin-bottom: 30px;  
              width: 150px;
              margin-right: 10px;
              margin-left: 30%;
          }
          buttonB {
              border: none;
              background: #FFF;
              border: 1px solid rgba(27, 31, 35, 0.15);
              border-radius: 6px;
              padding: 5px 10px;
              text-align: center;
              text-decoration: none;
              display: inline-block;
              font-size: 16px;
              cursor: pointer;
              margin-bottom: 30px;  
              width: 150px;
              margin-right: 10px;
              margin-left: 30%;

          }
          .MAIN {
              margin-left: 600px; 
              font-size: 28px; 
              padding: 0px 10px;
              height: 82vh;
              margin-top: 5%;
              margin-right: 10%;
          }
          /* --UPLOAD-- */
          .file-upload-container {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 95%;
              width: 100%;
              padding: 20px;
              box-sizing: border-box;
          }

          .file-upload-label {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              border: 2px dashed #ccc;
              border-radius: 15px;
              cursor: pointer;
              text-align: center;
          }

          .file-upload-content {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 10px;
          }

          .upload-icon {
              width: 50px;
              height: 50px;
              color: #555;
          }

          .upload-text {
              font-size: 18px;
          }

          .upload-bold {
              font-weight: bold;
          }

          .upload-info {
              font-size: 14px;
              color: gray;
          }

          .file-input {
              display: none;
          }

          /* --ADD-- */
          .create {
              margin-left: 3%;
              margin-right: 10%;
              font-size: 14px;
              padding: 20px;
              height: 70vh;
              margin-top: 5%;
              background-color: #f9f9f9;
              border-radius: 10px;
              box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              display: flex;
              justify-content: start;
              align-items: flex-start;
              flex-direction: column;
              overflow-y: auto;
          }

          .applicationF {
              display: flex;
              flex-direction: column;
              gap: 15px;
              width: 100%;
              max-width: 600px;
          }

          .applicationF input[type="file"] {
              padding: 10px;
              font-size: 14px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #fff;
              cursor: pointer;
          }

          .applicationF input[type="text"],
          .applicationF input[type="number"],
          .applicationF input[type="date"] {
              padding: 10px;
              font-size: 14px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #fff;
              width: 100%;
              max-width: 400px;
          }

          .applicationF input[type="text"]:focus,
          .applicationF input[type="number"]:focus,
          .applicationF input[type="date"]:focus {
              border-color: #5b9bd5;
              outline: none;
          }

          .applicationF button {
              border: none;
              background-color: #286aa7;
              color: white;
              border-radius: 5px;
              padding: 10px 20px;
              font-size: 16px;
              cursor: pointer;
              width: 150px;
              margin-top: 20px;
          }

          .applicationF button:hover {
              background-color: #5b9bd5;
          }

          .applicationF button[type="button"] {
              background-color: #f39c12;
              margin-bottom: 20px;
          }

          .applicationF button[type="button"]:hover {
              background-color: #e67e22;
          }



          /* --UPDATE-- */
          update-container {
              width: 100%;
              max-width: 600px;
              background: #f9f9f9;
              padding: 20px;
              border-radius: 1px;
              box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
            }
            
            .update-form {
              display: flex;
              flex-direction: column;
              padding: 10px;
              margin: 8px 0;
              width: 100%;
              max-width: 500px;
              font-size: 14px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
            
            label {
              margin-bottom: 10px;
            }
            
            .update-input {
              width: 90%;
              padding: 10px;
              border: 1px solid #ccc;
              border-radius: 5px;
              margin-bottom: 10px;
            }
            .update-button {
              background: #0a51cc;
              color: white;
              padding: 10px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              margin-top: 10px;
            }
            .update-button:hover {
              background: #083b99;
            }
            
          /* Laptops and smaller desktops (1200px and below) */
          @media screen and (max-width: 1200px) {
              .sidenav {
                  width: 280px;
                  left: 1%;
              }
              .MAIN {
                  margin-left: 320px;
              }
          }

          /* Tablets (1024px and below) */
          @media screen and (max-width: 1024px) {
              .sidenav {
                  width: 250px;
                  left: 1%;
              }
              .MAIN {
                  margin-left: 270px;
              }
          }

          /* Mobile Phones (768px and below) */
          @media screen and (max-width: 768px) {
              .sidenav {
                  width: 100%;
                  position: relative;
                  height: auto;
                  left: 0;
                  margin-left: 0;
                  border-right: none;
                  border-bottom: 1px solid grey;
              }
              .MAIN {
                  margin-left: 0;
                  padding: 10px;
              }
          }

          /* Small Mobile Phones (480px and below) */
          @media screen and (max-width: 480px) {
              .sidenav {
                  text-align: center;
                  padding: 5px;
              }
          }

          `
        }
      </style>
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
    // textAlign: "left",
    borderBottom: "1px solid black",
    backgroundColor: "lightgray",
    color: "black",
    fontSize: "13px",
    marginLeft: "70px",
  },
  td: {
    padding: "4px",
    borderBottom: "1px solid black",
    fontSize: "12px",
    textAlign: "center",
  },
  actionTd: {
    // textAlign: "end",
    paddingRight: "5px",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "10px",
    padding: "4px 8px", 
    width: "50px",      
    display: "block",    
    margin: "0 auto",
    justifyContent: "end",
  }
};


export default Licenses;

