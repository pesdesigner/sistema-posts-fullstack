import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Cadastro } from './pages/Cadastro';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      {/* Container principal com fundo gradiente para o site todo */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-indigo-900">
        <Navbar />
        
        {/* O 'flex-grow' faz o conteúdo ocupar o espaço e empurrar o footer para baixo */}
        <main className="flex-grow pt-24 pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cadastrar" element={<Cadastro />} />
            <Route path="/editar/:id" element={<Cadastro />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;

