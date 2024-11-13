import axios from 'axios';

const api = axios.create({
    baseURL: 'https://wave-app-portfolio-project-bd63556f6378.herokuapp.com/api'
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default api;
