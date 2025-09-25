
import { useState } from 'react';
import { brainstormIdeas } from '../services/geminiService';

interface BrainstormResult {
  [category: string]: string[];
}

const parseBrainstormResult = (text: string): BrainstormResult => {
  const lines = text.split('\n');
  const result: BrainstormResult = {};
  let currentCategory = '';

  lines.forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('### ')) {
      currentCategory = trimmedLine.replace('### ', '');
      result[currentCategory] = [];
    } else if (currentCategory && trimmedLine.length > 0) {
      const items = trimmedLine.split(',').map(item => item.trim());
      result[currentCategory].push(...items);
    }
  });

  return result;
};

const Brainstormer = () => {
  const [keyword, setKeyword] = useState<string>('');
  const [ideas, setIdeas] = useState<BrainstormResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerateClick = async () => {
    if (!keyword) {
      setError('Por favor, introduce una palabra clave.');
      return;
    }
    setLoading(true);
    setError('');
    setIdeas(null);
    try {
      const resultText = await brainstormIdeas(keyword);
      const parsedResult = parseBrainstormResult(resultText);
      setIdeas(parsedResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-3 font-orbitron">Lluvia de Ideas Creativas</h2>
      <p className="mb-4">Introduce una palabra o concepto y la IA generará listas de ideas categorizadas para inspirar tus prompts.</p>
      
      <div className="mb-3">
        <label htmlFor="keywordInput" className="form-label">Tu Palabra Clave:</label>
        <input 
          id="keywordInput"
          type="text" 
          className="form-control" 
          value={keyword} 
          onChange={(e) => setKeyword(e.target.value)}
          placeholder='Ej: Dragón, Bosque, Futurista'
        />
      </div>

      <div className="d-grid">
        <button className="btn btn-primary btn-lg" onClick={handleGenerateClick} disabled={!keyword || loading}>
          {loading ? 'Generando Ideas...' : 'Generar'}
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

      {ideas && (
        <div className="mt-4">
          <h4>Ideas para "{keyword}":</h4>
          <div className="row">
            {Object.entries(ideas).map(([category, items]) => (
              <div key={category} className="col-md-6 col-lg-3 mb-4">
                <div className="card h-100">
                  <div className="card-header font-orbitron">{category}</div>
                  <ul className="list-group list-group-flush">
                    {items.map((item, index) => (
                      <li key={index} className="list-group-item">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Brainstormer;
