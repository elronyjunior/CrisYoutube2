import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import UploadForm from '../components/UploadForm';
import VideoList from '../components/VideoList';

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      const res = await api.get('/videos');
      setVideos(res.data);
    } catch (error) {
      console.error('Erro ao buscar vídeos', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      color: '#111',
      padding: '0'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem 1rem',
        boxShadow: '0 10px 40px rgba(102, 126, 234, 0.2)',
        animation: 'slideInDown 0.6s ease-out'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem'
        }}>
          <div>
            <h1 style={{
              margin: 0,
              fontSize: '2.8rem',
              fontWeight: '800',
              color: '#fff',
              letterSpacing: '-0.5px'
            }}>
              YouTube²
            </h1>
            <p style={{
              margin: '0.5rem 0 0',
              color: 'rgba(255, 255, 255, 0.9)',
              maxWidth: '500px',
              fontSize: '1rem'
            }}>
              Baixe vídeos do YouTube e gerencie sua biblioteca pessoal
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              color: '#fff',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '12px',
              padding: '0.85rem 1.5rem',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.35)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.8)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.25)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            }}
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        <UploadForm onUploadSuccess={fetchVideos} />
        <VideoList videos={videos} loading={loading} />
      </div>
    </div>
  );
}
