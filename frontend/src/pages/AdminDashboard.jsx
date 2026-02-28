import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export function AdminDashboard() {
  const [stats, setStats] = useState({ totalPosts: 0, totalUsuarios: 0, porTecnologia: {} });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarDados = async () => {
    try {
      const [resStats, resPosts] = await Promise.all([
        api.get('/posts/admin/estatisticas'),
        api.get('/posts/admin/todos')
      ]);
      setStats(resStats.data);
      setPosts(resPosts.data);
    } catch (err) {
      toast.error("Erro ao carregar dados do painel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleExcluirMaster = async (id) => {
    if (window.confirm("MODERADOR: Deseja apagar este post de forma definitiva?")) {
      try {
        await api.delete(`/posts/admin/${id}`);
        setPosts(posts.filter(p => p.id !== id));
        toast.success("Post removido pelo moderador!");
        // Atualiza stats após excluir
        setStats(prev => ({ ...prev, totalPosts: prev.totalPosts - 1 }));
      } catch (err) {
        toast.error("Erro na exclusão mestre.");
      }
    }
  };

  if (loading) return <div className="text-center mt-20 text-white">Carregando painel...</div>;

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-8">Painel de <span className="text-blue-400">Controle Global</span></h1>

      {/* WIDGETS DE ESTATÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="glass-card p-6 border-l-4 border-blue-500">
          <p className="text-white/60 text-sm uppercase font-bold">Total de Posts</p>
          <h2 className="text-4xl font-black text-white">{stats.totalPosts}</h2>
        </div>
        <div className="glass-card p-6 border-l-4 border-purple-500">
          <p className="text-white/60 text-sm uppercase font-bold">Usuários Cadastrados</p>
          <h2 className="text-4xl font-black text-white">{stats.totalUsuarios}</h2>
        </div>
        <div className="glass-card p-6 border-l-4 border-green-500">
          <p className="text-white/60 text-sm uppercase font-bold">Tecnologias Ativas</p>
          <h2 className="text-4xl font-black text-white">{Object.keys(stats.porTecnologia).length}</h2>
        </div>
      </div>

      {/* TABELA DE MODERAÇÃO DE POSTS */}
      <div className="glass-card !max-w-full overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-white/5">
          <h3 className="font-bold text-white">Moderação de Snippets</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-blue-300 text-xs uppercase">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Título</th>
              <th className="px-6 py-3">Tecnologia</th>
              <th className="px-6 py-3">Autor</th>
              <th className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {posts.map(post => (
              <tr key={post.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 text-white/40">#{post.id}</td>
                <td className="px-6 py-4 text-white font-medium">{post.titulo}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-500/20 text-blue-200 px-2 py-1 rounded text-xs">
                    {post.tecnologia}
                  </span>
                </td>
                <td className="px-6 py-4 text-white/60">{post.nomeAutor}</td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => handleExcluirMaster(post.id)}
                    className="text-red-400 hover:text-red-300 font-bold text-xs"
                  >
                    EXCLUIR (MASTER)
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
