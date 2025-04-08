import { useEffect, useState } from "react";

const NotificationPage = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
    const csrfToken = document.cookie.split('csrftoken=')[1];
    fetch("http://localhost:8000/notifications/", {
        method: "GET",
        headers: {
            'X-CSRFToken': csrfToken,
            "Content-Type": "application/json"
        },
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => setNotifications(data));

    
    }, []);

    const markAsRead = (notificationId) => {
        fetch(`http://localhost:8000/notifications/${notificationId}/mark-read/`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
            },
        })
        .then(() => {
            setNotifications(notifications.filter(n => n.id !== notificationId));
        })
        .catch(error => console.error("Error marking notification as read:", error));
    };

    return (
        <div>
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notify) => (
                    <li key={notify.id}>
                        <strong>{notify.type_notification}</strong>
                        <p>{notify.message}</p>
                        <button onClick={() => markAsRead(notify.id)}>Mark as Read</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default NotificationPage;
