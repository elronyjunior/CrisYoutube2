import { VideoDecorator } from './VideoDecorator.js';

/**
 * Decorator que formata e exibe a contagem de visualizações
 * Formata grandes números em formato compacto (1.2M, 500K, etc)
 * Também adiciona indicador de trending
 * 
 * @example
 * const decorator = new VideoViewCountFormatterDecorator();
 * const video = { viewCount: 1234567 };
 * const decorated = decorator.decorate(video);
 * // { viewCount: 1234567, viewsFormatted: "1.2M", viewsBadge: {...} }
 */
export class VideoViewCountFormatterDecorator extends VideoDecorator {
  /**
   * Decora um vídeo com informações de visualizações formatadas
   * @returns {Object} Vídeo com campos de visualizações formatadas
   */
  decorate() {
    const videoData = this.videoData;
    
    // Se não tiver viewCount, gerar um baseado no tipo de origem
    // YouTube vídeos começam com muitas views, locais começam com 0
    let viewCount = videoData.viewCount;

    if (viewCount === undefined || viewCount === null) {
      if (videoData.sourceType === 'youtube') {
        // Simular views de vídeo do YouTube (entre 10K e 1M)
        viewCount = Math.floor(Math.random() * (1000000 - 10000) + 10000);
      } else {
        // Vídeo local começa sem views
        viewCount = 0;
      }
    }

    videoData.viewCount = viewCount;
    videoData.viewsFormatted = this._formatViewCount(viewCount);
    videoData.viewsBadge = this._getViewsBadge(viewCount);
    videoData.isTrending = this._isTrending(viewCount);

    return videoData;
  }

  /**
   * Formata número de views em formato compacto
   * @private
   * @param {number} count - Número de visualizações
   * @returns {string} Views formatado (ex: "1.2M", "500K")
   */
  _formatViewCount(count) {
    if (count === 0) return "0";
    if (count < 1000) return count.toString();
    if (count < 1000000) {
      return (count / 1000).toFixed(1).replace(/\.0$/, '') + "K";
    }
    if (count < 1000000000) {
      return (count / 1000000).toFixed(1).replace(/\.0$/, '') + "M";
    }
    return (count / 1000000000).toFixed(1).replace(/\.0$/, '') + "B";
  }

  /**
   * Categoriza visualizações por volume
   * @private
   * @param {number} count - Número de visualizações
   * @returns {string} Categoria (Nenhuma, Poucos, Alguns, Muitos, Viral)
   */
  _getViewsCategory(count) {
    if (count === 0) return "Nenhuma";
    if (count < 100) return "Poucos";
    if (count < 1000) return "Alguns";
    if (count < 100000) return "Muitos";
    if (count < 1000000) return "Popular";
    return "Viral";
  }

  /**
   * Cria badge visual para visualizações
   * @private
   * @param {number} count - Número de visualizações
   * @returns {Object} Objeto com informações de badge
   */
  _getViewsBadge(count) {
    const category = this._getViewsCategory(count);

    const categoryInfo = {
      "Nenhuma": {
        emoji: "😴",
        color: "#95A5A6",
        label: "Sem visualizações",
        popularity: 0
      },
      "Poucos": {
        emoji: "👁️",
        color: "#BDC3C7",
        label: "Poucos veem",
        popularity: 1
      },
      "Alguns": {
        emoji: "👀",
        color: "#3498DB",
        label: "Alguns vendo",
        popularity: 2
      },
      "Muitos": {
        emoji: "👁️👁️",
        color: "#2ECC71",
        label: "Bastante visto",
        popularity: 3
      },
      "Popular": {
        emoji: "🌟",
        color: "#F39C12",
        label: "Muito popular",
        popularity: 4
      },
      "Viral": {
        emoji: "🚀",
        color: "#E74C3C",
        label: "VIRAL 🔥",
        popularity: 5
      }
    };

    return {
      ...categoryInfo[category],
      category: category,
      count: count,
      formatted: this._formatViewCount(count)
    };
  }

  /**
   * Verifica se o vídeo está em trending (muitas views)
   * @private
   * @param {number} count - Número de visualizações
   * @returns {boolean} True se está em trending
   */
  _isTrending(count) {
    // Trending = mais de 100K views
    return count > 100000;
  }
}
