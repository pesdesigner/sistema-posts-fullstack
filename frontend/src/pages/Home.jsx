import { useEffect, useState } from 'react';
import api from '../services/api';

export function Home() {
  const [posts, setPosts] = useState([]);
  const [techFiltro, setTechFiltro] = useState('Todos');
  const tecnologias = ['Todos', 'Java', 'Python', 'C#', 'Docker', 'React', 'Angular', 'Node', 'MySQL', 'Javascript', 'PHP'];
  const [busca, setBusca] = useState(''); // 1. Estado para a busca


  useEffect(() => {
    // Busca todos os posts da API v1.5
    api.get('/posts').then(res => setPosts(res.data));
  }, []);

  // Filtra a lista baseada na aba selecionada
  // 2. Lógica de Filtro Duplo (Tecnologia + Texto)
  const postsFiltrados = posts.filter(p => {
    const matchesTech = techFiltro === 'Todos' || p.tecnologia.toLowerCase() === techFiltro.toLowerCase();
    const matchesBusca = p.titulo.toLowerCase().includes(busca.toLowerCase()) || 
                         p.comando.toLowerCase().includes(busca.toLowerCase());
    
    return matchesTech && matchesBusca;
  });

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-extrabold text-white mb-8 text-center drop-shadow-lg">
        Repositório de <span className="text-blue-300">Snippets</span>
      </h1>

      <div className="max-w-xl mx-auto mb-8">
        <div className="relative group">
          <span className="absolute inset-y-0 left-4 flex items-center text-white/40 group-focus-within:text-blue-400 transition-colors">
            🔍
          </span>
          <input 
            type="text"
            placeholder="Pesquisar por título ou código..."
            className="glass-input !pl-12 py-3 text-lg border-white/10 focus:border-blue-500/50 shadow-2xl transition-all"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* ABAS DE FILTRO */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {tecnologias.map(tech => (
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
            <div className={`relative group rounded-lg p-4 font-mono text-sm border custom-scrollbar ${post.comando.includes('\n')
                ? 'bg-slate-900/90 text-blue-300 border-blue-500/30 code-block'
                : 'bg-black/40 text-green-400 border-white/10 flex justify-between items-center'
              }`}>

              <code className="block pr-8">
                {post.comando.includes('\n') ? post.comando : `$ ${post.comando}`}
              </code>

              {/* BOTÃO SEMPRE VISÍVEL NO HOVER */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(post.comando);
                  alert("Copiado!"); // Opcional: para dar um feedback
                }}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600/80 hover:bg-blue-600 p-2 rounded-md text-white shadow-lg z-10"
                title="Copiar"
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