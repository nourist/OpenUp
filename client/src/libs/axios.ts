import axios from 'axios';

const http = axios.create({
	withCredentials: true,
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
});

export default http;
