import { Navigate } from 'react-router-dom';

export function ProtectedRoute({ children, roleRequired }) {
  const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

  // 1. Se não estiver logado, vai para o Login
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  // 2. Se a rota exige um perfil específico (ex: ADMIN) e o usuário não tem
  if (roleRequired && usuario.perfil !== roleRequired) {
    alert("Acesso negado: Você não tem permissão para acessar esta página.");
    return <Navigate to="/" replace />;
  }

  // 3. Se estiver tudo OK, renderiza a página (children)
  return children;
}
