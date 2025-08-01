import axios from 'axios';
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});
export default api;
