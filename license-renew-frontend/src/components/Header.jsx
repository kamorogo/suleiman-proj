import { useEffect, useState } from "react";
import axios from "axios";


export default function Header() {
    const [licenseData, setLicenseData] = useState(null);
    const token = localStorage.getItem('token');




  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) {
        console.error('No token found!');
        return;
      }

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/admin/create/', {
          headers: {
            'Content-Type': 'application/json',
            'Authoriz.ation': `Bearer ${token}`,
          },
        });
        setLicenseData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserData();
  }, [token]);
  

  const getInitialsAvatar = (firstName, lastName) => {
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random&color=fff&size=128`;
  };


  return (
    <div className="header">
        <input type="text" placeholder="Search..." className="search-input" />
        <div className="right-section">
            <button className="notification-button">
            <i class="far fa-bell"></i>
            </button>
            <div className="profile-avatar"><i class="fa-regular fa-user"></i></div>
        </div>
        <style>
            {`.header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #e5e7eb;
                background-color: white;
                }

                .search-input {
                border: 1px solid #ccc;
                padding: 0.5rem 0.75rem;
                border-radius: 4px;
                width: 33%;
                 margin-left: 20px;
                }

                .right-section {
                display: flex;
                align-items: center;
                gap: 3rem;
                margin-right: 20px;
                }

                .notification-button {
                  background: none;
                border: none;
                font-size: 1.25rem;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                }

                .profile-avatar {
                width: 2rem;
                height: 2rem;
                background-color: #FFF;
                border-radius: 50%;
                border: 1px solid black;
                display: flex;
                align-items: center;
                justify-content: center;
                }
            `}
        </style>
    </div>
  );
}
