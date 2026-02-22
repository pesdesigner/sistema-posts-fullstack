import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function Home() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  const carregarUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      console.error("Erro ao carregar lista", err);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // FUNÇÃO PARA EXCLUIR
  const handleExcluir = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await api.delete(`/usuarios/${id}`);
        // Atualiza a lista local removendo o usuário deletado
        setUsuarios(usuarios.filter(u => u.id !== id));
        alert("Usuário removido!");
      } catch (err) {
        alert("Erro ao excluir usuário.");
      }
    }
  };

// src/pages/Home.jsx
return (
  <div className="container mx-auto px-4 max-w-6xl"> {/* Aumentamos para 6xl */}
    <div className="flex justify-between items-center mb-10 w-full">
      <h1 className="text-4xl font-extrabold text-white drop-shadow-md">
        Usuários <span className="text-blue-300">Cadastrados</span>
      </h1>
    <button 
    onClick={() => navigate('/cadastrar')}
    className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-semibold py-2 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap w-fit"
    >
    + Novo Usuário
    </button>
    </div>

    {/* O Card da Tabela agora com mais espaço */}
    <div className="glass-card !max-w-full overflow-x-auto shadow-2xl">
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr className="text-blue-200 uppercase text-sm tracking-wider">
            <th className="px-6 py-4">Nome</th>
            <th className="px-6 py-4">E-mail</th>
            <th className="px-6 py-4 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id} className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg">
              <td className="px-6 py-4 font-medium text-white">{u.nome}</td>
              <td className="px-6 py-4 text-white/80">{u.email}</td>
              <td className="px-6 py-4 text-center flex justify-center gap-4">
                <button onClick={() => navigate(`/editar/${u.id}`)} className="text-blue-300 hover:text-white transition">Editar</button>
                <button onClick={() => handleExcluir(u.id)} className="text-red-400 hover:text-red-200 transition">Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

}
