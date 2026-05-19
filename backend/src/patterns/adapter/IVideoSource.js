export class IVideoSource {
  async getBuffer() {
    throw new Error('getBuffer() não implementado por esta fonte de vídeo.');
  }

  async getMetadata() {
    throw new Error('getMetadata() não implementado por esta fonte de vídeo.');
  }
}