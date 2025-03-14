export const fetchNotifications = async (token) => {
    const response = await fetch("http://localhost:8000/notifications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.json();
  };
  