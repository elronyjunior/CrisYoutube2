import fs from 'fs';

const dirs = [
  'src/components',
  'src/pages',
  'src/services'
];

dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`📂 Pasta garantida: ${dir}`);
});

const files = {
  'src/services/api.js': `import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});`,

  'src/App.jsx': `import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;`,

  'src/pages/Login.jsx': `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas. Tente admin / 1234');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '400px', margin: '0 auto' }}>
      <h1>YouTube² Login</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          placeholder="Usuário" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={{ padding: '0.5rem' }}
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem', cursor: 'pointer' }}>Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}`,

  'src/pages/Dashboard.jsx': `import { useEffect, useState } from 'react';
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
}`,

  'src/components/UploadForm.jsx': `import { useState } from 'react';
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
      alert('Erro no upload. Verifique o console.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h2>Adicionar Novo Vídeo</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>
          <input type="radio" checked={type === 'local'} onChange={() => setType('local')} /> 
          Arquivo Local
        </label>
        <label>
          <input type="radio" checked={type === 'youtube'} onChange={() => setType('youtube')} /> 
          Link do YouTube
        </label>
      </div>

      <form onSubmit={handleUpload} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {type === 'local' ? (
          <input type="file" accept="video/mp4,video/x-m4v,video/*" onChange={(e) => setFile(e.target.files[0])} required />
        ) : (
          <input 
            type="url" 
            placeholder="https://www.youtube.com/watch?v=..." 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            style={{ flex: 1, padding: '0.5rem' }} 
            required 
          />
        )}
        <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Enviando...' : 'Fazer Upload'}
        </button>
      </form>
    </div>
  );
}`,

  'src/components/VideoList.jsx': `export default function VideoList({ videos }) {
  if (videos.length === 0) {
    return <p>Nenhum vídeo cadastrado ainda.</p>;
  }

  return (
    <div>
      <h2>Seus Vídeos</h2>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {videos.map(video => (
          <div key={video.id} style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{video.title}</h3>
            <p style={{ margin: '0', fontSize: '0.9rem', color: '#666' }}>
              <strong>Arquivo:</strong> {video.filename} <br/>
              <strong>Enviado por:</strong> {video.uploader} <br/>
              <strong>Data:</strong> {new Date(video.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}`,

  'src/main.jsx': `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
};

Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(filepath, content.trim(), 'utf-8');
  console.log(`📄 Arquivo criado: ${filepath}`);
});

console.log('\n✅ Frontend arquitetado! Pode deletar este script e rodar: npm run dev');