# MarketLiveFeed 📰

Um feed de notícias financeiras em tempo real, estilo InfoMoney Chat / Bloomberg Terminal, construído com Next.js, TypeScript e Tailwind CSS.

## 🎨 Características

- **Visual Premium**: Design minimalista com fundo preto, cards elegantes e animações suaves
- **Feed em Tempo Real**: Auto-atualização a cada 60-90 segundos
- **RSS Gratuito**: Busca notícias de feeds RSS públicos (Reuters, Yahoo Finance, MarketWatch, Investing)
- **Cron Job**: Atualização automática a cada 1 hora
- **Skeleton Loading**: Placeholders animados durante o carregamento
- **Animações**: Transições suaves para novas notícias

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **RSS Parser** - Parse de feeds RSS
- **Node Cron** - Agendamento de tarefas

## 📦 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Executar em desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

**Nota**: Na primeira execução, o cron job será iniciado automaticamente quando você acessar a página ou qualquer API route.

### 3. Executar em produção

```bash
npm run build
npm start
```

## 🔧 Como Funciona

### Backend

1. **Cron Job** (`lib/cron-job.ts`):
   - Roda a cada 1 hora automaticamente
   - Busca notícias de múltiplos feeds RSS
   - Seleciona 3-6 notícias aleatórias
   - Salva em `data/news.json`

2. **RSS Fetcher** (`lib/rss-fetcher.ts`):
   - Faz parse de feeds RSS públicos
   - Remove duplicatas
   - Retorna notícias formatadas

3. **News Storage** (`lib/news-storage.ts`):
   - Gerencia leitura/escrita do arquivo JSON
   - Cria diretório `data/` automaticamente

### Frontend

1. **NewsFeed** (`components/NewsFeed.tsx`):
   - Busca notícias da API `/api/news`
   - Auto-refresh a cada 75 segundos
   - Detecta novas notícias e anima entradas

2. **NewsCard** (`components/NewsCard.tsx`):
   - Renderiza card individual de notícia
   - Animações hover e entrada
   - Links externos para notícias originais

3. **SkeletonLoader** (`components/SkeletonLoader.tsx`):
   - Placeholders durante carregamento
   - Melhora UX durante fetch

### API Routes

- **GET `/api/news`**: Retorna notícias do arquivo JSON
- **POST `/api/cron/update`**: Força atualização manual das notícias
- **GET `/api/init`**: Inicializa o cron job

## 📁 Estrutura do Projeto

```
marketlivefeed/
├── app/
│   ├── api/
│   │   ├── news/
│   │   │   └── route.ts          # API para buscar notícias
│   │   ├── cron/
│   │   │   └── update/
│   │   │       └── route.ts      # API para atualizar manualmente
│   │   └── init/
│   │       └── route.ts          # API para iniciar cron
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx                # Layout principal
│   └── page.tsx                  # Página inicial
├── components/
│   ├── NewsCard.tsx              # Card de notícia
│   ├── NewsFeed.tsx              # Feed principal
│   └── SkeletonLoader.tsx        # Loading skeleton
├── lib/
│   ├── cron-job.ts               # Lógica do cron job
│   ├── news-storage.ts           # Gerenciamento de arquivo JSON
│   └── rss-fetcher.ts            # Busca de feeds RSS
├── types/
│   └── news.ts                   # Tipos TypeScript
├── data/
│   └── news.json                 # Arquivo de notícias (gerado)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🔄 Atualização Manual

Para forçar atualização das notícias sem esperar o cron:

```bash
# Via API
curl -X POST http://localhost:3000/api/cron/update

# Ou acesse no navegador
http://localhost:3000/api/cron/update
```

## ⚙️ Configuração do Cron

O cron job está configurado para rodar **a cada 1 hora** (`0 * * * *`).

Para alterar a frequência, edite `lib/cron-job.ts`:

```typescript
// A cada 1 hora (padrão)
cron.schedule("0 * * * *", () => { ... });

// A cada 30 minutos
cron.schedule("*/30 * * * *", () => { ... });

// A cada 15 minutos
cron.schedule("*/15 * * * *", () => { ... });
```

## 🎨 Personalização

### Cores

Edite `tailwind.config.ts` para personalizar as cores:

```typescript
colors: {
  dark: {
    bg: "#000000",        // Fundo principal
    card: "#0a0a0a",      // Fundo dos cards
    border: "#1a1a1a",    // Bordas
    accent: "#00ff88",    // Cor de destaque
    // ...
  },
}
```

### Feeds RSS

Adicione ou remova feeds em `lib/rss-fetcher.ts`:

```typescript
const RSS_FEEDS = [
  {
    name: "Nome da Fonte",
    url: "https://feed-url.com/rss",
  },
  // ...
];
```

## 🐛 Troubleshooting

### Cron não está rodando

- O cron job inicia automaticamente quando você acessa qualquer API route
- Acesse `http://localhost:3000/api/init` para forçar inicialização
- Verifique os logs do console para confirmar que iniciou

### Nenhuma notícia aparece

- Verifique se o arquivo `data/news.json` existe
- Force atualização via `/api/cron/update`
- Verifique os logs do console para erros de RSS

### Erros de CORS ou RSS

- Alguns feeds podem bloquear requisições
- Verifique se as URLs dos feeds estão corretas
- Alguns feeds podem exigir headers específicos

## 📝 Notas

- O arquivo `data/news.json` é gerado automaticamente
- O diretório `data/` é criado automaticamente
- O cron job só funciona em ambiente de servidor (não no cliente)
- Para desenvolvimento, use a rota `/api/cron/update` para atualizar manualmente

## 🔒 Segurança

- Não exponha credenciais em feeds RSS
- Use apenas feeds públicos e confiáveis
- O arquivo JSON é local e não deve ser commitado (já está no `.gitignore`)

## 📄 Licença

Este projeto é open source e está disponível para uso pessoal e comercial.

---

Desenvolvido com ❤️ usando Next.js + TypeScript + Tailwind CSS

