import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:5000', // Change for production
  baseURL: 'https://payment-ss.onrender.com', // Change for production
});

export default api;