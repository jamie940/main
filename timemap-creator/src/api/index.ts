import axios from 'axios';
import { auth } from '../firebase';

const apiClient = axios.create({
  baseURL: 'http://localhost:5000', // The address of our Express server
});

apiClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
