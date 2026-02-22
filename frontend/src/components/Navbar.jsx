import { Link } from 'react-router-dom';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white/10 backdrop-blur-md border-b border-white/20 z-50 shadow-lg">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white tracking-tight hover:text-blue-200 transition">
          Linha de <span className="text-blue-300"> Comando</span>
        </Link>
          <div className="flex gap-6">
            <Link to="/" className="...">Feed</Link>
            <Link to="/postar" className="...">Postar</Link>
            <Link to="/usuarios" className="...">Admins</Link>
          </div>
      </div>
    </nav>
  );
}