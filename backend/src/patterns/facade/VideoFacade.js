import { AuthService } from '../../services/AuthService.js';
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
}