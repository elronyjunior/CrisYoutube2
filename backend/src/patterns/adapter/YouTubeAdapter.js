import { IVideoSource } from './IVideoSource.js';
import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import util from 'util';
// Aumentamos o maxBuffer para 10MB (10 * 1024 * 1024)
const execPromise = util.promisify((cmd, callback) => {
  exec(cmd, { maxBuffer: 10 * 1024 * 1024 }, callback);
});

export class YouTubeAdapter extends IVideoSource {
  constructor(url) {
    super();
    this.url = url;
  }

  async getBuffer() {
    const tempFileName = `temp_${Date.now()}.mp4`;
    const tempPath = path.join(process.cwd(), 'uploads', 'temp', tempFileName);
    const ytDlpPath = path.join(process.cwd(), 'yt-dlp.exe'); 
    const cookiesPath = path.join(process.cwd(), 'cookies.txt');

    // 🪄 Alteração aqui: -f "18/b[ext=mp4]"
    // Tenta primeiro o código 18 (MP4 universal com áudio). Se falhar, procura o melhor MP4 disponível.
    const command = `"${ytDlpPath}" --js-runtimes node --cookies "${cookiesPath}" -f "18/b[ext=mp4]" -o "${tempPath}" "${this.url}"`;

    try {
      console.log('A descarregar formato MP4 nativo (código 18)...');
      await execPromise(command);
      
      const buffer = await fs.readFile(tempPath);
      await fs.unlink(tempPath); 
      
      return buffer;
    } catch (error) {
      throw new Error(`Falha no yt-dlp a descarregar: ${error.message}`);
    }
  }

  async getMetadata() {
    const ytDlpPath = path.join(process.cwd(), 'yt-dlp.exe');
    const cookiesPath = path.join(process.cwd(), 'cookies.txt');
    
    // O Node também é usado aqui para ler as informações corretamente
    const command = `"${ytDlpPath}" --js-runtimes node --cookies "${cookiesPath}" --dump-json "${this.url}"`;

    try {
      console.log('Resolvendo criptografia para ler metadados...');
      const { stdout } = await execPromise(command);
      const info = JSON.parse(stdout);
      
      const safeTitle = info.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();

      return {
        filename: `youtube_${safeTitle}.mp4`,
        mimetype: 'video/mp4',
        size: null, 
        title: info.title
      };
    } catch (error) {
      throw new Error(`Falha no yt-dlp ao ler metadados: ${error.message}`);
    }
  }
}