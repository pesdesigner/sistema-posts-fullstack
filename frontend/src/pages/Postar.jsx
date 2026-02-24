import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export function Postar() {
  const { id } = useParams(); // Se houver ID, estamos em modo EDIÇÃO
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    comando: '',
    tecnologia: 'Java',
    usuarioId: usuarioLogado?.id
  });

  const tecnologias = ['Java', 'Python', 'C#', 'Docker', 'React', 'Node'];

  // BUSCA DADOS DO POST SE FOR EDIÇÃO
  useEffect(() => {
    if (id) {
      api.get(`/posts/${id}`)
        .then(res => {
          // Preenche o formulário com os dados vindos do banco
          setForm({
            titulo: res.data.titulo,
            descricao: res.data.descricao,
            comando: res.data.comando,
            tecnologia: res.data.tecnologia,
            usuarioId: usuarioLogado.id
          });
        })
        .catch(err => {
          console.error("Erro ao buscar snippet:", err);
          alert("Snippet não encontrado.");
          navigate('/meus-posts');
        });
    }
  }, [id, navigate, usuarioLogado.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Rota de UPDATE: /posts/{postId}/{usuarioId}
        await api.put(`/posts/${id}/${usuarioLogado.id}`, form);
        alert("Snippet atualizado com sucesso! 📝");
      } else {
        // Rota de CREATE: /posts
        await api.post('/posts', form);
        alert("Snippet publicado com sucesso! 🚀");
      }
      navigate('/meus-posts');
    } catch (err) {
      const msg = err.response?.data || "Erro ao salvar o snippet.";
      alert(msg);
    }
  };

  return (
    <div className="page-container">
      <div className="glass-card w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          {id ? 'Editar Snippet' : 'Compartilhar Snippet'}
        </h1>
        
        <form onSubmit={handleSalvar} className="flex flex-col gap-5 text-left">
          <div>
            <label className="text-white/60 text-sm ml-1">Título</label>
            <input 
              name="titulo"
              className="glass-input mt-1" 
              placeholder="Ex: Listar containers ativos"
              value={form.titulo}
              onChange={handleChange}
              required 
            />
          </div>

          <div>
            <label className="text-white/60 text-sm ml-1">Tecnologia</label>
            <select 
              name="tecnologia"
              className="glass-input mt-1 cursor-pointer"
              value={form.tecnologia}
              onChange={handleChange}
            >
              {tecnologias.map(t => (
                <option key={t} value={t} className="text-black">{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-white/60 text-sm ml-1">Descrição</label>
            <textarea 
              name="descricao"
              className="glass-input mt-1 h-32 resize-none" 
              placeholder="O que este comando faz?"
              value={form.descricao}
              onChange={handleChange}
              required 
            />
          </div>

          <div>
            <label className="text-white/60 text-sm ml-1 font-mono">Comando</label>
            <input 
              name="comando"
              className="glass-input mt-1 font-mono text-green-400" 
              placeholder="$ docker ps"
              value={form.comando}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button 
              type="button" 
              onClick={() => navigate('/meus-posts')} 
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              {id ? 'Salvar Alterações' : 'Publicar Snippet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
