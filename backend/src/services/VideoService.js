import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { readDb, writeDb } from '../db.js';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads', 'videos');

export class VideoService {
  async save(videoSource, user) {
    const metadata = await videoSource.getMetadata();
    const buffer = await videoSource.getBuffer();

    await fs.mkdir(UPLOADS_DIR, { recursive: true });

    const videoId = uuidv4();
    const fileName = `${videoId}.mp4`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    await fs.writeFile(filePath, buffer);

    const db = await readDb();
    const newVideo = {
      id: videoId,
      title: metadata.title,
      filename: fileName,
      uploader: user.username,
      createdAt: new Date().toISOString(),
      thumbnail: metadata.thumbnail || null,
      sourceType: metadata.sourceType || 'local'
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
}
