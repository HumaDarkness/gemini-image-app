
import { useState } from 'react';
import { editImage } from '../services/geminiService';

const EditImage = () => {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setEditedImage('');
      setError('');
    }
  };

  const handleEditClick = async () => {
    if (!image || !prompt) {
      setError('Por favor, selecciona una imagen e introduce una instrucción.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await editImage(image, prompt);
      setEditedImage(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-3 font-orbitron">Editar Imagen (Función en Desarrollo)</h2>
      <p className="mb-4">Sube una imagen, da una instrucción y la IA la modificará. (Actualmente, esta función solo devuelve la imagen original).</p>
      
      <div className="row g-3">
        <div className="col-md-6">
          <label htmlFor="imageUpload" className="form-label">1. Sube una imagen:</label>
          <input id="imageUpload" className="form-control" type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div className="col-md-6">
          <label htmlFor="promptInput" className="form-label">2. Escribe la edición:</label>
          <input id="promptInput" type="text" className="form-control" value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Ej: haz el cielo nocturno"/>
        </div>
      </div>

      {image && (
        <div className='text-center my-4'>
            <p>Imagen Original:</p>
            <img src={URL.createObjectURL(image)} alt="Original Preview" className="img-fluid rounded" style={{ maxHeight: '300px' }}/>
        </div>
      )}

      <div className="d-grid mt-3">
        <button className="btn btn-primary btn-lg" onClick={handleEditClick} disabled={!image || !prompt || loading}>
          {loading ? 'Editando...' : 'Editar'}
        </button>
      </div>

      {error && <div className="alert alert-danger mt-4">{error}</div>}

      {editedImage && (
        <div className="mt-4 text-center">
          <h4>Imagen Editada:</h4>
          <img src={editedImage} alt="Edited Result" className="img-fluid rounded" />
        </div>
      )}
    </div>
  );
};

export default EditImage;
