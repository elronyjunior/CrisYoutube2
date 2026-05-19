import fs from 'fs';

const dirs = [
  'src/patterns/adapter',
  'src/patterns/proxy',
  'src/patterns/facade',
  'src/services',
  'uploads/videos'
];

// Cria todas as pastas necessárias
dirs.forEach(dir => {
  fs.mkdirSync(dir, { recursive: true });
  console.log(`📂 Pasta garantida: ${dir}`);
});

// Conteúdo de todos os arquivos do sistema
const files = {
  'src/database.json': `{
  "videos": []
}`,

  'src/db.js': `import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'database.json');

export async function readDb() {
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

export async function writeDb(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}`,

  'src/patterns/adapter/IVideoSource.js': `export class IVideoSource {
  async getBuffer() {
    throw new Error('getBuffer() não implementado por esta fonte de vídeo.');
  }

  async getMetadata() {
    throw new Error('getMetadata() não implementado por esta fonte de vídeo.');
  }
}`,

  'src/patterns/adapter/LocalUploadAdapter.js': `import { IVideoSource } from './IVideoSource.js';

export class LocalUploadAdapter extends IVideoSource {
  constructor(multerFile) {
    super();
    this.file = multerFile;
  }

  async getBuffer() {
    return this.file.buffer;
  }

  async getMetadata() {
    return {
      filename: this.file.originalname,
      mimetype: this.file.mimetype,
      size: this.file.size,
      title: this.file.originalname.split('.')[0]
    };
  }
}`,

  'src/patterns/adapter/YouTubeAdapter.js': `import { IVideoSource } from './IVideoSource.js';
import ytdl from '@distube/ytdl-core';

export class YouTubeAdapter extends IVideoSource {
  constructor(url) {
    super();
    this.url = url;
  }

  async getBuffer() {
    return new Promise((resolve, reject) => {
      const stream = ytdl(this.url, { quality: 'lowestvideo' });
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }

  async getMetadata() {
    const info = await ytdl.getBasicInfo(this.url);
    return {
      filename: \`\${info.videoDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4\`,
      mimetype: 'video/mp4',
      size: null, 
      title: info.videoDetails.title
    };
  }
}`,

  'src/patterns/proxy/AuthProxy.js': `export class AuthProxy {
  constructor(realService, authService) {
    this._real = realService;
    this._auth = authService;
  }

  async upload(token, videoData) {
    const user = await this._requireAuth(token);
    return this._real.save(videoData, user);
  }

  async delete(token, videoId) {
    const user = await this._requireAuth(token);
    return this._real.delete(videoId, user);
  }

  async listAll() {
    return this._real.listAll();
  }

  async getById(videoId) {
    return this._real.getById(videoId);
  }

  async _requireAuth(token) {
    const user = await this._auth.validateToken(token);
    if (!user) throw new Error('Não autorizado: token inválido ou expirado.');
    return user;
  }
}`,

  'src/services/AuthService.js': `export class AuthService {
  async validateToken(token) {
    if (token === 'token-secreto-admin') {
      return { id: 1, username: 'admin' };
    }
    return null;
  }

  async login(username, password) {
    if (username === 'admin' && password === '1234') {
      return { token: 'token-secreto-admin', username };
    }
    throw new Error('Credenciais inválidas');
  }
}`,

  'src/services/VideoService.js': `import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { readDb, writeDb } from '../db.js';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'videos');

export class VideoService {
  async save(videoSource, user) {
    const metadata = await videoSource.getMetadata();
    const buffer = await videoSource.getBuffer();
    
    const videoId = uuidv4();
    const fileName = \`\${videoId}.mp4\`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    await fs.writeFile(filePath, buffer);

    const db = await readDb();
    const newVideo = {
      id: videoId,
      title: metadata.title,
      filename: fileName,
      uploader: user.username,
      createdAt: new Date().toISOString()
    };
    
    if (!db.videos) db.videos = [];
    db.videos.push(newVideo);
    await writeDb(db);

    return newVideo;
  }

  async listAll() {
    const db = await readDb();
    return db.videos || [];
  }
}`,

  'src/patterns/facade/VideoFacade.js': `import { AuthService } from '../../services/AuthService.js';
import { VideoService } from '../../services/VideoService.js';
import { AuthProxy } from '../proxy/AuthProxy.js';
import { LocalUploadAdapter } from '../adapter/LocalUploadAdapter.js';
import { YouTubeAdapter } from '../adapter/YouTubeAdapter.js';

export class VideoFacade {
  constructor() {
    this.authService = new AuthService();
    this.videoService = new VideoService();
    this.proxy = new AuthProxy(this.videoService, this.authService);
  }

  async login(username, password) {
    return this.authService.login(username, password);
  }

  async uploadLocalVideo(token, multerFile) {
    const source = new LocalUploadAdapter(multerFile);
    return this.proxy.upload(token, source);
  }

  async uploadYouTubeVideo(token, youtubeUrl) {
    const source = new YouTubeAdapter(youtubeUrl);
    return this.proxy.upload(token, source);
  }

  async listVideos() {
    return this.proxy.listAll();
  }
}`,

  'src/server.js': `import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { VideoFacade } from './patterns/facade/VideoFacade.js';

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });
const facade = new VideoFacade();

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await facade.login(username, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

app.get('/api/videos', async (req, res) => {
  try {
    const videos = await facade.listVideos();
    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/videos/upload-local', upload.single('video'), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const video = await facade.uploadLocalVideo(token, req.file);
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/videos/upload-youtube', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const { url } = req.body;
    const video = await facade.uploadYouTubeVideo(token, url);
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(\`🚀 YouTube² Backend rodando na porta \${PORT}\`);
});`
};

// Escreve os arquivos nas pastas criadas
Object.entries(files).forEach(([filepath, content]) => {
  fs.writeFileSync(filepath, content.trim(), 'utf-8');
  console.log(`📄 Arquivo criado: ${filepath}`);
});

console.log('\n✅ Tudo pronto! Agora é só apagar este setup.js e rodar: npm run dev');