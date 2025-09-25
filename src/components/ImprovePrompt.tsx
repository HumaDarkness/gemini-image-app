
import { useState } from 'react';
import { improvePrompt } from '../services/geminiService';

const ImprovePrompt = () => {
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [improvedPrompt, setImprovedPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImproveClick = async () => {
    if (!inputPrompt) {
      setError('Por favor, introduce un prompt.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const generatedPrompt = await improvePrompt(inputPrompt);
      setImprovedPrompt(generatedPrompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-3 font-orbitron">Mejorar Prompt</h2>
      <p className="mb-4">Escribe una idea o un prompt simple y la IA lo refinará para obtener mejores resultados en los generadores de imágenes.</p>
      
      <div className="mb-3">
        <label htmlFor="inputPrompt" className="form-label">Tu Prompt:</label>
        <textarea 
          id="inputPrompt"
          className="form-control" 
          rows={3} 
          value={inputPrompt} 
          onChange={(e) => setInputPrompt(e.target.value)}
        />
      </div>

      <div className="d-grid">
        <button className="btn btn-primary btn-lg" onClick={handleImproveClick} disabled={!inputPrompt || loading}>
          {loading ? 'Mejorando...' : 'Mejorar'}
        </button>
      </div>

      {error && <div className="alert alert-danger mt-4">{error}</div>}

      {improvedPrompt && (
        <div className="mt-4">
          <h4>Prompt Mejorado:</h4>
          <textarea 
            className="form-control" 
            rows={5} 
            value={improvedPrompt} 
            readOnly 
          />
        </div>
      )}
    </div>
  );
};

export default ImprovePrompt;
