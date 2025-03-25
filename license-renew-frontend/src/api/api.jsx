
import axios from 'axios';

const API_URL = 'http://localhost:8000/license-update/${id}/'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const getLicense = (id) => api.get(`licenses/${id}/`);

export const updateLicense = (id, data) => api.put(`licenses/${id}/`, data);

