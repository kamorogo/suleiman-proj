import React, { useEffect, useState } from "react";
import { fetchNotifications, markNotificationAsRead } from "../api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, []);

  const handleMarkRead = (id) => {
    markNotificationAsRead(id).then(() => {
      setNotifications(notifications.filter((n) => n.id !== id));
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id} className="p-2 bg-gray-100 my-2 rounded">
            {notification.message}
            <button
              onClick={() => handleMarkRead(notification.id)}
              className="ml-4 text-blue-500 underline"
            >
              Mark as Read
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
