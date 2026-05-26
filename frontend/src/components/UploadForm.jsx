import { useState } from 'react';
import { api } from '../services/api';

export default function UploadForm({ onUploadSuccess }) {
  const [type, setType] = useState('youtube');
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
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
      setSuccess('✓ Vídeo adicionado com sucesso!');
      onUploadSuccess();
      setFile(null);
      setUrl('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      const backendError = error.response?.data?.error || error.message;
      alert(`Erro: ${backendError}`);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '16px',
      padding: '2rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
      marginBottom: '2.5rem',
      border: '1px solid rgba(255, 255, 255, 0.5)',
      backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.6s ease-out'
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{
          marginTop: 0,
          marginBottom: '0.5rem',
          color: '#111',
          fontSize: '1.8rem',
          fontWeight: '700'
        }}>
          + Adicionar Vídeo
        </h2>
        <p style={{
          margin: 0,
          color: '#666',
          fontSize: '0.95rem'
        }}>
          Escolha entre baixar do YouTube ou fazer upload de um arquivo local
        </p>
      </div>

      {/* Tab Selection */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
        background: '#f5f7fa',
        padding: '0.5rem',
        borderRadius: '12px',
        width: 'fit-content'
      }}>
        {['youtube', 'local'].map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              borderRadius: '8px',
              background: type === t ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: type === t ? '#fff' : '#666',
              fontWeight: type === t ? '600' : '500',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontSize: '0.95rem'
            }}
          >
            {t === 'youtube' ? '📺 YouTube' : '📁 Arquivo Local'}
          </button>
        ))}
      </div>

      <form onSubmit={handleUpload} style={{ display: 'grid', gap: '1.2rem' }}>
        {type === 'local' ? (
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#667eea',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Selecione um arquivo de vídeo
            </label>
            <div style={{
              position: 'relative',
              border: '2px dashed #e5e7eb',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: file ? 'rgba(102, 126, 234, 0.05)' : 'transparent'
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
            }}
            onDragLeave={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.background = file ? 'rgba(102, 126, 234, 0.05)' : 'transparent';
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = '#e5e7eb';
              if (e.dataTransfer.files.length > 0) {
                setFile(e.dataTransfer.files[0]);
              }
            }}>
              <input
                type="file"
                accept="video/mp4,video/x-m4v,video/*"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📹</div>
                <div style={{ fontWeight: '600', color: '#111', marginBottom: '0.25rem' }}>
                  {file ? file.name : 'Arraste seu vídeo aqui'}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#999' }}>
                  ou clique para selecionar
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#667eea',
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              URL do YouTube
            </label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required={type === 'youtube'}
              style={{
                width: '100%',
                padding: '0.95rem 1rem',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '1rem',
                backgroundColor: '#fafbfc',
                transition: 'all 0.3s ease'
              }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (type === 'local' && !file) || (type === 'youtube' && !url)}
          style={{
            padding: '1.1rem 1.5rem',
            border: 'none',
            borderRadius: '12px',
            background: loading || (type === 'local' && !file) || (type === 'youtube' && !url)
              ? '#d1d5db'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: '700',
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '0.5rem',
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? '⏳ Processando...' : '⬆️ ' + (type === 'youtube' ? 'Baixar do YouTube' : 'Fazer Upload')}
        </button>
      </form>

      {success && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#ecfdf5',
          color: '#065f46',
          borderRadius: '12px',
          fontSize: '0.95rem',
          border: '1px solid #86efac',
          animation: 'fadeIn 0.3s ease'
        }}>
          {success}
        </div>
      )}
    </div>
  );
}
