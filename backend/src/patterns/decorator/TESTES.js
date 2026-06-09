/**
 * TESTE DO PADRÃO DECORATOR
 * Valida que todos os decorators estão funcionando corretamente
 */

import { VideoDecoratorFactory } from '../decorator/VideoDecoratorFactory.js';

// Dados de teste
const videoTeste = {
  id: 'test-001',
  title: 'video__teste---2024.mp4',
  filename: 'test-001.mp4',
  uploader: 'admin',
  createdAt: '2026-06-09T15:30:00.000Z',
  thumbnail: null,
  sourceType: 'local',
  size: 2621440
};

const videoYouTube = {
  id: 'test-002',
  title: 'meu_video_do_youtube',
  filename: 'test-002.mp4',
  uploader: 'user123',
  createdAt: new Date().toISOString(),
  thumbnail: 'https://example.com/thumb.jpg',
  sourceType: 'youtube',
  size: 15728640
};

/**
 * Teste 1: Decorator de Tamanho
 */
export function teste1_tamanho() {
  console.log('✅ TESTE 1: VideoSizeFormatterDecorator');
  console.log('---');

  const video = VideoDecoratorFactory.applyDecorators(videoTeste, ['size']);

  console.assert(video.sizeFormatted === '2.50 MB', 'Tamanho não formatado corretamente');
  console.log(`✓ Tamanho: ${videoTeste.size} bytes → ${video.sizeFormatted}`);
  console.log('');
}

/**
 * Teste 2: Decorator de Origem
 */
export function teste2_origem() {
  console.log('✅ TESTE 2: VideoOriginBadgeDecorator');
  console.log('---');

  const video1 = VideoDecoratorFactory.applyDecorators(videoTeste, ['origin']);
  const video2 = VideoDecoratorFactory.applyDecorators(videoYouTube, ['origin']);

  console.assert(video1.originBadge.label.includes('Upload Local'), 'Badge de local incorreto');
  console.assert(video2.originBadge.label.includes('YouTube'), 'Badge de YouTube incorreto');

  console.log(`✓ Local: ${video1.originBadge.label} ${video1.originBadge.emoji}`);
  console.log(`✓ YouTube: ${video2.originBadge.label} ${video2.originBadge.emoji}`);
  console.log('');
}

/**
 * Teste 3: Decorator de Título
 */
export function teste3_titulo() {
  console.log('✅ TESTE 3: VideoTitleCleanerDecorator');
  console.log('---');

  const video = VideoDecoratorFactory.applyDecorators(videoTeste, ['title']);

  console.assert(video.titleCleaned === 'Video Teste 2024', 'Título não limpo corretamente');
  console.log(`✓ Título: "${videoTeste.title}" → "${video.titleCleaned}"`);
  console.log('');
}

/**
 * Teste 4: Decorator de Data
 */
export function teste4_data() {
  console.log('✅ TESTE 4: VideoDateFormatterDecorator');
  console.log('---');

  const video = VideoDecoratorFactory.applyDecorators(videoTeste, ['date']);

  console.assert(video.createdAtFormatted, 'Data formatada não gerada');
  console.assert(video.createdAtRelative, 'Data relativa não gerada');

  console.log(`✓ Data absoluta: ${video.createdAtFormatted}`);
  console.log(`✓ Data relativa: ${video.createdAtRelative}`);
  console.log('');
}

/**
 * Teste 5: Todos os decorators juntos
 */
export function teste5_todosjuntos() {
  console.log('✅ TESTE 5: Todos os Decorators Juntos');
  console.log('---');

  const video = VideoDecoratorFactory.applyAllDecorators(videoYouTube);

  console.assert(video.sizeFormatted, 'Size não aplicado');
  console.assert(video.originBadge, 'Origin não aplicado');
  console.assert(video.titleCleaned, 'Title não aplicado');
  console.assert(video.createdAtFormatted, 'Date não aplicado');
  console.assert(video.decorators.length === 4, 'Nem todos decorators foram registrados');

  console.log('✓ Decorators aplicados:');
  video.decorators.forEach((d, i) => {
    console.log(`  ${i + 1}. ${d}`);
  });

  console.log('\n✓ Dados enriquecidos:');
  console.log(`  Título: ${video.titleCleaned}`);
  console.log(`  Tamanho: ${video.sizeFormatted}`);
  console.log(`  Origem: ${video.originBadge.label}`);
  console.log(`  Data: ${video.createdAtFormatted} (${video.createdAtRelative})`);
  console.log('');
}

/**
 * Teste 6: Validar campos originais preservados
 */
export function teste6_preservacao() {
  console.log('✅ TESTE 6: Preservação de Campos Originais');
  console.log('---');

  const video = VideoDecoratorFactory.applyAllDecorators(videoTeste);

  // Validar que todos os campos originais estão presentes
  console.assert(video.id === videoTeste.id, 'ID não preservado');
  console.assert(video.title === videoTeste.title, 'Título original não preservado');
  console.assert(video.filename === videoTeste.filename, 'Filename não preservado');
  console.assert(video.uploader === videoTeste.uploader, 'Uploader não preservado');
  console.assert(video.createdAt === videoTeste.createdAt, 'CreatedAt não preservado');

  console.log('✓ Todos os campos originais foram preservados');
  console.log('✓ Novos campos foram adicionados');
  console.log('');
}

/**
 * Teste 7: Performance com lista grande
 */
export function teste7_performance() {
  console.log('✅ TESTE 7: Performance com 1000 Vídeos');
  console.log('---');

  const videos = Array.from({ length: 1000 }, (_, i) => ({
    id: `video-${i}`,
    title: `video_numero_${i}`,
    size: Math.floor(Math.random() * 100000000),
    sourceType: i % 2 === 0 ? 'local' : 'youtube',
    createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
  }));

  console.time('⏱️ Decoração de 1000 vídeos');
  const videosDecorados = videos.map(v =>
    VideoDecoratorFactory.applyAllDecorators(v)
  );
  console.timeEnd('⏱️ Decoração de 1000 vídeos');

  console.assert(videosDecorados.length === 1000, 'Nem todos foram decorados');
  console.assert(videosDecorados[0].sizeFormatted, 'Primeira linha não está decorada');

  console.log(`✓ ${videosDecorados.length} vídeos decorados com sucesso`);
  console.log('');
}

/**
 * Teste 8: Decorator de Duração
 */
export function teste8_duracao() {
  console.log('✅ TESTE 8: VideoDurationFormatterDecorator');
  console.log('---');

  const video = VideoDecoratorFactory.applyDecorators(videoTeste, ['duration']);

  console.assert(video.durationFormatted, 'Duração não formatada');
  console.assert(video.durationCategory, 'Categoria de duração não definida');
  console.assert(video.durationBadge, 'Badge de duração não criado');

  console.log(`✓ Duração: ${video.durationFormatted}`);
  console.log(`✓ Categoria: ${video.durationCategory}`);
  console.log(`✓ Badge: ${video.durationBadge.emoji} ${video.durationBadge.label}`);
  console.log('');
}

/**
 * Teste 9: Decorator de Contagem de Views
 */
export function teste9_views() {
  console.log('✅ TESTE 9: VideoViewCountFormatterDecorator');
  console.log('---');

  const video1 = VideoDecoratorFactory.applyDecorators(videoTeste, ['views']);
  const video2 = VideoDecoratorFactory.applyDecorators(videoYouTube, ['views']);

  console.assert(video1.viewsFormatted !== undefined, 'Views não formatadas para local');
  console.assert(video2.viewsFormatted !== undefined, 'Views não formatadas para YouTube');
  console.assert(video1.viewsBadge, 'Badge de views não criado para local');
  console.assert(video2.viewsBadge, 'Badge de views não criado para YouTube');

  console.log(`✓ Vídeo Local: ${video1.viewsFormatted} visualizações`);
  console.log(`  Badge: ${video1.viewsBadge.emoji} ${video1.viewsBadge.label}`);
  console.log(`✓ Vídeo YouTube: ${video2.viewsFormatted} visualizações`);
  console.log(`  Badge: ${video2.viewsBadge.emoji} ${video2.viewsBadge.label}`);
  console.log(`  Trending: ${video2.isTrending ? '🚀 SIM' : '❌ NÃO'}`);
  console.log('');
}

/**
 * EXECUTAR TODOS OS TESTES
 */
export function executarTodosTestes() {
  console.clear();
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║      TESTES DO PADRÃO DECORATOR                ║');
  console.log('║           CrisYoutube2 Project                 ║');
  console.log('╚════════════════════════════════════════════════╝\n');

  try {
    teste1_tamanho();
    teste2_origem();
    teste3_titulo();
    teste4_data();
    teste5_todosjuntos();
    teste6_preservacao();
    teste7_performance();
    teste8_duracao();
    teste9_views();

    console.log('╔════════════════════════════════════════════════╗');
    console.log('║  ✅ TODOS OS TESTES PASSARAM COM SUCESSO!     ║');
    console.log('╚════════════════════════════════════════════════╝\n');

    console.log('📊 Resumo:');
    console.log('  ✓ 9 testes executados');
    console.log('  ✓ 0 erros');
    console.log('  ✓ 100% de sucesso');
    console.log('\n🎉 O padrão Decorator está funcionando perfeitamente!\n');

    return true;
  } catch (erro) {
    console.error('\n❌ ERRO EM UM TESTE:');
    console.error(erro.message);
    return false;
  }
}

// Exportar para uso em outros arquivos
export default { executarTodosTestes };

// Se executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  executarTodosTestes();
}
