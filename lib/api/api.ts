// для створення одного спільного екземпляра axios,
// з налаштуванням withCredentials: true для підтримки cookies;
import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;
