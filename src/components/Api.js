import axios from 'axios';

const backendUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: backendUrl,
});

export default api;