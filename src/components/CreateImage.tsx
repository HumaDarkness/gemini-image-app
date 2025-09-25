
import { useState } from 'react';
import { createImage } from '../services/geminiService';

const CreateImage = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleCreateClick = async () => {
    if (!prompt) {
      setError('Por favor, introduce un prompt.');
      return;
    }
    setLoading(true);
    setError('');
    setGeneratedImage('');
    try {
      const result = await createImage(prompt);
      setGeneratedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-3 font-orbitron">Crear Imagen desde Cero</h2>
      <p className="mb-4">Escribe una descripción detallada de la imagen que quieres crear. (Nota: esta función está sujeta a los mismos límites de cuota que la edición de imágenes).</p>
      
      <div className="mb-3">
        <label htmlFor="inputPrompt" className="form-label">Tu Prompt:</label>
        <textarea 
          id="inputPrompt"
          className="form-control" 
          rows={4} 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Ej: Un astronauta montando a caballo en Marte, estilo fotorrealista'
        />
      </div>

      <div className="d-grid">
        <button className="btn btn-primary btn-lg" onClick={handleCreateClick} disabled={!prompt || loading}>
          {loading ? 'Generando...' : 'Crear Imagen'}
        </button>
      </div>

      {error && <div className="alert alert-danger mt-4">{error}</div>}

      {loading && (
        <div className="text-center mt-4">
            <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className='mt-2'>Generando imagen... esto puede tardar un momento.</p>
        </div>
      )}

      {generatedImage && (
        <div className="mt-4 text-center">
          <h4>Imagen Generada:</h4>
          <img src={generatedImage} alt="Generated Result" className="img-fluid rounded neon-border" />
        </div>
      )}
    </div>
  );
};

export default CreateImage;
