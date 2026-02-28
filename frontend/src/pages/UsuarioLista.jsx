import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export function UsuarioLista() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  const carregarUsuarios = async () => {
    try {
      const res = await api.get('/usuarios');
      setUsuarios(res.data);
    } catch (err) {
      console.error("Erro ao carregar usuários", err);
    }
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const handleExcluir = async (id) => {
    if (window.confirm("Deseja remover este administrador?")) {
      try {
        await api.delete(`/usuarios/${id}`);
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (err) {
        toast.error("Erro ao excluir.");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white drop-shadow-md">
          Painel de <span className="text-blue-300">Administradores</span>
        </h1>
        <button
          onClick={() => navigate('/cadastrar')}
          className="btn-primary px-6"
        >
          + Novo usuário
        </button>
      </div>

      <div className="glass-card !max-w-full overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="text-blue-200 border-b border-white/10">
              <th className="px-6 py-4 font-semibold uppercase text-sm">Nome</th>
              <th className="px-6 py-4 font-semibold uppercase text-sm">E-mail</th>
              <th className="px-6 py-4 font-semibold uppercase text-sm text-center">Perfil</th>
              <th className="px-6 py-4 text-center font-semibold uppercase text-sm">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {usuarios.map(u => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{u.nome}</td>
                <td className="px-6 py-4 text-white/80">{u.email}</td>

                {/* EXIBIÇÃO DO PERFIL COM BADGE */}
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${u.perfil === 'ADMIN'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400/30'
                    : 'bg-blue-500/20 text-blue-300 border-blue-400/30'
                    }`}>
                    {u.perfil}
                  </span>
                </td>

                <td className="px-6 py-4 text-center flex justify-center gap-4">
                  <button onClick={() => navigate(`/editar/${u.id}`)} className="text-blue-400 hover:text-blue-300 transition">Editar</button>
                  <button onClick={() => handleExcluir(u.id)} className="text-red-400 hover:text-red-300 transition">Remover</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

        {usuarios.length === 0 && (
          <p className="text-center py-10 text-white/40">Nenhum administrador cadastrado.</p>
        )}
      </div>
    </div>
  );
}
