
import { useState } from 'react';
import { analyzeColorPalette } from '../services/geminiService';
import type { ColorInfo } from '../services/geminiService';

const ColorPaletteAnalyzer = () => {
  const [image, setImage] = useState<File | null>(null);
  const [palette, setPalette] = useState<ColorInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copiedHex, setCopiedHex] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPalette([]);
      setError('');
      setCopiedHex('');
    }
  };

  const handleAnalyzeClick = async () => {
    if (!image) {
      setError('Por favor, selecciona una imagen primero.');
      return;
    }
    setLoading(true);
    setError('');
    setPalette([]);
    try {
      const generatedPalette = await analyzeColorPalette(image);
      setPalette(generatedPalette);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(''), 2000); // Reset after 2 seconds
  };

  return (
    <div>
      <h2 className="mb-3 font-orbitron">Analizador de Paleta de Colores</h2>
      <p className="mb-4">Sube una imagen y la IA identificará los colores dominantes y te dará sus códigos HEX.</p>
      
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
          {loading ? 'Analizando Paleta...' : 'Analizar Colores'}
        </button>
      </div>

      {error && <div className="alert alert-danger mt-4">{error}</div>}

      {palette.length > 0 && (
        <div className="mt-4">
          <h4>Paleta de Colores Extraída:</h4>
          <div className="palette-grid mt-3">
            {palette.map((color, index) => (
              <div key={index} className="text-center m-2" style={{cursor: 'pointer'}} onClick={() => copyToClipboard(color.hex)}>
                <div style={{ backgroundColor: `#${color.hex.replace('#', '')}`, width: '100px', height: '100px' }} className="rounded neon-border"></div>
                <p className="mt-2 mb-0">{color.name}</p>
                <p className="text-muted">{color.hex}</p>
                {copiedHex === color.hex && <span className="badge bg-success">Copiado!</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPaletteAnalyzer;
