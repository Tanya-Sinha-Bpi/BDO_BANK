import axios from 'axios';

const axiosInstances = axios.create({
  // baseURL: 'https://bdo-bank.onrender.com/api/v1/',
  // baseURL: 'https://10.0.2.2:7272/api/v1/',
  baseURL: 'http://localhost:7272/api/v1/', 

  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ New function to attach token dynamically
export const setAuthToken = (token) => {
  if (token) {
    axiosInstances.defaults.headers.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstances.defaults.headers.Authorization;
  }
};

axiosInstances.interceptors.response.use(
  (response) => response,  // Pass successful responses through
  (error) => {
    if (error.response) {
      console.error('API Error Response:', error.response);
      console.error('Status Code:', error.response.status);
      console.error('Error Data:', error.response.data);

      // Always return the actual API error message if available
      return Promise.reject(error.response.data || { message: 'Unknown error occurred' });
    } else if (error.request) {
      console.error('No response received:', error.request);
      return Promise.reject({ message: 'No response from server. Please check your network.' });
    } else {
      console.error('Error during request setup:', error.message);
      return Promise.reject({ message: 'An error occurred during the request.' });
    }
  }
);

export default axiosInstances;
