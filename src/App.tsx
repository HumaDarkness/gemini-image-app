
import { useState } from 'react';
import './App.css';
import AnalyzeImage from './components/AnalyzeImage';
import ImprovePrompt from './components/ImprovePrompt';
import PromptVariations from './components/PromptVariations';
import ColorPaletteAnalyzer from './components/ColorPaletteAnalyzer';
import Brainstormer from './components/Brainstormer';
import ImageNarrator from './components/ImageNarrator';
import Paywall from './components/Paywall';

type Tab = 'analyze' | 'edit' | 'improve' | 'create' | 'variations' | 'palette' | 'brainstorm' | 'narrator';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('analyze');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'analyze':
        return <AnalyzeImage />;
      case 'edit':
        return <Paywall featureName="Edición de Imagen" />;
      case 'improve':
        return <ImprovePrompt />;
      case 'create':
        return <Paywall featureName="Creación de Imagen" />;
      case 'variations':
        return <PromptVariations />;
      case 'palette':
        return <ColorPaletteAnalyzer />;
      case 'brainstorm':
        return <Brainstormer />;
      case 'narrator':
        return <ImageNarrator />;
      default:
        return <AnalyzeImage />;
    }
  };

  return (
    <div className="App container mt-4">
      <header className="App-header text-center mb-4">
        <h1 className="display-4 font-orbitron neon-text">Gemini Image App</h1>
        <p className="lead">Herramientas de IA para la generación y edición de imágenes</p>
      </header>

      <nav className="nav nav-pills justify-content-center mb-4">
        <button 
          className={`nav-link ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}>Analizar Imagen</button>
        <button 
          className={`nav-link disabled`}
          title="Esta función requiere un plan de pago en Google AI."
          style={{cursor: 'not-allowed'}}
          onClick={() => {}}>
            Editar Imagen <span className="badge bg-info text-dark">Pro</span>
        </button>
        <button 
          className={`nav-link ${activeTab === 'improve' ? 'active' : ''}`}
          onClick={() => setActiveTab('improve')}>Mejorar Prompt</button>
        <button 
          className={`nav-link disabled`}
          title="Esta función requiere un plan de pago en Google AI."
          style={{cursor: 'not-allowed'}}
          onClick={() => {}}>
            Crear Imagen <span className="badge bg-info text-dark">Pro</span>
        </button>
        <button 
          className={`nav-link ${activeTab === 'variations' ? 'active' : ''}`}
          onClick={() => setActiveTab('variations')}>Variaciones (Pro)</button>
        <button 
          className={`nav-link ${activeTab === 'palette' ? 'active' : ''}`}
          onClick={() => setActiveTab('palette')}>Paleta de Colores</button>
        <button 
          className={`nav-link ${activeTab === 'brainstorm' ? 'active' : ''}`}
          onClick={() => setActiveTab('brainstorm')}>Lluvia de Ideas</button>
        <button 
          className={`nav-link ${activeTab === 'narrator' ? 'active' : ''}`}
          onClick={() => setActiveTab('narrator')}>Narrador de Imágenes</button>
      </nav>

      <main className="card bg-dark-transparent neon-border">
        <div className="card-body">
          {renderTabContent()}
        </div>
      </main>

      <footer className="text-center mt-4 text-muted">
        <p>&copy; 2025 - Creado con Gemini</p>
      </footer>
    </div>
  );
}

export default App;
