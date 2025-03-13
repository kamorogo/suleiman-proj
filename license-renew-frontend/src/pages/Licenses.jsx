import React, { useState, useEffect } from "react";
import LicenseForm from "../components/LicenseForm";
import axios from "axios";

const Licenses = () => {
  const [licenses, setLicenses] = useState([]);

  useEffect(() => {
    fetchLicenses();
  }, []);

  const fetchLicenses = () => {
    axios.get("http://localhost:8000/licenseS/")
      .then(response => setLicenses(response.data))
      .catch(error => console.error("Error fetching licenses:", error));
  };

  const handleLicenseAdded = () => {
    fetchLicenses(); 
  };

  return (
    <div >
      <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "110%", padding: "0" }}>
        <div style={{ flex: 1, paddingRight: "20px" }}>
          <LicenseForm onLicenseAdded={handleLicenseAdded} />
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          div {
            flex-direction: column;
          }
          div > div {
            width: 100%;
            padding-right: 0;
            padding-left: 0;
          }
          div > div:first-child {
            margin-bottom: 20px;
          }
          .border-separator {
            border-left: none;
            border-top: 2px solid #ccc;
          }
        }
      `}</style>
    </div>
  );
};

export default Licenses;
