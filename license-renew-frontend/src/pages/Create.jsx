import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Create = () => {
   
    const [formData, setFormData] = useState({
        service_provider: "",
        amount_paid: "",
        issue_date: "",
        expiry_date: "",
        duration: "",
        subscription_type: "",
        owner_full_name: "",
        owner_email: "",
        owner_department: "",
    });
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const token = localStorage.getItem('token');
    console.log("Token from localStorage:", token);
    const durationToTypeMap = {
        0: "Trial",
        1: "Monthly",
        3: "Quarterly",
        6: "Semi-Annual",
        12: "Annual",
        24: "Biennial",
        36: "Triennial",
        48: "Quadrennial",
    };
    
    const getSubscriptionType = (duration) => {
        const parsed = parseInt(duration);
        return durationToTypeMap[parsed] || `${parsed} Months`;
    };

    const handleChanges = (e) => {
        const { name, value } = e.target;
        if (name === "duration") {
            const parsed = parseInt(value);
            const type = durationToTypeMap[parsed] || "";
            setFormData({
                ...formData,
                [name]: parsed,
                subscription_type: type,
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
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

            if (response.data.error) {
                alert("Failed to extract data from document.");
                return;
            }

            const extractedDuration = parseInt(response.data.duration) || 0;
            const calculatedType = getSubscriptionType(extractedDuration);

            setFormData({
                service_provider: response.data.service_provider || "",
                amount_paid: response.data.amount_paid || "",
                issue_date: response.data.issue_date || "",
                expiry_date: response.data.expiry_date || "",
                duration: extractedDuration,
                subscription_type: calculatedType,
            });

            alert("Text extracted and form pre-filled!");
        } catch (error) {
            console.error("Error extracting text:", error);
            alert("Failed to extract text from the document.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Form data before submit:", formData);

        if (!token) {
            alert("Token not found. Please log in.");
            return;
        }


        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });


        data.append("owner_full_name", formData.owner_full_name || "");
        data.append("owner_email", formData.owner_email || "");
        data.append("owner_department", formData.owner_department || "");

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
            console.log("Backend response:", response.data);
            alert("License Created Successfully!");
     

            navigate("/manage");
            setFormData({
                service_provider: "",
                amount_paid: "",
                issue_date: "",
                expiry_date: "",
                duration: "",
                subscription_type: "",
                owner_full_name: "",
                owner_email: "",
                owner_department: "",
            });
            setFile(null);

        } catch (error) {
            if (
                error.response &&
                error.response.data &&
                error.response.data.code === "token_not_valid"
            ) {
                alert("Session expired. Please log in again."); 
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
                @media (max-width: 768px) {
                    .main {
                        width: 90%;
                        padding: 10px;
                    }

                    .header h1 {
                        font-size: 24px;
                        text-align: center;
                    }

                    .applicationf h3 {
                        font-size: 16px;
                    }

                    .fcontrol {
                        font-size: 14px;
                        padding: 6px;
                    }

                    .btn-C {
                        width: 100%;
                        padding: 10px;
                        font-size: 16px;
                    }

                    .btn-R {
                        margin-top: 10px;
                        width: 100%;
                        padding: 10px;
                    }

                    label {
                        font-size: 14px;
                    }
                }

                @media (max-width: 480px) {
                    .header h1 {
                        font-size: 20px;
                    }

                    .btn-C, .btn-R {
                        font-size: 14px;
                        padding: 8px;
                    }

                    .fcontrol {
                        font-size: 13px;
                    }
                }

            `}</style>

            <form onSubmit={handleSubmit} className="applicationf">
                <label>Owner Full Name:</label>
                <input type="text" name="owner_full_name" value={formData.owner_full_name} onChange={handleChanges} className="fcontrol" placeholder="Full Name" />

                <label>Owner Email:</label>
                <input type="email" name="owner_email" value={formData.owner_email} onChange={handleChanges} className="fcontrol" placeholder="Email" />

                <label>Owner Department:</label>
                <input type="text" name="owner_department" value={formData.owner_department} onChange={handleChanges} className="fcontrol" placeholder="Department" />

                <label>Upload Document: </label>
                <input type="file" onChange={handleFileChanges} className="c-file-input" />
                <button type="button" onClick={handleUpload} className="btn-R">Extract Data</button>

                
                <label>Service Provider: </label>
                <select name="service_provider" value={formData.service_provider} onChange={handleChanges} className="fcontrol">
                    <option value="">Service provider</option>
                    {["Safaricom", "Airtel", "Telkom", "Microsoft", "Google", "Amazon", "Meta", "Apple", "Vodacom"].map((provider) => (
                        <option key={provider} value={provider}>{provider}</option>
                    ))}
                </select>

                <label>Amount Paid: </label>
                <input type="number" name="amount_paid" value={formData.amount_paid} onChange={handleChanges} className="fcontrol" placeholder="Amount Paid" />

                <label>Issued On: </label>
                <input type="date" name="issue_date" value={formData.issue_date} onChange={handleChanges} className="fcontrol" />

                <label>Expires On: </label>
                <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleChanges} className="fcontrol" />

                <label>Duration (Months): <span>*</span></label>
                <input type="number" name="duration" value={formData.duration} onChange={handleChanges} className="fcontrol" placeholder="Duration" />

                <label>Subscription Type: </label>
                <input type="text" name="subscription_type" value={formData.subscription_type} onChange={handleChanges} className="fcontrol" placeholder="Subscription Type" />

                <button type="submit" className="btn-C">Submit</button>
            </form>
        </div>
    );
};

export default Create;
