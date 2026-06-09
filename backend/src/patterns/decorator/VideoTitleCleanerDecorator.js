import { VideoDecorator } from './VideoDecorator.js';

/**
 * Decorator que limpa e normaliza o título do vídeo.
 * Remove caracteres inválidos e capitaliza adequadamente.
 */
export class VideoTitleCleanerDecorator extends VideoDecorator {
  decorate() {
    const decorated = { ...this.videoData };

    // Limpa o título removendo caracteres especiais inválidos
    if (decorated.title) {
      decorated.titleCleaned = this._cleanTitle(decorated.title);
    }

    decorated.decorators = decorated.decorators || [];
    decorated.decorators.push('VideoTitleCleaner');

    return decorated;
  }

  /**
   * Remove caracteres especiais e capitaliza o título
   * @param {string} title - Título original
   * @returns {string} Título limpo
   */
  _cleanTitle(title) {
    return title
      .trim()
      .replace(/\.[^/.]*$/, '') // Remove extensão
      .replace(/_/g, ' ')        // Substitui underscore por espaço
      .replace(/-/g, ' ')        // Substitui hífen por espaço
      .replace(/\s+/g, ' ')      // Normaliza espaços múltiplos
      .replace(/[^\w\s]/g, '')   // Remove caracteres especiais
      .replace(/^\s+|\s+$/g, '') // Remove espaços extremos
      .split(' ')
      .filter(word => word.length > 0) // Remove palavras vazias
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
