import { IVideoSource } from './IVideoSource.js';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const execFileAsync = promisify(execFile);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../..');
const YTDLP_PATH = path.join(ROOT_DIR, 'yt-dlp.exe');

function extractYouTubeId(url) {
  const match = url.match(/(?:v=|youtu\.be\/|\/embed\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] ?? null;
}

function sanitizeTitle(title) {
  return title
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase() || 'youtube_video';
}

export class YouTubeAdapter extends IVideoSource {
  constructor(url) {
    super();
    this.url = url;
  }

  async _runYtdlp(args) {
    const exists = await fs.access(YTDLP_PATH).then(() => true).catch(() => false);
    if (!exists) {
      throw new Error(`yt-dlp não encontrado em: ${YTDLP_PATH}`);
    }
    const { stdout, stderr } = await execFileAsync(YTDLP_PATH, args, { windowsHide: true });
    if (stderr) {
      const output = stderr.trim();
      if (output.length > 0 && !output.includes('WARNING')) {
        throw new Error(output);
      }
    }
    return stdout;
  }

  async getMetadata() {
    const stdout = await this._runYtdlp([
      '--dump-single-json',
      '--no-warnings',
      '--no-check-certificate',
      '--no-playlist',
      this.url
    ]);

    const info = JSON.parse(stdout);
    const thumbnail = info.thumbnails?.slice(-1)[0]?.url
      || (info.id ? `https://img.youtube.com/vi/${info.id}/hqdefault.jpg` : null);
    const safeTitle = sanitizeTitle(info.title || info.id || 'youtube_video');
    const ext = info.ext || 'mp4';

    return {
      filename: `youtube_${safeTitle}.${ext}`,
      mimetype: `video/${ext}`,
      size: info.filesize || null,
      title: info.title || info.id || 'YouTube Video',
      thumbnail,
      sourceType: 'youtube'
    };
  }

  async getBuffer() {
    const metadata = await this.getMetadata();
    const tempFolder = os.tmpdir();
    const tempBaseName = `youtube-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const outputPattern = path.join(tempFolder, `${tempBaseName}.%(ext)s`);

    await this._runYtdlp([
      '--no-warnings',
      '--no-check-certificate',
      '--no-playlist',
      '--format', 'best[ext=mp4]/best',
      '--output', outputPattern,
      this.url
    ]);

    const downloaded = (await fs.readdir(tempFolder)).find((name) => name.startsWith(`${tempBaseName}.`));
    if (!downloaded) {
      throw new Error('Falha ao localizar o arquivo baixado pelo yt-dlp.');
    }

    const tempFilePath = path.join(tempFolder, downloaded);
    try {
      const fileBuffer = await fs.readFile(tempFilePath);
      return fileBuffer;
    } finally {
      await fs.unlink(tempFilePath).catch(() => null);
    }
  }
}
