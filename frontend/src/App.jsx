import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AppRoutes } from './routes'; // Importa as rotas separadas

function App() {
  return (
    <BrowserRouter>
      {/* Configuração do Toast */}
            <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.8)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
          },
        }}
      />
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
