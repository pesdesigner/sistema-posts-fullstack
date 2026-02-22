import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppRoutes } from './routes'; // Importa as rotas separadas

function App() {
  return (
    <BrowserRouter>
      {/* Estrutura Global com Gradiente */}
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 to-indigo-900">
        <Navbar />
        
        <main className="flex-grow pt-24 pb-12">
          {/* Chama o componente de rotas aqui */}
          <AppRoutes />
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
