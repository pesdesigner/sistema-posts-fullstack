import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importe o navigate
import api from '../services/api';

export function MeusPosts() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate(); // 2. Inicialize o navigate
  
  // Pegamos o usuário uma única vez
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  useEffect(() => {
    // Usamos o ID para evitar que objetos complexos causem re-renderização
    const usuarioId = usuario?.id;

    if (usuarioId) {
      api.get(`/posts/autor/${usuarioId}`)
        .then(res => setPosts(res.data))
        .catch(err => console.error("Erro ao carregar:", err));
    }
  }, [usuario?.id]); // 3. Dependência estável (apenas o ID)

  const handleExcluir = async (postId) => {
    if (window.confirm("Deseja apagar este snippet permanentemente?")) {
      try {
        await api.delete(`/posts/${postId}/${usuario.id}`);
        setPosts(posts.filter(p => p.id !== postId));
        alert("Snippet removido!");
      } catch (err) {
        alert(err.response?.data || "Erro ao excluir");
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold text-white mb-8">
        Meus <span className="text-blue-300">Snippets</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map(post => (
          <div key={post.id} className="glass-card">
            <div className="flex justify-between mb-2">
              <span className="text-blue-300 text-xs font-bold uppercase">{post.tecnologia}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/editar-post/${post.id}`)} // Agora vai funcionar!
                  className="text-blue-400 hover:text-blue-300 text-xs font-bold"
                >
                  EDITAR
                </button>
                <button
                  onClick={() => handleExcluir(post.id)}
                  className="text-red-400 hover:text-red-300 text-xs font-bold"
                >
                  EXCLUIR
                </button>
              </div>
            </div>
            <h2 className="text-xl font-bold text-white">{post.titulo}</h2>
            <p className="text-white/60 text-sm my-4">{post.descricao}</p>
            <div className="bg-black/40 p-3 rounded font-mono text-green-400 text-sm">
              $ {post.comando}
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <p className="text-white/40 mt-10">Você ainda não publicou nenhum snippet.</p>
      )}
    </div>
  );
}
