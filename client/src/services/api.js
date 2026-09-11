import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL||"/api"
});

// Request interceptor: attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chat_app_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 unauth
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized, clear token
      // localStorage.removeItem('chat_app_token');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
  getProfile: () => api.get('/users/me')
};

export const userAPI = {
  getUsers: () => api.get('/users')
};

export const chatAPI = {
  fetchChats: () => api.get('/chats'),
  accessChat: (userId) => api.post('/chats', { userId }),
  createGroup: (name, users) => api.post('/chats/group', { name, users })
};

export const messageAPI = {
  getMessages: (chatId) => api.get(`/messages/${chatId}`),
  sendMessage: (chatId, content, file = null) => {
    if (file) {
      const formData = new FormData();
      formData.append('chatId', chatId);
      if (content) formData.append('content', content);
      formData.append('file', file);
      return api.post('/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return api.post('/messages', { chatId, content });
  },
  markAsRead: (chatId) => api.put(`/messages/${chatId}/read`)
};

export default api;
