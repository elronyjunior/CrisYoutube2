import express from 'express';
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
    console.error("❌ Erro no Adapter do YouTube:", error.message); // <-- Adicione este lo
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 YouTube² Backend rodando na porta ${PORT}`);
});