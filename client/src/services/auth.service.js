import apiClient from '@/lib/apiClient';

const login = (email, password) => apiClient.post('/api/auth/login', { email, password });
const registeration = (name, email, password) => apiClient.post('/api/auth/register', { name, email, password })

export {
    login,
    registeration
}