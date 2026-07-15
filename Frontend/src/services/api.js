import axios from 'axios';

const API_BASE_URL = 'http://localhost:5126/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // send/receive the httpOnly auth cookie automatically
});

// If the session is invalid/expired, send the user back to login
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me'),
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
    getChairBoard: () => api.get('/chairs/board'),
    addChair: (chair) => api.post('/chairs', chair),
    updateChair: (id, chair) => api.put(`/chairs/${id}`, chair),
    deleteChair: (id) => api.delete(`/chairs/${id}`),
};

export default api;