import { NavLink, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export function Navbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioLogado');
    toast.success("Logout realizado!");
    navigate('/login');
  };

  // Estilo base dos links com lógica de "Ativo"
  const navClass = ({ isActive }) =>
    `transition-all duration-300 text-sm uppercase tracking-wider font-semibold ${isActive
      ? 'text-blue-300 border-b-2 border-blue-300 pb-1'
      : 'text-white/70 hover:text-white'
    }`;

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 z-50 shadow-xl px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-black text-white tracking-tighter">
        LINHA DE <span className="text-blue-400">COMANDO</span>
      </Link>

      <div className="flex gap-8 items-center">
        <NavLink to="/" className={navClass}>Feed</NavLink>

        {usuario && (
          <>
            <NavLink to="/postar" className={navClass}>Postar</NavLink>
            <NavLink to="/meus-posts" className={navClass}>Meus Snippets</NavLink>
          </>
        )}

        {usuario?.perfil === 'ADMIN' && (
          <>
            <NavLink to="/usuarios" className={navClass}>Usuários</NavLink>
            <NavLink to="/admin/dashboard" className={navClass}>Dashboard</NavLink>
          </>
        )}

        <div className="flex items-center gap-4 ml-4 pl-4 border-l border-white/10">
          {usuario ? (
            <div className="flex items-center gap-3">
              {/* Avatar Dinâmico */}
              <img
                src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${usuario.nome}`}
                alt="avatar"
                className="w-10 h-10 rounded-full border-2 border-blue-400/30 bg-white/10 p-1 shadow-lg"
              />


              {/* Nome e Botão Sair */}
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Usuário</span>
                <button
                  onClick={logout}
                  className="text-red-400 hover:text-red-300 text-xs font-bold transition-colors"
                >
                  SAIR ({usuario.nome.split(' ')[0]})
                </button>
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="bg-blue-600 hover:bg-blue-500 px-5 py-1.5 rounded-lg text-xs transition-all font-bold shadow-lg"
            >
              LOGIN
            </NavLink>
          )}
        </div>


      </div>
    </nav>
  );
}
