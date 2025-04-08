import React, { useState } from 'react';
import axios from 'axios';

const Create = () => {
    // State for form data
    const [formData, setFormData] = useState({
        subscription_type: "",
        service_provider: "",
        amount_paid: "",
        duration: "",
        issue_date: "",
        expiry_date: "",
    });

    const [file, setFile] = useState(null);
    const token = localStorage.getItem('token');


    console.log("Token from localStorage:", token);


    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('refresh');
        if (!refreshToken) {
            console.error("No refresh token found.");
            return null;
        }
    
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
                refresh: refreshToken,
            });
            const newAccessToken = response.data.access;
            localStorage.setItem("token", newAccessToken);  
            return newAccessToken;
        } catch (error) {
            console.error("Error refreshing access token:", error);
            return null;
        }
    };
    


    // Handle form input changes
    const handleChanges = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle file input change
    const handleFileChanges = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle file upload and data extraction
    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const data = new FormData();
        data.append("document", file);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/license/extract/", data);

            if (response.data.error) {
                alert("Failed to extract data from document.");
                return;
            }

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
            alert("Failed to extract text from the document.");
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            alert("You must be logged in to create a license.");
            return;
        }


        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });
        if (file) data.append("document", file);

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/license-add/",
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            alert("License Created Successfully!");
        } catch (error) {
            
            if (
                error.response &&
                error.response.data &&
                error.response.data.code === "token_not_valid"
            ) {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    try {
                        const retryResponse = await axios.post(
                            "http://127.0.0.1:8000/api/license-add/",
                            data,
                            {
                                headers: {
                                    Authorization: `Bearer ${newToken}`,
                                },
                            }
                        );
                        alert("License Created Successfully!");
                    } catch (retryError) {
                        console.error("Retry Error:", retryError);
                        alert("Failed to create license after refreshing token.");
                    }
                } else {
                    alert("Session expired. Please log in again.");
                }
            } else {
                console.error("Error:", error);
                alert("Failed to create license.");
            }
        }
    };

    return (
        <div className="main">
            <style>{`
                .main {
                    width: 50%;
                    margin: auto;
                    padding: 0;
                    border-radius: 10px;
                    background-color: #f9f9f9;
                    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0);
                }

                .header {
                    text-align: start;
                    margin-bottom: 20px;
                }

                .header h1 {
                    color: #333;
                    font-weight: normal;
                    font-size: 30px;
                }

                .applicationf {
                    padding: 20px;
                }

                .applicationf h3 {
                    margin-bottom: 15px;
                    font-weight: normal;
                    color: #444;
                    font-size: 18px;
                }

                label {
                    display: block;
                    margin: 10px 0 5px;
                    color: #555;
                }

                span {
                    color: red;
                }

                .fcontrol {
                    width: 100%;
                    padding: 8px;
                    margin-bottom: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    font-size: 16px;
                }

                .terms {
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                }

                .terms input {
                    margin-right: 10px;
                }

                .btn-C {
                    width: 15%;
                    padding: 12px;
                    font-size: 18px;
                    color: #fff;
                    background-color:rgb(100, 132, 206);
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                }

                .btn-C:hover {
                    background-color:rgb(144, 154, 199);
                }
            `}</style>

            <form onSubmit={handleSubmit} className="applicationf">
                <label>Upload Document: </label>
                <input type="file" onChange={handleFileChanges} className="c-file-input" />
                <button type="button" onClick={handleUpload} className="btn-R">Extract Data</button>

                <label>Subscription Type: </label>
                <input type="text" name="subscription_type" value={formData.subscription_type} onChange={handleChanges} className="fcontrol" placeholder="Subscription Type" />

                <label>Service Provider: </label>
                <select name="service_provider" value={formData.service_provider} onChange={handleChanges} className="fcontrol">
                    <option value="">Service provider</option>
                    {["Safaricom", "Airtel", "Telkom", "Microsoft", "Google", "Amazon", "Meta", "Apple", "Vodacom"].map((provider) => (
                        <option key={provider} value={provider}>{provider}</option>
                    ))}
                </select>

                <label>Amount Paid: </label>
                <input type="number" name="amount_paid" value={formData.amount_paid} onChange={handleChanges} className="fcontrol" placeholder="Amount Paid" />

                <label>Duration (Months): <span>*</span></label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChanges} className="fcontrol" placeholder="Duration" />

                <label>Issued On: </label>
                <input type="date" name="issue_date" value={formData.issue_date} onChange={handleChanges} className="fcontrol" />

                <label>Expires On: </label>
                <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChanges} className="fcontrol" />

                <button type="submit" className="btn-C">Submit</button>
            </form>
        </div>
    );
};

export default Create;
