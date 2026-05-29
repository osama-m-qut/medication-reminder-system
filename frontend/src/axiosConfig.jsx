import axios from 'axios';

// API base URL comes from the environment so the same build works locally and on
// the EC2 instance. Set REACT_APP_API_URL (e.g. http://<ec2-public-ip>:5001) at build
// time; falls back to localhost for local development.
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
