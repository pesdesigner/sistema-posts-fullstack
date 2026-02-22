import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080' // Endereço da sua API Spring Boot
});

export default api;
