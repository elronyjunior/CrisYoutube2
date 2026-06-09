import { VideoDecorator } from './VideoDecorator.js';

/**
 * Decorator que formata a data de criação em formato legível.
 * Converte ISO 8601 para formato amigável em português.
 */
export class VideoDateFormatterDecorator extends VideoDecorator {
  decorate() {
    const decorated = { ...this.videoData };

    // Formata a data de criação
    if (decorated.createdAt) {
      decorated.createdAtFormatted = this._formatDate(decorated.createdAt);
      decorated.createdAtRelative = this._getRelativeTime(decorated.createdAt);
    }

    decorated.decorators = decorated.decorators || [];
    decorated.decorators.push('VideoDateFormatter');

    return decorated;
  }

  /**
   * Formata a data para padrão brasileiro
   * @param {string} dateString - Data em formato ISO 8601
   * @returns {string} Data formatada (ex: "09/06/2026 15:30")
   */
  _formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Retorna tempo relativo em português (ex: "há 2 horas")
   * @param {string} dateString - Data em formato ISO 8601
   * @returns {string} Tempo relativo
   */
  _getRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'agora mesmo';
    if (diffMins < 60) return `há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `há ${weeks} semana${weeks > 1 ? 's' : ''}`;
    }
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `há ${months} mês${months > 1 ? 'es' : ''}`;
    }

    const years = Math.floor(diffDays / 365);
    return `há ${years} ano${years > 1 ? 's' : ''}`;
  }
}
