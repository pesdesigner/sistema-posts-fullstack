import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { PostCard } from '../components/PostCard'; // 1. Certifique-se da importação
import { SkeletonCard } from '../components/SkeletonCard';

export function MeusPosts() {
  const [posts, setPosts] = useState([]);
  const [busca, setBusca] = useState('');
  const [techFiltro, setTechFiltro] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));
  //const tecnologias = ['Todos', 'Java', 'Python', 'C#', 'Docker', 'React', 'Angular', 'Node', 'MySQL', 'Javascript', 'PHP', 'Outros'];

  const tecnologiasDisponiveis = [
  'Todos', 
  ...new Set(posts.map(post => post.tecnologia))
].sort();

  useEffect(() => {
    const carregarDados = async () => {
      if (!usuario?.id) return;
      setLoading(true);
      try {
        const res = await api.get(`/posts/autor/${usuario.id}`);
        setPosts(res.data);
      } catch (err) {
        toast.error("Erro ao carregar seus snippets.");
      } finally {
        setLoading(false);
      }
    };
    carregarDados();
  }, [usuario?.id]);

const handleExcluir = async (postId) => {
  // 1. A TRAVA (Confirmação)
  if (window.confirm("Cuidado! Deseja apagar este snippet permanentemente?")) {
    
    // 2. O FEEDBACK DE ESPERA (Opcional, mas sênior)
    const carregandoToast = toast.loading("Excluindo...");

    try {
      await api.delete(`/posts/${postId}/${usuario.id}`);
      
      // Atualiza o estado local
      setPosts(posts.filter(p => p.id !== postId));

      // 3. O SUCESSO (Substitui o alerta de sucesso)
      toast.success("Snippet removido com sucesso! 👋", { id: carregandoToast });
      
    } catch (err) {
      // 4. O ERRO
      toast.error("Ops! Não conseguimos excluir o post.", { id: carregandoToast });
    }
  }
};


  const postsFiltrados = posts.filter(p => {
    const matchesTech = techFiltro === 'Todos' || p.tecnologia === techFiltro;
    const matchesBusca = p.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                         p.comando.toLowerCase().includes(busca.toLowerCase());
    return matchesTech && matchesBusca;
  });

  return (
    <div className="container mx-auto px-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">
        Meus <span className="text-blue-300">Snippets</span>
      </h1>

      {/* BARRA DE PESQUISA */}
      <div className="max-w-xl mx-auto mb-6 relative">
        <input 
          type="text"
          placeholder="Pesquisar em meus códigos..."
          className="glass-input py-3 !pl-12"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* FILTROS */}
{/* ABAS DE FILTRO DINÂMICAS */}
<div className="flex flex-wrap justify-center gap-2 mb-10">
  {tecnologiasDisponiveis.map(tech => (
    <button
      key={tech}
      onClick={() => setTechFiltro(tech)}
      className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 border ${
        techFiltro === tech
          ? 'bg-white text-blue-600 border-white shadow-xl scale-110'
          : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
      }`}
    >
      {tech}
    </button>
  ))}
</div>


      {/* RENDERIZAÇÃO ÚNICA */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 4].map(n => <SkeletonCard key={n} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {postsFiltrados.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              showActions={true} 
              onEdit={(id) => navigate(`/editar-post/${id}`)}
              onDelete={handleExcluir}
              showAuthor={false}
            />
          ))}
        </div>
      )}

      {!loading && postsFiltrados.length === 0 && (
        <p className="text-center text-white/30 mt-20">Nenhum snippet encontrado.</p>
      )}
    </div>
  );
}
