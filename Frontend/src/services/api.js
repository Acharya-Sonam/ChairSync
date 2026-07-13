import axios from 'axios';

const API_BASE_URL = 'http://localhost:5126/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach the saved token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('chairsync_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// If the token is invalid/expired, clear it and send the user back to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('chairsync_token');
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
};

export const customerService = {
    getCustomers: () => api.get('/customer'),
    getWaitingCustomers: () => api.get('/customer/waiting'),
    addCustomer: (customer) => api.post('/customer', customer),
    assignChair: (customerId, chairId) => api.post(`/customer/${customerId}/assign/${chairId}`),
    completeHaircut: (customerId) => api.post(`/customer/${customerId}/complete`),
};

export const chairService = {
    getChairs: () => api.get('/chairs'),
    addChair: (chair) => api.post('/chairs', chair),
    updateChair: (id, chair) => api.put(`/chairs/${id}`, chair),
    deleteChair: (id) => api.delete(`/chairs/${id}`),
};

export default api;