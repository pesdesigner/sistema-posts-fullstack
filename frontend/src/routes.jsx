import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Cadastro } from './pages/Cadastro';
import { Postar } from './pages/Postar';
import { UsuarioLista } from './pages/UsuarioLista'; // Se você manteve a lista de usuários

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastrar" element={<Cadastro />} />
      <Route path="/editar/:id" element={<Cadastro />} />
      <Route path="/postar" element={<Postar />} />
      <Route path="/usuarios" element={<UsuarioLista />} />
    </Routes>
  );
}
