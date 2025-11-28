# 📋 Instruções Detalhadas - MarketLiveFeed

## 🚀 Passo a Passo para Executar

### 1. Instalação das Dependências

Abra o terminal na pasta do projeto e execute:

```bash
npm install
```

Isso instalará todas as dependências necessárias:
- Next.js (framework React)
- TypeScript (tipagem)
- Tailwind CSS (estilização)
- RSS Parser (parse de feeds)
- Node Cron (agendamento)

### 2. Executar o Projeto

#### Modo Desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:3000`

**Importante**: Na primeira execução, o cron job buscará notícias imediatamente. Isso pode levar alguns segundos.

#### Modo Produção

```bash
npm run build
npm start
```

### 3. Primeira Execução

1. **Aguarde a primeira busca**: O cron job roda imediatamente ao iniciar
2. **Verifique o arquivo**: O arquivo `data/news.json` será criado automaticamente
3. **Acesse o site**: Abra `http://localhost:3000` no navegador

### 4. Forçar Atualização Manual

Se quiser atualizar as notícias sem esperar o cron (a cada 1 hora):

**Opção 1 - Via Navegador:**
```
http://localhost:3000/api/cron/update
```

**Opção 2 - Via Terminal (PowerShell):**
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/cron/update -Method POST
```

**Opção 3 - Via cURL (se tiver instalado):**
```bash
curl -X POST http://localhost:3000/api/cron/update
```

## 📁 Estrutura de Arquivos Explicada

```
marketlivefeed/
│
├── app/                          # Diretório principal do Next.js (App Router)
│   ├── api/                      # Rotas de API
│   │   ├── news/
│   │   │   └── route.ts          # GET /api/news - Retorna notícias
│   │   ├── cron/
│   │   │   └── update/
│   │   │       └── route.ts      # POST /api/cron/update - Força atualização
│   │   └── init/
│   │       └── route.ts          # GET /api/init - Inicia cron job
│   ├── globals.css               # Estilos globais + Tailwind
│   ├── layout.tsx                # Layout HTML base
│   └── page.tsx                  # Página inicial (home)
│
├── components/                   # Componentes React reutilizáveis
│   ├── NewsCard.tsx              # Card individual de notícia
│   ├── NewsFeed.tsx              # Feed completo com auto-refresh
│   └── SkeletonLoader.tsx        # Loading skeleton
│
├── lib/                          # Bibliotecas e utilitários
│   ├── cron-job.ts               # Lógica do cron job (agendamento)
│   ├── news-storage.ts           # Leitura/escrita do arquivo JSON
│   └── rss-fetcher.ts            # Busca de feeds RSS
│
├── types/                        # Definições TypeScript
│   └── news.ts                   # Tipos para NewsItem e NewsData
│
├── data/                         # Dados gerados (não commitado)
│   └── news.json                 # Arquivo JSON com as notícias
│
├── server.js                     # Servidor customizado (inicia cron)
├── package.json                  # Dependências e scripts
├── tsconfig.json                 # Configuração TypeScript
├── tailwind.config.ts            # Configuração Tailwind CSS
└── README.md                     # Documentação principal
```

## 🔍 Como Cada Parte Funciona

### Backend (Busca de Notícias)

1. **Cron Job** (`lib/cron-job.ts`):
   - Roda automaticamente a cada 1 hora
   - Chama `fetchAllNews()` para buscar RSS
   - Salva resultado em `data/news.json`

2. **RSS Fetcher** (`lib/rss-fetcher.ts`):
   - Faz requisições HTTP para feeds RSS
   - Converte XML para objetos JavaScript
   - Remove duplicatas
   - Seleciona 3-6 notícias aleatórias

3. **News Storage** (`lib/news-storage.ts`):
   - Cria diretório `data/` se não existir
   - Salva notícias em formato JSON
   - Lê notícias do arquivo

### Frontend (Exibição)

1. **NewsFeed** (`components/NewsFeed.tsx`):
   - Componente principal que gerencia o estado
   - Faz fetch de `/api/news` a cada 75 segundos
   - Detecta novas notícias e anima entrada
   - Mostra skeleton durante loading

2. **NewsCard** (`components/NewsCard.tsx`):
   - Renderiza card individual
   - Formata data relativa ("2h atrás")
   - Animações hover e entrada

3. **SkeletonLoader** (`components/SkeletonLoader.tsx`):
   - Placeholders animados
   - Melhora UX durante carregamento

### API Routes

1. **GET `/api/news`**:
   - Lê `data/news.json`
   - Retorna JSON com notícias
   - Headers para evitar cache

2. **POST `/api/cron/update`**:
   - Força atualização imediata
   - Útil para testes

## ⚙️ Configurações Avançadas

### Alterar Frequência do Cron

Edite `lib/cron-job.ts`, linha 45:

```typescript
// A cada 1 hora (padrão)
cron.schedule("0 * * * *", () => { ... });

// A cada 30 minutos
cron.schedule("*/30 * * * *", () => { ... });

// A cada 15 minutos
cron.schedule("*/15 * * * *", () => { ... });
```

### Alterar Intervalo de Auto-Refresh

Edite `components/NewsFeed.tsx`, linha ~60:

```typescript
// 75 segundos (padrão)
refreshIntervalRef.current = setInterval(() => {
  fetchNews();
}, 75000);

// 60 segundos
}, 60000);

// 90 segundos
}, 90000);
```

### Adicionar Novos Feeds RSS

Edite `lib/rss-fetcher.ts`, adicione no array `RSS_FEEDS`:

```typescript
{
  name: "Nome da Fonte",
  url: "https://feed-url.com/rss",
},
```

### Personalizar Cores

Edite `tailwind.config.ts`:

```typescript
colors: {
  dark: {
    bg: "#000000",        // Fundo
    card: "#0a0a0a",      // Cards
    accent: "#00ff88",    // Destaque
    // ...
  },
}
```

## 🐛 Solução de Problemas

### Problema: Nenhuma notícia aparece

**Solução:**
1. Verifique se `data/news.json` existe
2. Force atualização: `http://localhost:3000/api/cron/update`
3. Verifique console do servidor para erros
4. Alguns feeds RSS podem estar temporariamente indisponíveis

### Problema: Cron não está rodando

**Solução:**
1. Certifique-se de usar `npm run dev` (não `next dev`)
2. O `server.js` é necessário para iniciar o cron
3. Verifique logs do servidor: deve aparecer "⏰ Cron job iniciado"

### Problema: Erros de CORS ou RSS

**Solução:**
1. Alguns feeds podem bloquear requisições
2. O sistema tenta todos os feeds e usa os que funcionarem
3. Verifique se as URLs dos feeds estão corretas

### Problema: Porta 3000 já em uso

**Solução:**
```bash
# Windows PowerShell
$env:PORT=3001; npm run dev

# Linux/Mac
PORT=3001 npm run dev
```

## 📊 Monitoramento

### Ver Logs do Servidor

O servidor mostra logs no console:
- `🔄 Iniciando atualização de notícias...`
- `✅ Atualização concluída! X notícias em Yms`
- `⏰ Cron job iniciado`

### Verificar Arquivo JSON

O arquivo `data/news.json` contém:
```json
{
  "lastUpdate": "2024-01-01T12:00:00.000Z",
  "news": [
    {
      "id": "Reuters Business-1234567890-0",
      "title": "Título da Notícia",
      "link": "https://...",
      "pubDate": "2024-01-01T12:00:00.000Z",
      "source": "Reuters Business",
      "description": "..."
    }
  ]
}
```

## 🎯 Próximos Passos

1. **Personalizar Visual**: Edite `tailwind.config.ts` e `components/`
2. **Adicionar Feeds**: Adicione mais fontes em `lib/rss-fetcher.ts`
3. **Ajustar Frequência**: Modifique intervalos conforme necessário
4. **Deploy**: Prepare para produção com `npm run build`

---

**Dúvidas?** Consulte o `README.md` principal para mais informações.

