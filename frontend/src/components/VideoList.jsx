export default function VideoList({ videos }) {
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
}