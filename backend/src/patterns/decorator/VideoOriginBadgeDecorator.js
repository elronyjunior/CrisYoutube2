import { VideoDecorator } from './VideoDecorator.js';

/**
 * Decorator que adiciona um badge com a origem do vídeo.
 * Diferencia vídeos do YouTube de uploads locais.
 */
export class VideoOriginBadgeDecorator extends VideoDecorator {
  decorate() {
    const decorated = { ...this.videoData };

    // Define badge baseado no tipo de origem
    const sourceType = decorated.sourceType || 'local';
    decorated.originBadge = this._getBadge(sourceType);

    decorated.decorators = decorated.decorators || [];
    decorated.decorators.push('VideoOriginBadge');

    return decorated;
  }

  /**
   * Retorna o badge e cor com base na origem
   * @param {string} sourceType - Tipo de fonte ('youtube' ou 'local')
   * @returns {Object} Objeto com badge, cor e emoji
   */
  _getBadge(sourceType) {
    const badges = {
      youtube: {
        label: '▶ YouTube',
        color: '#FF0000',
        emoji: '📺',
        description: 'Vídeo importado do YouTube'
      },
      local: {
        label: '⬆ Upload Local',
        color: '#4CAF50',
        emoji: '📤',
        description: 'Vídeo enviado localmente'
      }
    };

    return badges[sourceType] || badges.local;
  }
}
