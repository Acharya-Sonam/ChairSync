import axios from 'axios';

const API_BASE_URL = 'http://localhost:5126/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

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