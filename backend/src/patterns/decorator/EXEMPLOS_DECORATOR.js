/**
 * EXEMPLOS DE USO DO PADRÃO DECORATOR
 * Este arquivo demonstra as diferentes formas de usar os decorators
 */

import { VideoDecoratorFactory } from '../patterns/decorator/VideoDecoratorFactory.js';
import { VideoDecorator } from '../patterns/decorator/VideoDecorator.js';
import { VideoSizeFormatterDecorator } from '../patterns/decorator/VideoSizeFormatterDecorator.js';
import { VideoOriginBadgeDecorator } from '../patterns/decorator/VideoOriginBadgeDecorator.js';
import { VideoTitleCleanerDecorator } from '../patterns/decorator/VideoTitleCleanerDecorator.js';
import { VideoDateFormatterDecorator } from '../patterns/decorator/VideoDateFormatterDecorator.js';

// ===== EXEMPLO 1: Usar a Factory (RECOMENDADO) =====
export function exemplo1_usarFactory() {
  const videoData = {
    id: '123',
    title: 'meu_video_legal',
    filename: 'meu_video_legal.mp4',
    uploader: 'admin',
    createdAt: '2026-06-09T15:30:00.000Z',
    sourceType: 'local',
    size: 5242880 // 5 MB
  };

  // Aplicar todos os decorators
  const videoDecorado = VideoDecoratorFactory.applyAllDecorators(videoData);

  console.log('Vídeo decorado:');
  console.log(videoDecorado);
  // Output:
  // {
  //   ...dados originais...
  //   titleCleaned: "Meu Video Legal",
  //   sizeFormatted: "5.00 MB",
  //   createdAtFormatted: "09/06/2026 15:30",
  //   createdAtRelative: "há 2 horas",
  //   originBadge: { label: "⬆ Upload Local", ... },
  //   decorators: ["VideoSizeFormatter", "VideoOriginBadge", ...]
  // }
}

// ===== EXEMPLO 2: Aplicar decorators seletivamente =====
export function exemplo2_decoratorsSeletivos() {
  const videoData = {
    id: '456',
    title: 'video_youtube_baixado',
    size: 15728640, // 15 MB
    sourceType: 'youtube'
  };

  // Aplicar apenas alguns decorators
  const videoDecorado = VideoDecoratorFactory.applyDecorators(videoData, [
    'size',      // Só tamanho formatado
    'origin'     // Só badge de origem
  ]);

  console.log('Vídeo com decorators seletivos:');
  console.log(videoDecorado);
  // sizeFormatted: "15.00 MB"
  // originBadge: { label: "▶ YouTube", ... }
}

// ===== EXEMPLO 3: Usar decorators manualmente em cadeia =====
export function exemplo3_cadeiaManual() {
  const videoData = {
    id: '789',
    title: 'test__video--2024',
    size: 1048576, // 1 MB
    sourceType: 'local',
    createdAt: '2026-06-08T10:00:00.000Z'
  };

  // Aplicar decorators em ordem específica
  let video = videoData;

  video = new VideoSizeFormatterDecorator(video).decorate();
  console.log('Após Size Formatter:', video.sizeFormatted); // "1.00 MB"

  video = new VideoOriginBadgeDecorator(video).decorate();
  console.log('Após Origin Badge:', video.originBadge.label); // "⬆ Upload Local"

  video = new VideoTitleCleanerDecorator(video).decorate();
  console.log('Após Title Cleaner:', video.titleCleaned); // "Test Video 2024"

  video = new VideoDateFormatterDecorator(video).decorate();
  console.log('Após Date Formatter:', video.createdAtFormatted); // "08/06/2026 10:00"

  return video;
}

// ===== EXEMPLO 4: Usar o método chain() para encadeamento =====
export function exemplo4_chainMethod() {
  const videoData = {
    id: '999',
    title: 'chain_test_video',
    size: 2097152, // 2 MB
    sourceType: 'youtube',
    createdAt: new Date().toISOString()
  };

  // Encadear decorators com fluência
  const sizeDecorator = new VideoSizeFormatterDecorator(videoData);
  const originDecorator = new VideoOriginBadgeDecorator(videoData);
  const titleDecorator = new VideoTitleCleanerDecorator(videoData);

  const videoFinal = sizeDecorator.chain(originDecorator);
  // Agora adicionar mais um
  const ultimoDecorator = new VideoDateFormatterDecorator(videoFinal);
  const resultado = ultimoDecorator.decorate();

  return resultado;
}

// ===== EXEMPLO 5: Criar um decorator customizado =====
export class VideoViralScoreDecorator extends VideoDecorator {
  /**
   * Adiciona um score de "viralidade" baseado em heurísticas
   */
  decorate() {
    const decorated = { ...this.videoData };

    // Simular cálculo de score viral
    const score = this._calculateViralScore(decorated);
    decorated.viralScore = score;
    decorated.viralCategory = this._getCategory(score);

    decorated.decorators = decorated.decorators || [];
    decorated.decorators.push('VideoViralScore');

    return decorated;
  }

  _calculateViralScore(video) {
    let score = 50; // Base 50

    // Adiciona pontos se é do YouTube
    if (video.sourceType === 'youtube') score += 20;

    // Subtrai pontos se é muito pequeno ou grande
    if (video.size && video.size < 1048576) score -= 10; // < 1MB
    if (video.size && video.size > 104857600) score -= 15; // > 100MB

    // Adiciona pontos se título é curto e legal
    if (video.titleCleaned && video.titleCleaned.length < 30) score += 10;

    return Math.min(100, Math.max(0, score));
  }

  _getCategory(score) {
    if (score >= 80) return '🔥 Viral';
    if (score >= 60) return '👍 Popular';
    if (score >= 40) return '⭐ Normal';
    return '💤 Dorminhoco';
  }
}

export function exemplo5_decoratorCustomizado() {
  const videoData = {
    id: 'custom',
    title: 'viral_dance_challenge',
    sourceType: 'youtube',
    size: 52428800 // 50 MB
  };

  let video = VideoDecoratorFactory.applyAllDecorators(videoData);
  video = new VideoViralScoreDecorator(video).decorate();

  console.log('Vídeo com Viral Score:');
  console.log(`Score: ${video.viralScore} - ${video.viralCategory}`);

  return video;
}

// ===== EXEMPLO 6: Decorar lista de vídeos =====
export function exemplo6_decorarLista() {
  const videos = [
    {
      id: '1',
      title: 'video_um',
      size: 1048576,
      sourceType: 'local',
      createdAt: '2026-06-09T10:00:00.000Z'
    },
    {
      id: '2',
      title: 'video_dois',
      size: 5242880,
      sourceType: 'youtube',
      createdAt: '2026-06-08T15:00:00.000Z'
    },
    {
      id: '3',
      title: 'video_tres',
      size: 2621440,
      sourceType: 'local',
      createdAt: '2026-06-07T12:00:00.000Z'
    }
  ];

  // Decorar todos os vídeos
  const videosDecorados = videos.map(video =>
    VideoDecoratorFactory.applyAllDecorators(video)
  );

  console.log('Lista de vídeos decorados:');
  videosDecorados.forEach(video => {
    console.log(`📹 ${video.titleCleaned}`);
    console.log(`   Tamanho: ${video.sizeFormatted}`);
    console.log(`   Origem: ${video.originBadge.label}`);
    console.log(`   Data: ${video.createdAtRelative}`);
    console.log('---');
  });

  return videosDecorados;
}

// ===== EXEMPLO 7: Performance - Comparação =====
export async function exemplo7_performance() {
  const videos = Array.from({ length: 1000 }, (_, i) => ({
    id: `video-${i}`,
    title: `video_numero_${i}`,
    size: Math.floor(Math.random() * 100000000),
    sourceType: i % 2 === 0 ? 'local' : 'youtube',
    createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
  }));

  console.time('Decorar 1000 vídeos');
  const videosDecorados = videos.map(v =>
    VideoDecoratorFactory.applyAllDecorators(v)
  );
  console.timeEnd('Decorar 1000 vídeos');

  console.log(`✅ ${videosDecorados.length} vídeos decorados com sucesso`);
  console.log(`📊 Primeiro vídeo decorado:`, videosDecorados[0]);
}

// ===== TESTE RÁPIDO =====
export function testeRapido() {
  console.log('=== TESTE RÁPIDO DO PADRÃO DECORATOR ===\n');

  console.log('1️⃣  Factory (recomendado):');
  exemplo1_usarFactory();

  console.log('\n2️⃣  Decorators seletivos:');
  exemplo2_decoratorsSeletivos();

  console.log('\n3️⃣  Cadeia manual:');
  exemplo3_cadeiaManual();

  console.log('\n5️⃣  Decorator customizado:');
  exemplo5_decoratorCustomizado();

  console.log('\n6️⃣  Decorar lista:');
  exemplo6_decorarLista();

  console.log('\n✅ Todos os exemplos executados!');
}

// Para executar: testeRapido();
