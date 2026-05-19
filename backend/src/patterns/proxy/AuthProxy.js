export class AuthProxy {
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
}