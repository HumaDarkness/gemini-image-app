
import { useState } from 'react';
import { analyzeImage } from '../services/geminiService';

const AnalyzeImage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPrompt('');
      setError('');
    }
  };

  const handleAnalyzeClick = async () => {
    if (!image) {
      setError('Por favor, selecciona una imagen primero.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const generatedPrompt = await analyzeImage(image);
      setPrompt(generatedPrompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-3 font-orbitron">Analizar Imagen</h2>
      <p className="mb-4">Sube una imagen y la IA generará un prompt descriptivo para crear imágenes similares.</p>
      
      <div className="mb-3">
        <input className="form-control" type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      {image && (
        <div className='text-center my-4'>
            <img src={URL.createObjectURL(image)} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '300px' }}/>
        </div>
      )}

      <div className="d-grid">
        <button className="btn btn-primary btn-lg" onClick={handleAnalyzeClick} disabled={!image || loading}>
          {loading ? 'Analizando...' : 'Analizar'}
        </button>
      </div>

      {error && <div className="alert alert-danger mt-4">{error}</div>}

      {prompt && (
        <div className="mt-4">
          <h4>Prompt Generado:</h4>
          <textarea 
            className="form-control" 
            rows={5} 
            value={prompt} 
            readOnly 
          />
        </div>
      )}
    </div>
  );
};

export default AnalyzeImage;
