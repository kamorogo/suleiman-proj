import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Renewal = () => {
    const [licenseData, setLicenseData] = useState(null);
    const token = localStorage.getItem('token');
    const [licenses, setLicenses] = useState([]);
    const [statusFilter, setStatusFilter] = useState("active");
    const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error('No token found!');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/profile/', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setLicenseData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserData();
    fetchLicenses();
  }, [token]);
  
  const fetchLicenses = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/licenseS/");
      const data = await response.json();
      console.log("Fetched data:", data);
      setLicenses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching licenses:", error);
      setLicenses([]);
    }
  };
  

  const filteredLicenses =
  statusFilter === "all"
    ? licenses
    : licenses.filter((license) => license.status === statusFilter);


  const getInitialsAvatar = (firstName, lastName) => {
    const initials = `${firstName ? firstName[0] : ''}${lastName ? lastName[0] : ''}`.toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=128`;
  };

  return (
    <div class="bodyrenewals">
       
        <div class="cardheader">
        {licenseData && (
            <>
            <img 
                 src={licenseData.profile_picture || getInitialsAvatar(licenseData.user?.first_name, licenseData.user?.last_name)}
                 alt="Profile"
                 className="profile-avatar"
            />
            <div class="cardHcontent">
            <div class="user-name">{licenseData.user?.first_name} {licenseData.user?.last_name}</div>
            <div class="user-bio">{licenseData.bio}</div>
            </div>
            </>
        )}
        </div>

        
        <div className="midheader">
          <button
            className={`button ${statusFilter === "active" ? "active" : ""}`}
            onClick={() => setStatusFilter("active")}
          >
            Active
          </button>
          <button
            className={`button ${statusFilter === "expired" ? "active" : ""}`}
            onClick={() => setStatusFilter("expired")}
          >
            Expired
          </button>
         
          <button
            className={`button ${statusFilter === "all" ? "active" : ""}`}
            onClick={() => setStatusFilter("all")}
          >
            All
          </button>
        </div>


        
        <div class="renewalsmain">
            <div class="renewals-header">
            <h>Current subscriptions</h>
            <span class="show-all">Show All</span>
            </div>

           
        {filteredLicenses.map((license) => {
          const providerName = license.providers.toLowerCase();
          const imagePath = `/${providerName}.png`; 

          const issueDate = new Date(license.issue_date).toLocaleDateString();
          const expiryDate = new Date(license.expiry_date).toLocaleDateString();

  
          const statusClass = {
            active: "status-btn active",
            expired: "status-btn expired",
            decommissioned: "status-btn decommissioned"
          }[license.status] || "status-btn";

          return (
            <div 
              className="subscription-box" 
              key={license.id}
              onClick={() => navigate(`/renew/${license.id}`)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={imagePath}
                alt={`${license.providers}`}
                className="subscription-icon"
                onError={(e) => (e.target.src = "/default.jpg")}
              />
             
    
              <div className="subscription-name">{license.providers} subscription</div>
              <div className="subscription-dates">
                <span> &nbsp; &nbsp; Issued <br/><br/>{issueDate}</span>
                <span></span> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;<span>&nbsp; &nbsp;Expires <br/><br/> {expiryDate}</span>
              </div>
              <button className={statusClass}>{license.status}</button>
              <div className="subscription-price">Ksh {license.amount_paid}</div>
            </div>
          );
        })}
        </div>



        <style>
            {
                `
                .bodyrenewals {
                padding: 10px 200px;
                background-color: #f9fafb;
                }

             
                .cardheader {
                display: flex;
                align-items: center;
                justify-content: flex-start;
                margin-bottom: 1.5rem;
                padding: 1rem;
                background-color: #ffffff;
                border-radius: 0.5rem;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
                }

                .cardHcontent {
                display: flex;
                flex-direction: column;
                margin-left: 1rem;
                }
                  .profile-avatar {
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  object-fit: cover; 
                }

                .Profile {
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                object-fit: cover;
                }

                .user-name {
                font-size: 1.125rem;
                font-weight: 600;
                color: #111827;
                }

                .user-bio {
                font-size: 0.875rem;
                color: #6b7280;
                }
                .midheader {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-bottom: 2rem;
                }

                .button {
                padding: 0.5rem 1rem;
                border: 1px solid #d1d5db;
                border-radius: 0.375rem;
                background-color: white;
                color: #111827;
                cursor: pointer;
                transition: background-color 0.2s ease, color 0.2s ease;
                }

                .button:hover {
                background-color: #f3f4f6;
                }

                .button.active {
                background-color: #3b82f6;
                color: white;
                border-color: transparent;
                }
                .renewalsmain {
                padding: 1rem;
                border-radius: 0.5rem;
                }

                .renewals-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1rem;
                }

                .renewals-header h3 {
                font-size: 1.25rem;
                font-weight: 600;
                }

                .show-all {
                font-size: 0.875rem;
                color: #3b82f6;
                cursor: pointer;
                }
                .subscription-box {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background-color: #ffffff;
                border-radius: 0.5rem;
                box-shadow: 1px 2px rgba(0, 0, 0, 0.1);
                margin-bottom: 1rem;
                transition: box-shadow 0.2s ease;
                }

                .subscription-box:hover {
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
                transform: scale(1.01);
                transition: all 0.2s ease;
                }

                .subscription-icon {
                width: 3rem;
                height: 3rem;
                object-fit: contain;
                }

                .subscription-name {
                font-size: 1rem;
                font-weight: 500;
                flex: 1;
                }
                .subscription-dates {
                  flex: 1;
                  display: flex;
                  flex-direction: row;
                  font-size: 0.8rem;
                  color: #6b7280;
                  gap: 30px;
                }
                  .status-btn {
                  padding: 0.3rem 0.6rem;
                  border-radius: 0.375rem;
                  font-size: 0.75rem;
                  font-weight: 500;
                  text-transform: capitalize;
                  border: none;
                  cursor: default;
                }

                .status-btn.active {
                  background-color: #10b981;
                  color: white;
                }

                .status-btn.expired {
                  background-color: #ef4444;
                  color: white;
                }

                .status-btn.decommissioned {
                  background-color: #6b7280;
                  color: white;
                }
                .subscription-price {
                font-size: 0.875rem;
                color: #4b5563;
                }

                .subscription-price.expired {
                color: #ef4444;
                }

                /* Text helpers */
                .text-center {
                text-align: center;
                }

                .text-gray {
                color: #6b7280;
                }

                .text-red {
                color: #ef4444;
                }

                /* Spacing for list of subscriptions */
                .space-y-2 > * + * {
                margin-top: 0.5rem;
                }

                `
            }
        </style>
    </div>
  );
};

export default Renewal;
