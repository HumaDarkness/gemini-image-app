
import { useState } from 'react';
import { generatePromptVariations } from '../services/geminiService';

const PromptVariations = () => {
  const [idea, setIdea] = useState<string>('');
  const [variations, setVariations] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerateClick = async () => {
    if (!idea) {
      setError('Por favor, introduce una idea.');
      return;
    }
    setLoading(true);
    setError('');
    setVariations([]);
    try {
      const result = await generatePromptVariations(idea);
      setVariations(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-3 font-orbitron">Generador de Variaciones (Pro)</h2>
      <p className="mb-4">Usa el poder del modelo Pro para expandir una idea simple en múltiples prompts creativos y detallados.</p>
      
      <div className="mb-3">
        <label htmlFor="ideaInput" className="form-label">Tu Idea Simple:</label>
        <input 
          id="ideaInput"
          type="text" 
          className="form-control" 
          value={idea} 
          onChange={(e) => setIdea(e.target.value)}
          placeholder='Ej: un perro con un sombrero'
        />
      </div>

      <div className="d-grid">
        <button className="btn btn-primary btn-lg" onClick={handleGenerateClick} disabled={!idea || loading}>
          {loading ? 'Generando Variaciones...' : 'Generar'}
        </button>
      </div>

      {error && <div className="alert alert-danger mt-4">{error}</div>}

      {loading && (
        <div className="text-center mt-4">
            <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
      )}

      {variations.length > 0 && (
        <div className="mt-4">
          <h4>Prompts Generados:</h4>
          <ul className="list-group">
            {variations.map((prompt, index) => (
              <li key={index} className="list-group-item bg-dark text-light">{prompt}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PromptVariations;
