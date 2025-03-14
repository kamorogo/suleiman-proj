import axios from "axios";

const API_URL = "http://localhost:8000/";

export const fetchDashboardData = async () => {
  const response = await axios.get(`${API_URL}/licenses/dashboard/`);
  return response.data;
};

export const fetchNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications/`);
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  await axios.put(`${API_URL}/notifications/${id}/mark_as_read/`);
};
