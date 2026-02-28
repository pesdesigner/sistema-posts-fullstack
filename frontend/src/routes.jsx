import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Cadastro } from './pages/Cadastro';
import { Postar } from './pages/Postar';
import { UsuarioLista } from './pages/UsuarioLista';
import { Login } from './pages/Login';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MeusPosts } from './pages/MeusPosts';
import { NotFound } from './pages/NotFound';
import { AdminDashboard } from './pages/AdminDashboard';

export function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* Rotas de Colaborador e Admin (Qualquer logado acessa) */}
      <Route path="/postar" element={
        <ProtectedRoute>
          <Postar />
        </ProtectedRoute>
      } />

      <Route path="/editar-post/:id" element={
        <ProtectedRoute>
          <Postar />
        </ProtectedRoute>
      } />

      <Route path="/meus-posts" element={
        <ProtectedRoute>
          <MeusPosts />
        </ProtectedRoute>
      } />

      {/* Rotas EXCLUSIVAS de Admin */}
      <Route path="/usuarios" element={
        <ProtectedRoute roleRequired="ADMIN">
          <UsuarioLista />
        </ProtectedRoute>
      } />

      <Route path="/cadastrar" element={
        <ProtectedRoute roleRequired="ADMIN">
          <Cadastro />
        </ProtectedRoute>
      } />

      <Route path="/editar/:id" element={
        <ProtectedRoute roleRequired="ADMIN">
          <Cadastro />
        </ProtectedRoute>
      } />

      <Route path="/admin/dashboard" element={
        <ProtectedRoute roleRequired="ADMIN">
          <AdminDashboard />
        </ProtectedRoute>
      } />


      {/* ESTA DEVE SER SEMPRE A ÚLTIMA ROTA */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

