import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

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
    
    toast.success(`Bem-vindo de volta, ${response.data.nome}!`, {
      style: { background: '#1e293b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }
    });

    navigate('/');
    window.location.reload();
  } catch (err) {
      toast.error(err.response?.data?.mensagem || "E-mail ou senha inválidos");
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