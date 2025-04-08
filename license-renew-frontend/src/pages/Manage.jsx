import React, { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axios from "axios";

const Manage = () => {
    const [licenses, setLicenses] = useState([]);
    const [filteredLicenses, setFilteredLicenses] = useState([]);
    const location = useLocation();
    const [licenseData, setLicenseData] = useState({});
    const [modalVisibility, setModalVisibility] = useState(false);
    const [loading, setLoading] = useState(false);
    const [id, setId] = useState("");
    const [users, setUsers] = useState(null);
    const queryParams = new URLSearchParams(location.search);
    const selectedProvider = queryParams.get("provider") || "";


    useEffect(() => {
       
        fetchLicenses();
    }, []);

    const fetchLicenses = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/licenseS/");
            const data = await response.json();
            console.log("Fetched data:", data);
            setLicenses(Array.isArray(data) ? data : []);

            if (selectedProvider) {
                setFilteredLicenses(data.filter(license => license.providers === selectedProvider));
            } else {
                setFilteredLicenses(data);
            }
        } catch (error) {
            console.error("Error fetching licenses:", error);
            setLicenses([]);
        }
    };

// ----EDIT---- //
    const handleEdit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("License updated data:", licenseData)
       
        const { document, users, ...updatedLicenseData } = licenseData;

        
        if (!document) {
            delete updatedLicenseData.document;
        }
    
       
        if (licenseData.users && licenseData.users.id) {
            updatedLicenseData.user = licenseData.users.id;  
        }

        try {
            const response = await axios.put(`http://127.0.0.1:8000/license-update/${id}/`,
            licenseData,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data', 
                }
            });
    
            if (response.status === 200) {
                alert("License updated successfully");
                fetchLicenses();
                setModalVisibility(false);
            } else {
                throw new Error ("Error Editing Subscription");
            }
        } catch (error) {
            console.error("Error updating license:", error);
            alert(`Error updating license: ${error.response ? error.response.data.detail : error.message}`)
        } finally {
            setLoading(false);
        }
    };
    const openEditModal = (license) => {
        setLicenseData(license);  
        setModalVisibility(true); 
        setId(license.id);
    };
    const closeEditModal = () => {
        setModalVisibility(false);
    };



// ----DOWNLOAD---- //
    const handleDownload = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/licenseS/download/${id}/`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to download the file");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `license_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };



    return (
        <div className="container">
            <div className="header">
            <h1>ABC Dashboard Renewal</h1> 
            </div>
            <div className="LOWER">
                <Link to="/create" className="add-button">ADD/CREATE</Link>
                    
                <i className="fa-solid fa-print print-icon" onClick={() => window.print()} />
            </div>
           
            <table className="license-table">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                {filteredLicenses.map((license, index) => (
                        <tr key={license.id}>
                            <td>{index + 1}</td>
                            <td>{license.users ? license.users.name : 'N/A'}</td>
                            <td>{license.users ? license.users.email : 'N/A'}</td>
                            <td>{license.subscription_type}</td>
                            <td>{license.providers}</td>
                            <td>{license.duration} months</td>
                            <td className="action-buttons">
                                <button onClick={() => openEditModal(license)} className="edit-button">EDIT</button>
                                <Link to={`/view-details/${license.id}`} className="view-button">VIEW</Link>
                                <button onClick={() => handleDownload(license.id)} className="download-button">DOWNLOAD</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

           {/* Edit Modal */}
           {modalVisibility && (
                <div className="modal">
                    <div className="modal-content">
                        <form onSubmit={handleEdit}>
                        <div>
                            <label>Provider</label>
                            <input
                                type="text"
                                value={licenseData.providers || ""}
                                onChange={(e) => setLicenseData({ ...licenseData, providers: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Subscription Type</label>
                            <input
                                type="text"
                                value={licenseData.subscription_type || ""}
                                onChange={(e) => setLicenseData({ ...licenseData, subscription_type: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Amount Paid</label>
                            <input
                                type="number"
                                value={licenseData.amount_paid || ""}
                                onChange={(e) => setLicenseData({ ...licenseData, amount_paid: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Duration (Months)</label>
                            <input
                                type="number"
                                value={licenseData.duration || ""}
                                onChange={(e) => setLicenseData({ ...licenseData, duration: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Issue Date</label>
                            <input
                                type="date"
                                value={licenseData.issue_date || ""}
                                onChange={(e) => setLicenseData({ ...licenseData, issue_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Expiry Date</label>
                            <input
                                type="date"
                                value={licenseData.expiry_date || ""}
                                onChange={(e) => setLicenseData({ ...licenseData, expiry_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Document</label>
                            <input
                                type="file"
                                onChange={(e) => setLicenseData({ ...licenseData, document: e.target.files[0] })}
                            />
                        </div>
                        <div className="BUTTONS">
                            <div className="Action-btns">
                                <button type="submit" disabled={loading}>
                                    {loading ? "Updating..." : "Save"}
                                </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                <button type="button-c" onClick={closeEditModal}>Cancel</button>
                            </div>
                        </div>
                    </form>

                    </div>
                </div>
            )}


            <style jsx>{`
                .container {
                    width: 90%;
                    margin: 0 auto;
                    font-family: Arial, sans-serif;
                }
                .header {
                    display: flex;
                    background-color: #FFF9C4;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    padding: 10px 0;
                }
                .LOWER {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px;
                    background-color: #FFF;
                }
                .add-button {
                    text-decoration: none;
                    background-color: #4CAF50;
                    color: white;
                    padding: 5px 10px;
                    border-radius: 5px;
                }
                .print-icon {
                    cursor: pointer;
                    font-size: 18px;
                }
                .license-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 0;
                }
                td {
                    padding: 5px;
                    text-align: center;
                    border-bottom: 1px solid #ddd;
                    font-size: 0.9rem;
                }
                th {
                    background-color: #8665f7;
                    color: white;
                    padding: 10px 0;
                }
                .action-buttons {
                    display: flex;
                    justify-content: end;
                    gap: 5px;
                }
                .edit-button, .view-button, .download-button {
                    padding: 2px 8px;
                    font-size: 12px;
                    border: none;
                    cursor: pointer;
                    margin: 0;
                    border-radius: 4px;
                    font-size: 0.7rem;
                    width: 90px;
                }
                .edit-button {
                    background-color: #4CAF50;
                    color: white;
                }
                .view-button {
                    background-color: #000000;
                    color: white;
                }
                .download-button {
                    background-color: #2196F3;
                    color: white;
                }
                td button {
                    margin: 0;  
                    display: inline-block; 
                }
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                .modal-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 5px;
                    width: 400px;
                    height: 60%;
                    overflow-y: auto;
                }
                .modal form div {
                    margin-bottom: 15px;
                }
                .modal form label {
                    display: block;
                    font-size: 1rem;
                }
                .modal form input {
                    width: 100%;
                    padding: 8px;
                    margin-top: 5px;
                    font-size: 1rem;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }
                .modal form button {
                    padding: 10px 15px;
                    font-size: 0.9rem;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 10px;
                }
                .modal form button[type="submit"] {
                    background-color: #4CAF50;
                    color: white;
                     gap: 5px;
                }
                .modal form button[type="button-c"] {
                    background-color: #F44336;
                    color: white;
                    margin-top: 5px;
                }
                .BUTTONS {
                    width: 90%;
                    margin: 0 auto;
                    justify content: start;
                    align-items: start; 
                    gap: 5px;
                }

                .Action-btns {
                    width: 300px;
                    margin: 0 auto;
                    gap: 5px;
                }
            `}</style>
        </div>
    );
};

export default Manage;
