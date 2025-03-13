import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const Renew = () => {
    const [licenses, setLicenses] = useState([]);
    const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
    const [selectedLicense, setSelectedLicense] = useState(null);

    useEffect(() => {
        fetch("http://localhost:8000/licenseS/")
            .then((res) => res.json())
            .then((data) => setLicenses(data));
    }, []);

    const handlePay = (license) => {
        setSelectedLicense(license);
        setPaymentDialogOpen(true);
    };

    const handlePaymentOption = (option) => {
        alert(`Proceeding with ${option} payment for license ID ${selectedLicense.id}`);
        setPaymentDialogOpen(false);
    };

    return (
        <Box sx={{ p: 3 }}>
            {licenses.map((license) => (
                <Box key={license.id} sx={{ mb: 4, p: 2, border: "1px solid gray", borderRadius: 5 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #ddd" }}>
                        <thead>
                            <tr>
                                <th style={headerColumnStyle}><strong>Type</strong></th>
                                <th style={headerColumnStyle}><strong>Issuing Authority</strong></th>
                                <th style={headerColumnStyle}><strong>Expiry Date</strong></th>
                                <th style={headerColumnStyle}><strong>Status</strong></th>
                                <th style={lastHeaderColumnStyle}><strong>Actions</strong></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={columnStyle}>{license.license_type}</td>
                                <td style={columnStyle}>{license.issuing_authority}</td>
                                <td style={columnStyle}>{new Date(license.expiry_date).toLocaleDateString()}</td>
                                <td style={columnStyle}>
                                    <span style={{
                                        padding: "4px 8px",
                                        borderRadius: "5px",
                                        color: "white",
                                        backgroundColor: license.renew_status === "Completed" ? "green" : "red"
                                    }}>
                                        {license.renew_status}
                                    </span>
                                </td>
                                <td style={lastColumnStyle}>
                                    {new Date(license.expiry_date) < new Date() ? (
                                        <Button variant="contained" color="secondary" onClick={() => handlePay(license)}>
                                            Pay
                                        </Button>
                                    ) : (
                                        <Button variant="contained" color="primary" disabled>
                                            Renew (Active)
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </Box>
            ))}

            <Dialog open={paymentDialogOpen} onClose={() => setPaymentDialogOpen(false)}>
                <DialogTitle>Select Payment Method</DialogTitle>
                <DialogContent>
                    <Button onClick={() => handlePaymentOption("Paypal")} sx={{ m: 1 }} variant="contained">PayPal</Button>
                    <Button onClick={() => handlePaymentOption("Mpesa")} sx={{ m: 1 }} variant="contained">M-Pesa</Button>
                    <Button onClick={() => handlePaymentOption("Airtel Money")} sx={{ m: 1 }} variant="contained">Airtel Money</Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPaymentDialogOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

const headerColumnStyle = {
    borderRight: "1px solid #ddd",
    borderBottom: "2px solid #000",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#f2f2f2",
};

const lastHeaderColumnStyle = {
    ...headerColumnStyle,
    borderRight: "none",
};

const columnStyle = {
    borderRight: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
};

const lastColumnStyle = {
    padding: "8px",
    textAlign: "left",
};

export default Renew;
