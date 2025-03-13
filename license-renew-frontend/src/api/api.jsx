export const fetchNotifications = async (token) => {
    const response = await fetch("http://localhost:8000/notifications/", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  
    if (!response.ok) {
      throw new Error("Failed to fetch notifications");
    }
  
    return response.json();
  };
  