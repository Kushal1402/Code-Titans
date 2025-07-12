'use client';

import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
});

instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        document.cookie = 'token=; path=/;';
        window.location.href = '/';
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
