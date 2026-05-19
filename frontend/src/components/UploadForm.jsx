import { useState } from 'react';
import { api } from '../services/api';

export default function UploadForm({ onUploadSuccess }) {
  const [type, setType] = useState('local');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (type === 'local' && file) {
        const formData = new FormData();
        formData.append('video', file);
        await api.post('/videos/upload-local', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else if (type === 'youtube' && url) {
        await api.post('/videos/upload-youtube', { url });
      }
      onUploadSuccess();
      setFile(null);
      setUrl('');
      alert('Upload concluído com sucesso!');
    } catch (error) {
      const backendError = error.response?.data?.error || error.message;
      alert(`Erro no backend: ${backendError}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f9f9f9', border: '2px solid #333', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
      <h2 style={{ marginTop: 0 }}>Adicionar Novo Vídeo</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '20px', cursor: 'pointer' }}>
          <input type="radio" checked={type === 'local'} onChange={() => setType('local')} /> 
          {' '}Arquivo Local
        </label>
        <label style={{ cursor: 'pointer' }}>
          <input type="radio" checked={type === 'youtube'} onChange={() => setType('youtube')} /> 
          {' '}Link do YouTube
        </label>
      </div>

      <form onSubmit={handleUpload} style={{ display: 'block' }}>
        <div style={{ marginBottom: '15px' }}>
          {type === 'local' ? (
            <input 
              type="file" 
              accept="video/mp4,video/x-m4v,video/*" 
              onChange={(e) => setFile(e.target.files[0])} 
              required 
              style={{ display: 'block', width: '100%', padding: '10px', border: '1px solid #ccc' }}
            />
          ) : (
            <input 
              type="url" 
              placeholder="Cole o link do YouTube aqui..." 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              required 
              style={{ display: 'block', width: '95%', padding: '10px', border: '1px solid #ccc' }}
            />
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            backgroundColor: loading ? '#ccc' : '#007bff', 
            color: 'white', 
            padding: '12px 24px', 
            border: 'none', 
            borderRadius: '4px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Enviando e processando...' : 'Fazer Upload do Vídeo'}
        </button>
      </form>
    </div>
  );
}