import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="page-container text-center gap-4">
      <h1 className="text-9xl font-black text-white/20">404</h1>
      <h2 className="text-3xl font-bold text-white uppercase tracking-tighter">Linha de Comando</h2>
      <p className="text-white/60 mb-4">O snippet que você procura foi para outra dimensão.</p>
      {/* O w-fit aqui garante que o botão não estique */}
      <Link to="/" className="btn-primary mx-auto"> 
        Voltar para a Home
      </Link>
    </div>
  );
}

