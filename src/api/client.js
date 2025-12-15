// src/api/client.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем интерсептор для логирования
api.interceptors.request.use(
  (config) => {
    console.log(`➡️  ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Ошибка запроса:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`⬅️  Ответ ${response.status} от ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Ошибка ответа:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default api;