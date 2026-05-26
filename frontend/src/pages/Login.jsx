import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError('Credenciais inválidas. Tente admin / 1234');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      animation: 'fadeIn 0.8s ease-in'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: '3.5rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            YouTube²
          </div>
          <p style={{ margin: '0.5rem 0 0', color: '#666', fontSize: '0.9rem' }}>
            Seu clone do YouTube moderno
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1.2rem' }}>
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#764ba2', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Usuário
            </label>
            <input
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.95rem 1rem',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '1rem',
                backgroundColor: '#fafbfc',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.backgroundColor = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.backgroundColor = '#fafbfc';
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '600', color: '#764ba2', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Senha
            </label>
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.95rem 1rem',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '1rem',
                backgroundColor: '#fafbfc',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#667eea';
                e.target.style.backgroundColor = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.backgroundColor = '#fafbfc';
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem 1.2rem',
              borderRadius: '12px',
              border: 'none',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              marginTop: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {error && (
          <div style={{
            marginTop: '1rem',
            padding: '1rem',
            background: '#fee2e2',
            color: '#991b1b',
            borderRadius: '12px',
            fontSize: '0.9rem',
            border: '1px solid #fecaca',
            animation: 'fadeIn 0.3s ease'
          }}>
            {error}
          </div>
        )}

        <p style={{ marginTop: '1.5rem', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
          Demo: admin / 1234
        </p>
      </div>
    </div>
  );
}
