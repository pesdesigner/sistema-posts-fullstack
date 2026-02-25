import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await api.post('/auth/login', { email, senha });
    
    // Agora o response.data contém { token, id, nome, perfil }
    localStorage.setItem('usuarioLogado', JSON.stringify(response.data));
    localStorage.setItem('token', response.data.token); // Salva o token separado para facilitar
    
    navigate('/');
    window.location.reload();
  } catch (err) {
    alert(err.response?.data?.mensagem || "Falha no login");
  }
};


  return (
    <div className="page-container">
      <div className="glass-card">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input 
            type="email" 
            className="glass-input" 
            placeholder="E-mail" 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            className="glass-input" 
            placeholder="Senha" 
            onChange={(e) => setSenha(e.target.value)} 
            required 
          />
          <button type="submit" className="btn-primary mt-4">Entrar</button>
        </form>
      </div>
    </div>
  );
}