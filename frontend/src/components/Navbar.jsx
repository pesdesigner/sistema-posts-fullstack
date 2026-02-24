import { Link } from 'react-router-dom';

export function Navbar() {
  // Busca o usuário salvo no login
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  const logout = () => {
    localStorage.removeItem('usuarioLogado');
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 z-50 shadow-lg px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-white">Linha de<span className="text-blue-300"> Comando</span></Link>
      
      <div className="flex gap-6 items-center">
        <Link to="/" className="text-white">Feed</Link>
        
        {/* Só mostra 'Postar' se estiver logado (Admin ou Colab) */}
        {usuario && <Link to="/postar" className="text-white">Postar</Link>}

        {usuario && <Link to="/meus-posts" className="text-white">Meus Posts</Link>}

        {/* SÓ MOSTRA 'ADMINS' SE O PERFIL FOR ADMIN */}
        {usuario?.perfil === 'ADMIN' && (
          <Link to="/usuarios" className="text-blue-300 font-bold">Gerenciar Admins</Link>
        )}

        {usuario ? (
          <button onClick={logout} className="text-red-400 text-sm">Sair ({usuario.nome})</button>
        ) : (
          <Link to="/login" className="text-white bg-blue-600 px-4 py-1 rounded">Login</Link>
        )}
      </div>
    </nav>
  );
}
