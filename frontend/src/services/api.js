import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// INTERCEPTOR: Executa antes de cada requisição sair para o Java
api.interceptors.request.use(
  (config) => {
    // 1. Busca o token que salvamos no localStorage durante o Login
    const token = localStorage.getItem('token');

    // 2. Se o token existir, coloca no cabeçalho 'Authorization'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// INTERCEPTOR DE RESPOSTA: Lida com erros globais (como token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se a API retornar 403 (Proibido) ou 401 (Não autorizado)
    if (error.response?.status === 403 || error.response?.status === 401) {
      console.warn("Sessão expirada ou acesso negado. Redirecionando...");
      localStorage.removeItem('token');
      localStorage.removeItem('usuarioLogado');
      // Redireciona para o login se não for uma rota pública
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

