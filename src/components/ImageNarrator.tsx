
import { useState } from 'react';
import { narrateImage } from '../services/geminiService';

type NarrativeFormat = 'poem' | 'story';

const ImageNarrator = () => {
  const [image, setImage] = useState<File | null>(null);
  const [format, setFormat] = useState<NarrativeFormat>('story');
  const [narrative, setNarrative] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setNarrative('');
      setError('');
    }
  };

  const handleGenerateClick = async () => {
    if (!image) {
      setError('Por favor, selecciona una imagen primero.');
      return;
    }
    setLoading(true);
    setError('');
    setNarrative('');
    try {
      const resultText = await narrateImage(image, format);
      setNarrative(resultText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-3 font-orbitron">Narrador de Imágenes</h2>
      <p className="mb-4">Sube una imagen y la IA escribirá una pieza creativa inspirada en ella. ¿Qué te apetece hoy?</p>
      
      <div className="row g-3 align-items-center">
        <div className="col-md-6">
            <input className="form-control" type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="col-md-6">
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="formatOptions" id="storyRadio" value="story" checked={format === 'story'} onChange={() => setFormat('story')} />
                <label className="form-check-label" htmlFor="storyRadio">Micro-Relato</label>
            </div>
            <div className="form-check form-check-inline">
                <input className="form-check-input" type="radio" name="formatOptions" id="poemRadio" value="poem" checked={format === 'poem'} onChange={() => setFormat('poem')} />
                <label className="form-check-label" htmlFor="poemRadio">Poema</label>
            </div>
        </div>
      </div>

      {image && (
        <div className='text-center my-4'>
            <img src={URL.createObjectURL(image)} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '300px' }}/>
        </div>
      )}

      <div className="d-grid mt-3">
        <button className="btn btn-primary btn-lg" onClick={handleGenerateClick} disabled={!image || loading}>
          {loading ? 'Escribiendo...' : 'Generar Narración'}
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

      {narrative && (
        <div className="mt-4">
          <h4>Resultado Creativo:</h4>
          <div className="card card-body" style={{ whiteSpace: 'pre-wrap' }}>
            {narrative}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageNarrator;
