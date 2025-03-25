import React, { useState, useEffect } from "react";

const Renew = () => {
    const [licenses, setLicenses] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8000/licenseS/")
            .then((res) => res.json())
            .then((data) => setLicenses(data));
    }, []);

    return (
        (
            <>
                <style>{`
                    .main {
                        width: 90%;
                        margin: auto;
                        padding: 20px;
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
    
                    .c-file-input {
                        width: 20%;
                        padding: 5px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                        background: #fff;
                    }
    
                    .terms {
                        display: flex;
                        align-items: center;
                        margin-top: 10px;
                    }
    
                    .terms input {
                        margin-right: 10px;
                    }
    
                    .btn-R {
                        width: 10%;
                        padding: 12px;
                        font-size: 18px;
                        color: #fff;
                        background-color: #28a745;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        margin-top: 15px;
                    }
    
                    .btn-R:hover {
                        background-color: #218838;
                    }
                `}</style>
    
                <div className="main">
                    <div className="header">
                        <h1>Renewal Application Form</h1>
                    </div>
                    <div className="applicationf">
                        <h3>Your Details</h3>
                        <form>
                            <label >Full Name: <span>*</span></label>
                            <input type="text" id="fullName" className="fcontrol" />
    
                            <label >Email: <span>*</span></label>
                            <input type="email" id="email" className="fcontrol" />
    
                            <label >Phone: <span>*</span></label>
                            <input type="telephone" id="phone" className="fcontrol" />
    
                            <h3>Required Documents</h3>
    
                            <label >Receipt: <span>*</span></label>
                            <input type="file" id="receipt" className="c-file-input" />
    
                            <label >Re-upload Older License: <span>*</span></label>
                            <input type="file" id="olderLicense" className="c-file-input" />
    
                            <div className="terms">
                                <input type="checkbox" id="terms" name="terms_and_condition" />
                                <label >I agree to the terms and conditions</label>
                            </div> 
    
                            <button type="submit" id="submit-id-submit" className="btn-R btn-success">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </>
        )
    );
};

export default Renew;
