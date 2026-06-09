/**
 * Classe base abstrata para o padrão Decorator.
 * Define a interface que todos os decorators devem implementar.
 */
export class VideoDecorator {
  constructor(videoData) {
    this.videoData = videoData;
  }

  /**
   * Método que deve ser sobrescrito para decorar o vídeo.
   * @returns {Object} Dados do vídeo decorados
   */
  decorate() {
    throw new Error('decorate() deve ser implementado pelo decorator');
  }

  /**
   * Encadeia múltiplos decorators de forma fluida.
   * @param {VideoDecorator} nextDecorator - Próximo decorator na cadeia
   * @returns {Object} Dados do vídeo após aplicar este e o próximo decorator
   */
  chain(nextDecorator) {
    const decorated = this.decorate();
    nextDecorator.videoData = decorated;
    return nextDecorator.decorate();
  }
}
