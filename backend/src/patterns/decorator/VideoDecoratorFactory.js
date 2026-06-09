import { VideoSizeFormatterDecorator } from './VideoSizeFormatterDecorator.js';
import { VideoOriginBadgeDecorator } from './VideoOriginBadgeDecorator.js';
import { VideoTitleCleanerDecorator } from './VideoTitleCleanerDecorator.js';
import { VideoDateFormatterDecorator } from './VideoDateFormatterDecorator.js';
import { VideoDurationFormatterDecorator } from './VideoDurationFormatterDecorator.js';
import { VideoViewCountFormatterDecorator } from './VideoViewCountFormatterDecorator.js';

/**
 * Factory para aplicar decorators de forma fácil e organizada.
 * Permite aplicar múltiplos decorators em cadeia.
 */
export class VideoDecoratorFactory {
  /**
   * Aplica todos os decorators padrão a um vídeo
   * @param {Object} videoData - Dados do vídeo
   * @returns {Object} Vídeo com todos os decorators aplicados
   */
  static applyAllDecorators(videoData) {
    return this.applyDecorators(videoData, [
      'size',
      'origin',
      'title',
      'date',
      'duration',
      'views'
    ]);
  }

  /**
   * Aplica decorators específicos a um vídeo
   * @param {Object} videoData - Dados do vídeo
   * @param {Array<string>} decorators - Lista de decorators a aplicar
   * @returns {Object} Vídeo com decorators aplicados
   */
  static applyDecorators(videoData, decorators = []) {
    let result = { ...videoData };

    for (const decorator of decorators) {
      result = this._applyDecorator(result, decorator);
    }

    return result;
  }

  /**
   * Aplica um decorator individual
   * @private
   * @param {Object} videoData - Dados do vídeo
   * @param {string} decoratorName - Nome do decorator
   * @returns {Object} Dados decorados
   */
  static _applyDecorator(videoData, decoratorName) {
    const decoratorMap = {
      size: VideoSizeFormatterDecorator,
      origin: VideoOriginBadgeDecorator,
      title: VideoTitleCleanerDecorator,
      date: VideoDateFormatterDecorator,
      duration: VideoDurationFormatterDecorator,
      views: VideoViewCountFormatterDecorator
    };

    const DecoratorClass = decoratorMap[decoratorName];
    if (!DecoratorClass) {
      console.warn(`Decorator desconhecido: ${decoratorName}`);
      return videoData;
    }

    const decorator = new DecoratorClass(videoData);
    return decorator.decorate();
  }
}
