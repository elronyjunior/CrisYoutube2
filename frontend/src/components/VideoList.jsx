import { useState } from 'react';

const PLACEHOLDER = 'https://via.placeholder.com/640x360/667eea/ffffff?text=Sem+Miniatura';
const VIDEO_BASE_URL = 'http://localhost:3000/uploads/videos';

export default function VideoList({ videos, loading }) {
  const [selectedVideo, setSelectedVideo] = useState(videos[0] || null);
  const currentVideo = selectedVideo || videos[0] || null;
  const currentSource = currentVideo ? `${VIDEO_BASE_URL}/${currentVideo.filename}` : null;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
        <div style={{
          display: 'inline-block',
          width: '50px',
          height: '50px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ marginTop: '1rem', color: '#666' }}>Carregando vídeos...</p>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem 1rem',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📹</div>
        <p style={{ color: '#666', fontSize: '1.1rem', margin: '0' }}>
          Nenhum vídeo cadastrado ainda.
        </p>
        <p style={{ color: '#999', fontSize: '0.9rem', margin: '0.5rem 0 0' }}>
          Comece adicionando um vídeo acima!
        </p>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.6s ease-out' }}>
      {/* Video Player Section */}
      {currentVideo && (
        <div style={{
          marginBottom: '2.5rem',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 15px 50px rgba(102, 126, 234, 0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          animation: 'fadeIn 0.6s ease-out'
        }}>
          <div style={{
            position: 'relative',
            background: '#000',
            paddingBottom: '56.25%'
          }}>
            <video
              controls
              src={currentSource}
              poster={currentVideo.thumbnail || PLACEHOLDER}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
          <div style={{
            padding: '1.5rem'
          }}>
            <h3 style={{
              margin: '0 0 0.75rem',
              color: '#111',
              fontSize: '1.3rem',
              fontWeight: '700'
            }}>
              {currentVideo.title}
            </h3>
            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              color: '#666',
              fontSize: '0.9rem'
            }}>
              <span>👤 {currentVideo.uploader}</span>
              <span>📅 {new Date(currentVideo.createdAt).toLocaleDateString('pt-BR')}</span>
              <span>🕐 {new Date(currentVideo.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      )}

      {/* Thumbnails Grid */}
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: '1.5rem'
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#111'
            }}>
              Biblioteca
            </h2>
            <p style={{
              margin: '0.5rem 0 0',
              color: '#666',
              fontSize: '0.95rem'
            }}>
              {videos.length} vídeo{videos.length !== 1 ? 's' : ''} disponível{videos.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {videos.map((video) => (
            <button
              key={video.id}
              type="button"
              onClick={() => setSelectedVideo(video)}
              style={{
                cursor: 'pointer',
                padding: 0,
                border: selectedVideo?.id === video.id ? '3px solid #667eea' : '2px solid transparent',
                borderRadius: '14px',
                overflow: 'hidden',
                textAlign: 'left',
                background: '#fff',
                boxShadow: selectedVideo?.id === video.id
                  ? '0 10px 30px rgba(102, 126, 234, 0.2)'
                  : '0 5px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                minHeight: '280px',
                transform: selectedVideo?.id === video.id ? 'scale(1.02)' : 'scale(1)',
                backdropFilter: 'blur(10px)',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (selectedVideo?.id !== video.id) {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedVideo?.id !== video.id) {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.08)';
                }
              }}
            >
              {/* Thumbnail */}
              <div style={{
                position: 'relative',
                height: 0,
                paddingBottom: '56.25%',
                overflow: 'hidden',
                background: '#000'
              }}>
                <img
                  src={video.thumbnail || PLACEHOLDER}
                  alt={video.title}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: selectedVideo?.id === video.id ? '1' : '0.7'
                }}>
                  <span style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    color: '#111',
                    padding: '0.6rem 1rem',
                    borderRadius: '999px',
                    fontWeight: '700',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    ▶ Assistir
                  </span>
                </div>
              </div>

              {/* Info */}
              <div style={{ padding: '1rem' }}>
                <h3 style={{
                  margin: '0 0 0.75rem',
                  fontSize: '0.95rem',
                  lineHeight: '1.4',
                  color: '#111',
                  fontWeight: '600',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {video.title}
                </h3>
                <div style={{
                  fontSize: '0.8rem',
                  color: '#999',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <span>{video.uploader}</span>
                  <span>{new Date(video.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
