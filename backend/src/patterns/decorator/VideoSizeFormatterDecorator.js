import { VideoDecorator } from './VideoDecorator.js';

/**
 * Decorator que formata o tamanho do arquivo em unidades legíveis.
 * Converte bytes para KB, MB, GB conforme necessário.
 */
export class VideoSizeFormatterDecorator extends VideoDecorator {
  decorate() {
    const decorated = { ...this.videoData };

    // Se houver tamanho em bytes, formata para unidade legível
    if (decorated.size) {
      decorated.sizeFormatted = this._formatBytes(decorated.size);
    }

    decorated.decorators = decorated.decorators || [];
    decorated.decorators.push('VideoSizeFormatter');

    return decorated;
  }

  /**
   * Converte bytes para formato legível (KB, MB, GB)
   * @param {number} bytes - Tamanho em bytes
   * @returns {string} Tamanho formatado
   */
  _formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  }
}
