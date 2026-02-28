import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

export function Postar() {
  const { id } = useParams(); // Se houver ID, estamos em modo EDIÇÃO
  const navigate = useNavigate();
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const tecnologias = ['Java', 'Python', 'C#', 'Docker', 'React', 'Angular', 'Node', 'MySQL', 'Javascript', 'PHP', 'Outros'];
  const [abaAtiva, setAbaAtiva] = useState('comando'); // 'comando' ou 'codigo'

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    comando: '',
    tecnologia: 'Java',
    tecnologiaPersonalizada: '',
    usuarioId: usuarioLogado?.id
  });

  const [mostrarInputOutros, setMostrarInputOutros] = useState(false);

  const handleSelectChange = (e) => {
    const valor = e.target.value;
    setForm({ ...form, tecnologia: valor });
    setMostrarInputOutros(valor === 'Outros');
  };

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
          toast.alert("Snippet não encontrado.");
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

    // Se for "Outros", usamos o valor digitado no input manual
    const dadosParaEnviar = {
      ...form,
      tecnologia: form.tecnologia === 'Outros' ? form.tecnologiaPersonalizada : form.tecnologia
    };

    try {
      if (id) {
        await api.put(`/posts/${id}/${usuarioLogado.id}`, dadosParaEnviar);
        toast.success("Snippet atualizado! 📝");
      } else {
        await api.post('/posts', dadosParaEnviar);
        toast.success("Snippet publicado! 🚀");
      }
      navigate('/meus-posts');
    } catch (err) {
      // Aqui o seu GlobalExceptionHandler do Java vai brilhar!
      const msg = err.response?.data?.mensagem || "Erro ao salvar";
      toast.error(msg);
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
              onChange={handleSelectChange}
            >
              {tecnologias.map(t => (
                <option key={t} value={t} className="text-black">{t}</option>
              ))}
            </select>

            {/* RENDERIZAÇÃO CONDICIONAL: Só aparece se for "Outros" */}
            {mostrarInputOutros && (
              <input
                type="text"
                className="glass-input mt-3 border-blue-400/50 animate-pulse"
                placeholder="Qual tecnologia?"
                value={form.tecnologiaPersonalizada}
                onChange={e => setForm({ ...form, tecnologiaPersonalizada: e.target.value })}
                required
              />
            )}
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

          <div className="flex gap-2 mb-4 bg-white/5 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setAbaAtiva('comando')}
              className={`flex-1 py-2 rounded-md transition ${abaAtiva === 'comando' ? 'bg-blue-600 text-white shadow' : 'text-white/60 hover:bg-white/10'}`}
            >
              ⌨️ Linha de Comando
            </button>
            <button
              type="button"
              onClick={() => setAbaAtiva('codigo')}
              className={`flex-1 py-2 rounded-md transition ${abaAtiva === 'codigo' ? 'bg-blue-600 text-white shadow' : 'text-white/60 hover:bg-white/10'}`}
            >
              💻 Trecho de Código
            </button>
          </div>

          {/* Renderização condicional do Input */}
          {abaAtiva === 'comando' ? (
            <input
              name="comando"
              className="glass-input font-mono text-green-400"
              placeholder="$ docker ps"
              value={form.comando}
              onChange={handleChange}
            />
          ) : (
            <textarea
              name="comando"
              className="glass-input h-48 font-mono text-blue-300 leading-relaxed"
              placeholder="public static void main..."
              value={form.comando}
              onChange={handleChange}
            />
          )}

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
