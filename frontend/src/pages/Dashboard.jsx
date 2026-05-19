import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import UploadForm from '../components/UploadForm';
import VideoList from '../components/VideoList';

export default function Dashboard() {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();

  const fetchVideos = async () => {
    try {
      const res = await api.get('/videos');
      setVideos(res.data);
    } catch (error) {
      console.error('Erro ao buscar vídeos', error);
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
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>YouTube² Dashboard</h1>
        <button onClick={handleLogout} style={{ padding: '0.5rem' }}>Sair</button>
      </div>
      <UploadForm onUploadSuccess={fetchVideos} />
      <hr style={{ margin: '2rem 0' }} />
      <VideoList videos={videos} />
    </div>
  );
}