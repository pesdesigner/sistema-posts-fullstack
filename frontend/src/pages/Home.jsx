import { useEffect, useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { SkeletonCard } from '../components/SkeletonCard';
import { PostCard } from '../components/PostCard'; // Importante: Usar o componente centralizado

export function Home() {
  const [posts, setPosts] = useState([]);
  const [techFiltro, setTechFiltro] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  const tecnologiasDisponiveis = [
    'Todos',
    ...new Set(posts.map(post => post.tecnologia))
  ].sort();

  useEffect(() => {
  if (!tecnologiasDisponiveis.includes(techFiltro)) {
    setTechFiltro('Todos');
  }
}, [tecnologiasDisponiveis, techFiltro]); // Executa sempre que a lista ou o filtro mudar

  // APENAS UM useEffect para carregar o feed
  useEffect(() => {
    const carregarFeed = async () => {
      setLoading(true);
      try {
        const res = await api.get('/posts');
        setPosts(res.data);
      } catch (err) {
        toast.error("Erro ao carregar o feed.");
      } finally {
        setLoading(false);
      }
    };
    carregarFeed();
  }, []);

  // Lógica de Filtro Única
  const postsFiltrados = posts.filter(p => {
    const matchesTech = techFiltro === 'Todos' || p.tecnologia.toLowerCase() === techFiltro.toLowerCase();
    const matchesBusca = p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
      p.comando.toLowerCase().includes(busca.toLowerCase());
    return matchesTech && matchesBusca;
  });

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <h1 className="text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">
        Repositório de <span className="text-blue-300">Snippets</span>
      </h1>

      {/* BARRA DE PESQUISA */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="relative group">
          <span className="absolute inset-y-0 left-4 flex items-center text-white/40 group-focus-within:text-blue-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Pesquisar por título ou código..."
            className="glass-input !pl-12 py-3 text-lg"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* ABAS DE FILTRO DINÂMICAS */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {tecnologiasDisponiveis.map(tech => (
          <button
            key={tech}
            onClick={() => setTechFiltro(tech)}
            className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 border ${techFiltro === tech
                ? 'bg-white text-blue-600 border-white shadow-xl scale-110'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
          >
            {tech}
          </button>
        ))}
      </div>

      {/* RENDERIZAÇÃO CONDICIONAL (SKELETON OU POSTS) */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postsFiltrados.map(post => (
            <PostCard
              key={post.id}
              post={post}
              showActions={false} // Home não mostra editar/excluir
              showAuthor={true}
            />
          ))}
        </div>
      )}

      {/* MENSAGEM SE NÃO HOUVER RESULTADOS */}
      {!loading && postsFiltrados.length === 0 && (
        <p className="text-center text-white/50 mt-20 italic">
          Nenhum snippet encontrado para esta busca ou tecnologia.
        </p>
      )}
    </div>
  );
}
