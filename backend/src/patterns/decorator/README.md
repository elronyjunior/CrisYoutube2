# 🎨 Padrão Decorator - CrisYoutube2

## 📋 Visão Geral

O **Padrão Decorator** foi implementado neste projeto para enriquecer dinamicamente os dados dos vídeos sem modificar a classe original `VideoService`. Cada decorator adiciona responsabilidades específicas de forma desacoplada.

## 🏗️ Arquitetura

### Hierarquia de Classes

```
VideoDecorator (classe base abstrata)
├── VideoSizeFormatterDecorator
├── VideoOriginBadgeDecorator
├── VideoTitleCleanerDecorator
└── VideoDateFormatterDecorator
```

### Factory Pattern

A classe `VideoDecoratorFactory` centraliza a aplicação dos decorators, facilitando seu uso.

---

## 📁 Estrutura de Arquivos

```
backend/src/patterns/decorator/
├── VideoDecorator.js                    # Classe base abstrata
├── VideoSizeFormatterDecorator.js       # Formata tamanho (2.5 MB)
├── VideoOriginBadgeDecorator.js         # Adiciona origem (YouTube/Local)
├── VideoTitleCleanerDecorator.js        # Limpa e normaliza título
├── VideoDateFormatterDecorator.js       # Formata data em português
├── VideoDecoratorFactory.js             # Factory centralizador
└── EXEMPLOS_DECORATOR.js                # Exemplos de uso
```

---

## 🎯 Decorators Implementados

### 1. **VideoSizeFormatterDecorator**

Converte bytes em unidades legíveis.

**Campo adicionado:** `sizeFormatted`

**Exemplo:**
```javascript
// Input
{ size: 2621440 }

// Output
{ size: 2621440, sizeFormatted: "2.50 MB" }
```

**Conversão suportada:**
- Bytes → KB → MB → GB → TB

---

### 2. **VideoOriginBadgeDecorator**

Identifica e marca a origem do vídeo.

**Campo adicionado:** `originBadge`

**Exemplo:**
```javascript
// Input
{ sourceType: "youtube" }

// Output
{
  sourceType: "youtube",
  originBadge: {
    label: "▶ YouTube",
    color: "#FF0000",
    emoji: "📺",
    description: "Vídeo importado do YouTube"
  }
}
```

**Tipos suportados:**
- **YouTube** (▶ 📺): Vídeos do YouTube - cor vermelha
- **Local Upload** (⬆ 📤): Uploads locais - cor verde

---

### 3. **VideoTitleCleanerDecorator**

Normaliza e limpa o título do vídeo.

**Campo adicionado:** `titleCleaned`

**Exemplo:**
```javascript
// Input
{ title: "video__teste---2024.mp4" }

// Output
{ title: "video__teste---2024.mp4", titleCleaned: "Video Teste 2024" }
```

**Transformações:**
- Remove extensões de arquivo
- Substitui `_` por espaços
- Remove múltiplos hífens
- Remove caracteres especiais
- Capitaliza cada palavra

---

### 4. **VideoDateFormatterDecorator**

Formata datas em português com tempo relativo.

**Campos adicionados:** `createdAtFormatted`, `createdAtRelative`

**Exemplo:**
```javascript
// Input
{ createdAt: "2026-06-09T15:30:00.000Z" }

// Output
{
  createdAt: "2026-06-09T15:30:00.000Z",
  createdAtFormatted: "09/06/2026 15:30",
  createdAtRelative: "há 2 horas"
}
```

**Formatos de tempo relativo:**
- "agora mesmo" (< 1 minuto)
- "há X minuto(s)" (< 1 hora)
- "há X hora(s)" (< 1 dia)
- "há X dia(s)" (< 7 dias)
- "há X semana(s)" (< 1 mês)
- "há X mês/meses" (< 1 ano)
- "há X ano(s)" (1+ anos)

---

## 🔧 Como Usar

### Opção 1: Factory (Recomendado ⭐)

```javascript
import { VideoDecoratorFactory } from './patterns/decorator/VideoDecoratorFactory.js';

// Aplicar TODOS os decorators
const videoDecorado = VideoDecoratorFactory.applyAllDecorators(videoData);

// Aplicar decorators SELETIVOS
const videoPartial = VideoDecoratorFactory.applyDecorators(videoData, [
  'size',    // VideoSizeFormatterDecorator
  'origin'   // VideoOriginBadgeDecorator
]);
```

### Opção 2: Manual com instâncias

```javascript
import { VideoSizeFormatterDecorator } from './patterns/decorator/VideoSizeFormatterDecorator.js';
import { VideoOriginBadgeDecorator } from './patterns/decorator/VideoOriginBadgeDecorator.js';

const decorator1 = new VideoSizeFormatterDecorator(videoData);
const decorated = decorator1.decorate();

const decorator2 = new VideoOriginBadgeDecorator(decorated);
const finalVideo = decorator2.decorate();
```

### Opção 3: Encadeamento (Chain)

```javascript
const sizeDecorator = new VideoSizeFormatterDecorator(videoData);
const originDecorator = new VideoOriginBadgeDecorator(videoData);

const result = sizeDecorator.chain(originDecorator);
```

---

## 📊 Exemplo de Dados Decorados

### Antes (Bruto)
```json
{
  "id": "abc-123",
  "title": "meu_video_teste",
  "filename": "abc-123.mp4",
  "uploader": "admin",
  "createdAt": "2026-06-09T15:30:00.000Z",
  "thumbnail": null,
  "sourceType": "local",
  "size": 2621440
}
```

### Depois (Decorado)
```json
{
  "id": "abc-123",
  "title": "meu_video_teste",
  "titleCleaned": "Meu Video Teste",
  "filename": "abc-123.mp4",
  "uploader": "admin",
  "createdAt": "2026-06-09T15:30:00.000Z",
  "createdAtFormatted": "09/06/2026 15:30",
  "createdAtRelative": "há 2 horas",
  "thumbnail": null,
  "sourceType": "local",
  "size": 2621440,
  "sizeFormatted": "2.50 MB",
  "originBadge": {
    "label": "⬆ Upload Local",
    "color": "#4CAF50",
    "emoji": "📤",
    "description": "Vídeo enviado localmente"
  },
  "decorators": [
    "VideoSizeFormatter",
    "VideoOriginBadge",
    "VideoTitleCleaner",
    "VideoDateFormatter"
  ]
}
```

---

## 🚀 Integração no Backend

### VideoService.js

Os decorators são aplicados **automaticamente** em dois pontos:

1. **Ao salvar** um novo vídeo:
```javascript
async save(videoSource, user) {
  // ... lógica de salvamento ...
  const decoratedVideo = VideoDecoratorFactory.applyAllDecorators(newVideo);
  return decoratedVideo;
}
```

2. **Ao listar** vídeos:
```javascript
async listAll() {
  const videos = db.videos || [];
  return videos.map(video => VideoDecoratorFactory.applyAllDecorators(video));
}
```

**Resultado:** O frontend recebe dados já decorados e prontos para exibir!

---

## 💻 Frontend - Consumo de Dados

```javascript
// Os dados já vêm decorados do backend
const response = await fetch('/api/videos');
const videos = await response.json();

videos.forEach(video => {
  console.log(video.titleCleaned);           // "Meu Video Teste"
  console.log(video.sizeFormatted);          // "2.50 MB"
  console.log(video.originBadge.emoji);      // "📤"
  console.log(video.createdAtRelative);      // "há 2 horas"
  console.log(video.createdAtFormatted);     // "09/06/2026 15:30"
});
```

---

## 🎓 Criar um Decorator Customizado

É muito fácil criar novos decorators! Veja o exemplo:

```javascript
import { VideoDecorator } from './VideoDecorator.js';

export class VideoRatingDecorator extends VideoDecorator {
  decorate() {
    const decorated = { ...this.videoData };

    // Sua lógica aqui
    decorated.rating = this._calculateRating(decorated);

    decorated.decorators = decorated.decorators || [];
    decorated.decorators.push('VideoRating');

    return decorated;
  }

  _calculateRating(video) {
    // Lógica customizada
    return Math.random() * 5;
  }
}
```

Depois adicione na `VideoDecoratorFactory`:

```javascript
static _applyDecorator(videoData, decoratorName) {
  const decoratorMap = {
    size: VideoSizeFormatterDecorator,
    rating: VideoRatingDecorator  // ← Novo!
    // ...
  };
  // ...
}
```

---

## 🔮 Possíveis Extensões

1. **VideoEncryptionDecorator** - Criptografa dados sensíveis
2. **VideoCompressionDecorator** - Comprime metadados
3. **VideoCacheDecorator** - Adiciona headers de cache HTTP
4. **VideoSearchDecorator** - Índices para busca full-text
5. **VideoAccessControlDecorator** - Máscara dados por permissão
6. **VideoQualityDecorator** - Detecta qualidade (SD/HD/4K)
7. **VideoLanguageDecorator** - Detecta idioma automático

---

## ✅ Vantagens da Implementação

| Vantagem | Descrição |
|----------|-----------|
| **Flexibilidade** | Adicionar/remover decorators sem quebrar código |
| **Reutilização** | Decorators podem ser combinados de infinitas formas |
| **Manutenibilidade** | Cada decorator é responsável por uma coisa |
| **Testabilidade** | Fácil testar cada decorator independentemente |
| **Escalabilidade** | Suporta crescimento sem refatoração |
| **Separação de Responsabilidades** | VideoService não precisa saber de formatação |
| **DRY** | Lógica de transformação centralizada |

---

## 📖 Referências

- [Design Patterns - Decorator](https://refactoring.guru/design-patterns/decorator)
- [Factory Pattern](https://refactoring.guru/design-patterns/factory-method)

---

## 📝 Exemplos Executáveis

Veja o arquivo `EXEMPLOS_DECORATOR.js` para 7 exemplos práticos:

```bash
# Para executar os exemplos
node backend/src/patterns/decorator/EXEMPLOS_DECORATOR.js
```

---

**Implementado com ❤️ para CrisYoutube2**
