import { VideoDecorator } from './VideoDecorator.js';

/**
 * Decorator que formata a duração do vídeo em formato MM:SS ou HH:MM:SS
 * Também categoriza a duração (Curto, Médio, Longo)
 * 
 * @example
 * const decorator = new VideoDurationFormatterDecorator();
 * const video = { duration: 1890 };
 * const decorated = decorator.decorate(video);
 * // { duration: 1890, durationFormatted: "31:30", durationCategory: "Médio" }
 */
export class VideoDurationFormatterDecorator extends VideoDecorator {
  /**
   * Decora um vídeo com informações de duração formatada
   * @returns {Object} Vídeo com campos de duração formatada
   */
  decorate() {
    const videoData = this.videoData;
    
    // Se não tiver duration, calcular baseado no tamanho do arquivo
    let duration = videoData.duration;
    
    if (!duration && videoData.size) {
      // Assumir bitrate médio de 5 Mbps (típico para vídeos MP4)
      // bitrate em bits por segundo
      const AVERAGE_BITRATE = 5 * 1024 * 1024; // 5 Mbps
      const durationInSeconds = Math.floor((videoData.size * 8) / AVERAGE_BITRATE);
      duration = durationInSeconds;
    }

    // Se ainda não tiver duração, assumir valor padrão
    if (!duration) {
      duration = 0;
    }

    videoData.duration = duration;
    videoData.durationFormatted = this._formatDuration(duration);
    videoData.durationCategory = this._getDurationCategory(duration);
    videoData.durationBadge = this._getDurationBadge(duration);

    return videoData;
  }

  /**
   * Formata segundos em formato MM:SS ou HH:MM:SS
   * @private
   * @param {number} seconds - Duração em segundos
   * @returns {string} Duração formatada
   */
  _formatDuration(seconds) {
    if (seconds <= 0) return "0:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const pad = (num) => String(num).padStart(2, '0');

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(secs)}`;
    }
    return `${minutes}:${pad(secs)}`;
  }

  /**
   * Categoriza a duração do vídeo
   * @private
   * @param {number} seconds - Duração em segundos
   * @returns {string} Categoria (Curto, Médio, Longo, Muito Longo)
   */
  _getDurationCategory(seconds) {
    if (seconds < 300) return "Curto";        // < 5 minutos
    if (seconds < 1800) return "Médio";       // 5-30 minutos
    if (seconds < 3600) return "Longo";       // 30-60 minutos
    return "Muito Longo";                      // > 1 hora
  }

  /**
   * Cria badge visual para categoria de duração
   * @private
   * @param {number} seconds - Duração em segundos
   * @returns {Object} Objeto com informações de badge
   */
  _getDurationBadge(seconds) {
    const categoryInfo = {
      "Curto": {
        emoji: "⚡",
        color: "#FF6B6B",
        label: "Rápido",
        icon: "lightning"
      },
      "Médio": {
        emoji: "⏱️",
        color: "#4ECDC4",
        label: "Médio",
        icon: "clock"
      },
      "Longo": {
        emoji: "📽️",
        color: "#45B7D1",
        label: "Filme",
        icon: "film"
      },
      "Muito Longo": {
        emoji: "🎬",
        color: "#6C5CE7",
        label: "Documentário",
        icon: "clapperboard"
      }
    };

    const category = this._getDurationCategory(seconds);
    return {
      ...categoryInfo[category],
      category: category,
      seconds: seconds
    };
  }
}
