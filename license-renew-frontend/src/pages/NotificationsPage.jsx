import React, { useState, useEffect } from "react";
import Notifications from "../components/Notifications";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);  
  const [loading, setLoading] = useState(true);            
  const [error, setError] = useState(null);                

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("http://localhost:8000/licenseS/");  
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data = await response.json(); 
        setNotifications(data);  
      } catch (error) {
        setError(error.message);  
      } finally {
        setLoading(false);  
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div style={{ background: 'linear-gradient(360deg, rgb(253, 253, 253) 0%, rgb(222, 221, 233) 100%)'}}>
    <div style={styles.container}>
      <h2>License Renewal Notifications</h2>

      {loading && <p>Loading notifications...</p>}  {/* Show loading message */}
      {error && <p style={{ color: "red" }}>{error}</p>}  {/* Show error message */}

      {!loading && !error && notifications.length === 0 ? (
        <p>No notifications available</p> 
      ) : (
        notifications.map((notification) => (
          <Notifications key={notification.id} data={notification} />
        ))
      )}
    </div>
    </div>
  );
};


const styles = {
  container: {
    background: "linear-gradient(360deg, rgb(253, 253, 253) 0%, rgb(222, 221, 233) 100%)",
    padding: "20px",
    maxWidth: "600px",
    margin: "auto",
  },
};

export default NotificationsPage;
