import React from "react";

const Notifications = ({ data }) => {
 
  const getStatusColor = (status) => {
    switch (status) {
      case "Due Soon":
        return "#FFA500"; 
      case "Expired":
        return "#FF0000"; 
      case "Active":
        return "#008000"; 
      default:
        return "#000000"; 
    }
  };

  return (
    <div style={{ ...styles.notification, borderColor: getStatusColor(data.renew_status) }}>
      <h3 style={{ color: getStatusColor(data.renewal_status) }}>{data.issuing_authority}</h3>
      <p>Expiry Date: {data.expiry_date}</p>
      <p>Reminder: {data.reminderDays} days before expiry</p>
      <p style={{ fontWeight: "bold" }}>Status: {data.renew_status}</p>
    </div>
  );
};


const styles = {
  notification: {
    border: "2px solid",
    borderRadius: "8px",
    padding: "15px",
    margin: "10px 0",
  },
};

export default Notifications;
