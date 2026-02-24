import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export function Cadastro() {
  // Estado inicial do formulário
  const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'COLABORADOR' });

  // Hooks para navegação e captura de ID da URL
  const { id } = useParams();
  const navigate = useNavigate();

  // Busca dados do usuário caso seja uma EDIÇÃO
  useEffect(() => {
    if (id) {
      api.get(`/usuarios/${id}`)
        .then(res => {
          // Preenche o form, mas mantém a senha vazia por segurança
          setForm({ nome: res.data.nome, email: res.data.email, perfil: res.data.perfil, senha: '' });
        })
        .catch(err => {
          console.error("Erro ao buscar usuário:", err);
          alert("Usuário não encontrado.");
          navigate('/');
        });
    }
  }, [id, navigate]);

  // Função para lidar com o envio (Salvar ou Atualizar)
  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Modo Edição: PUT
        await api.put(`/usuarios/${id}`, form);
        alert("Usuário atualizado com sucesso!");
      } else {
        // Modo Cadastro: POST
        await api.post('/usuarios', form);
        alert("Usuário cadastrado com sucesso!");
      }
      navigate('/usuarios'); // Volta para a listagem
    } catch (err) {
      const erroData = err.response?.data;

      // Se o Spring enviou uma lista de erros de validação (BindingResult)
      if (erroData?.errors && Array.isArray(erroData.errors)) {
        const mensagens = erroData.errors.map(e => `${e.field}: ${e.defaultMessage}`).join('\n');
        alert("Erro de Validação:\n" + mensagens);
      } else {
        // Caso seja um erro simples (como e-mail duplicado ou erro 500)
        const msg = typeof erroData === 'string' ? erroData : (erroData?.message || "Erro desconhecido");
        alert("Erro: " + msg);
      }
      console.error("Detalhes do erro no F12:", erroData);
    }
  };

  // Função genérica para atualizar o estado dos inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <div className="page-container">
      <div className="glass-card">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          {id ? 'Editar Usuário' : 'Novo Cadastro'}
        </h1>

        <form onSubmit={handleSalvar} className="flex flex-col gap-4">
          <input
            name="nome"
            className="glass-input"
            value={form.nome}
            onChange={handleChange}
            placeholder="Nome Completo"
            required
          />

          <input
            name="email"
            type="email"
            className="glass-input"
            value={form.email}
            onChange={handleChange}
            placeholder="E-mail"
            required
          />

          <input
            name="senha"
            type="password"
            className="glass-input"
            value={form.senha}
            onChange={handleChange}
            placeholder={id ? "Deixe em branco para manter a atual" : "Senha"}
            required={!id} // Obrigatório apenas se NÃO tiver ID (cadastro novo)
          />

          <div>
            <label className="text-white/60 text-sm ml-1">Perfil de Acesso</label>
            <select
              name="perfil"
              className="glass-input mt-1 cursor-pointer"
              value={form.perfil}
              onChange={handleChange}
              required
            >
              <option value="COLABORADOR" className="text-black">Colaborador</option>
              <option value="ADMIN" className="text-black">Administrador</option>
            </select>
          </div>


          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => navigate('/usuarios')}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {id ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}