import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export function Postar() {
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    comando: '',
    tecnologia: 'Java', // Valor inicial padrão
    usuarioId: 1 // Mock do autor (ID do seu usuário no banco)
  });

  const navigate = useNavigate();
  const tecnologias = ['Java', 'Python', 'C#', 'Docker', 'React', 'Node'];

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      await api.post('/posts', form);
      alert("Post compartilhado com sucesso! 🚀");
      navigate('/'); // Volta para o Feed
    } catch (err) {
      console.error(err);
      alert("Erro ao publicar post. Verifique o console.");
    }
  };

  return (
    <div className="page-container">
      <div className="glass-card w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Compartilhar Snippet</h1>
        
        <form onSubmit={handleSalvar} className="flex flex-col gap-5">
          <div>
            <label className="text-white/60 text-sm ml-1">Título do Post</label>
            <input 
              className="glass-input mt-1" 
              placeholder="Ex: Como rodar MySQL no Docker"
              value={form.titulo}
              onChange={e => setForm({...form, titulo: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="text-white/60 text-sm ml-1">Tecnologia</label>
            <select 
              className="glass-input mt-1 appearance-none cursor-pointer"
              value={form.tecnologia}
              onChange={e => setForm({...form, tecnologia: e.target.value})}
            >
              {tecnologias.map(t => <option key={t} value={t} className="text-black">{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-white/60 text-sm ml-1">Descrição</label>
            <textarea 
              className="glass-input mt-1 h-32 resize-none" 
              placeholder="Explique brevemente o que esse comando faz..."
              value={form.descricao}
              onChange={e => setForm({...form, descricao: e.target.value})}
              required 
            />
          </div>

          <div>
            <label className="text-white/60 text-sm ml-1 font-mono">Linha de Comando</label>
            <input 
              className="glass-input mt-1 font-mono text-green-400" 
              placeholder="Ex: docker run --name mysql..."
              value={form.comando}
              onChange={e => setForm({...form, comando: e.target.value})}
              required 
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={() => navigate('/')} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Publicar Snippet</button>
          </div>
        </form>
      </div>
    </div>
  );
}
