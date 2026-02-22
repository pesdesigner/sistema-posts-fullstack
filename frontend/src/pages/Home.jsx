import { useEffect, useState } from 'react';
import api from '../services/api';

export function Home() {
  const [posts, setPosts] = useState([]);
  const [techFiltro, setTechFiltro] = useState('Todos');
  const tecnologias = ['Todos', 'Java', 'Python', 'C#', 'Docker', 'React'];

  useEffect(() => {
    // Busca todos os posts da API v1.5
    api.get('/posts').then(res => setPosts(res.data));
  }, []);

  // Filtra a lista baseada na aba selecionada
  const postsFiltrados = techFiltro === 'Todos' 
    ? posts 
    : posts.filter(p => p.tecnologia.toLowerCase() === techFiltro.toLowerCase());

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">
        Repositório de <span className="text-blue-300">Snippets</span>
      </h1>

      {/* ABAS DE FILTRO */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {tecnologias.map(tech => (
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

      {/* GRID DE POSTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {postsFiltrados.map(post => (
          <div key={post.id} className="glass-card flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-500/30 text-blue-200 text-xs font-bold px-3 py-1 rounded-md uppercase border border-blue-400/30">
                {post.tecnologia}
              </span>
              <span className="text-white/50 text-xs">por {post.nomeAutor}</span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">{post.titulo}</h2>
            <p className="text-white/70 text-sm mb-6 flex-grow line-clamp-3">{post.descricao}</p>
            
            {/* BLOCO DE COMANDO */}
            <div className="bg-black/40 rounded-lg p-4 font-mono text-sm text-green-400 border border-white/10 relative group">
              <code>$ {post.comando}</code>
              <button 
                onClick={() => navigator.clipboard.writeText(post.comando)}
                className="absolute top-2 right-2 text-white/30 hover:text-white transition opacity-0 group-hover:opacity-100"
                title="Copiar comando"
              >
                📋
              </button>
            </div>
          </div>
        ))}
      </div>

      {postsFiltrados.length === 0 && (
        <p className="text-center text-white/50 mt-20">Nenhum snippet encontrado para esta tecnologia.</p>
      )}
    </div>
  );
}