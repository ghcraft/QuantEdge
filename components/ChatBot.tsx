"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface Intent {
  keywords: string[];
  patterns: RegExp[];
  response: string;
  priority: number;
}

/**
 * Componente ChatBot
 * Assistente virtual profissional para responder dúvidas sobre o site
 * Sistema inteligente de reconhecimento de intenções
 */
export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Olá! Sou o assistente do QuantEdge Pro. Como posso ajudar você hoje?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll automático para a última mensagem
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  // Foca no input quando o chat abre
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  /**
   * Normaliza texto removendo acentos e caracteres especiais
   */
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
  };

  /**
   * Calcula similaridade entre duas strings
   */
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    if (longer.length === 0) return 1.0;
    return (
      (longer.length - editDistance(longer, shorter)) / longer.length
    );
  };

  /**
   * Calcula distância de edição (Levenshtein)
   */
  const editDistance = (str1: string, str2: string): number => {
    const matrix: number[][] = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  };

  /**
   * Base de conhecimento com intenções e respostas
   */
  const intents: Intent[] = [
    {
      keywords: ["oi", "ola", "olá", "hey", "hello", "bom dia", "boa tarde", "boa noite"],
      patterns: [/^(oi|ola|olá|hey|hello|bom dia|boa tarde|boa noite)$/i],
      response: `Olá! Fico feliz em ajudar. Sou o assistente do QuantEdge Pro.

Como posso ajudar você hoje? Posso explicar sobre:
• Funcionalidades da plataforma
• Como começar a usar
• Benefícios e diferenciais
• Recursos específicos (Dashboard, Cotações, Trading, etc.)`,
      priority: 10,
    },
    {
      keywords: [
        "o que",
        "quais",
        "funcionalidades",
        "recursos",
        "oferece",
        "disponivel",
        "tem",
        "posso fazer",
        "fazer",
        "servicos",
        "serviços",
      ],
      patterns: [
        /(o que|quais|funcionalidades|recursos|oferece|disponivel|tem|posso fazer|servicos)/i,
      ],
      response: `O QuantEdge Pro é uma plataforma completa de análise financeira profissional.

**Funcionalidades principais:**

📊 **Dashboard** - Visão geral do mercado em tempo real com estatísticas e gráficos

📈 **Cotações** - Gráficos interativos TradingView com cotações de criptomoedas, ações e índices

🔍 **Análises** - Análises técnicas profissionais com indicadores avançados

💼 **Portfolio** - Gestão completa de investimentos com acompanhamento de performance

📰 **Notícias** - Feed atualizado de notícias financeiras de fontes confiáveis

📉 **Trading** - Interface completa de trading com watchlist, múltiplos timeframes e atualização automática

Tudo em uma única plataforma profissional e gratuita.`,
      priority: 9,
    },
    {
      keywords: [
        "por que",
        "motivo",
        "razao",
        "beneficio",
        "vantagem",
        "vale a pena",
        "interessante",
        "util",
        "diferencial",
      ],
      patterns: [
        /(por que|motivo|razao|beneficio|vantagem|vale a pena|interessante|util|diferencial)/i,
      ],
      response: `Por que escolher o QuantEdge Pro?

**Principais benefícios:**

✅ **Dados em Tempo Real** - Informações atualizadas constantemente do mercado

✅ **Interface Profissional** - Design moderno, intuitivo e responsivo

✅ **Tecnologia TradingView** - Gráficos profissionais utilizados por traders do mundo todo

✅ **Análises Técnicas Avançadas** - Ferramentas profissionais para análise de mercado

✅ **Portfolio Inteligente** - Acompanhe seus investimentos com métricas detalhadas

✅ **Notícias Relevantes** - Feed atualizado de fontes confiáveis (InfoMoney, Valor, Exame)

✅ **100% Gratuito** - Acesso completo a todas as funcionalidades sem custos

✅ **Atualização Automática** - Dados e notícias atualizados automaticamente

A plataforma ideal para traders, investidores e analistas que buscam ferramentas profissionais.`,
      priority: 9,
    },
    {
      keywords: [
        "como começar",
        "como usar",
        "cadastrar",
        "registrar",
        "conta",
        "login",
        "entrar",
        "acessar",
        "criar conta",
      ],
      patterns: [
        /(como começar|como usar|cadastrar|registrar|conta|login|entrar|acessar|criar conta)/i,
      ],
      response: `Para começar a usar o QuantEdge Pro é muito simples:

**Passo a passo:**

1. Clique no botão "Começar Agora" ou "Cadastrar" na página
2. Preencha seus dados e crie sua conta gratuitamente
3. Faça login e acesse o Dashboard
4. Explore todas as funcionalidades disponíveis

**Após o cadastro, você terá acesso imediato a:**

• Dashboard com visão geral do mercado
• Cotações em tempo real de múltiplos ativos
• Análises técnicas profissionais
• Gestão completa de portfolio
• Feed de notícias financeiras atualizado
• Interface de trading com gráficos TradingView

Não é necessário cartão de crédito. O acesso é 100% gratuito.

Comece agora mesmo e transforme sua forma de analisar o mercado!`,
      priority: 8,
    },
    {
      keywords: ["dashboard", "painel", "inicio", "home", "principal"],
      patterns: [/(dashboard|painel|inicio|home|principal)/i],
      response: `O **Dashboard** é sua central de informações e ponto de partida.

**O que você encontra:**

• **Estatísticas do Mercado** - Ibovespa, S&P 500, Bitcoin, Dólar em tempo real

• **Acesso Rápido** - Links diretos para todas as funcionalidades da plataforma

• **Gráficos Principais** - Visualização dos principais ativos do mercado

• **Últimas Notícias** - Feed de notícias financeiras mais recentes

• **Visão Geral do Portfolio** - Resumo dos seus investimentos (quando configurado)

• **Market Overview** - Análise geral das tendências do mercado

É o ponto de partida perfeito para suas análises diárias.`,
      priority: 7,
    },
    {
      keywords: [
        "cotacao",
        "cotacoes",
        "preco",
        "preços",
        "grafico",
        "graficos",
        "chart",
        "price",
      ],
      patterns: [
        /(cotacao|cotacoes|preco|preços|grafico|graficos|chart|price)/i,
      ],
      response: `A seção de **Cotações** oferece análise completa de ativos.

**Recursos disponíveis:**

• **Gráficos Interativos** - Gráficos TradingView em tempo real

• **Múltiplos Ativos** - Criptomoedas (BTC, ETH, SOL), Ações (AAPL, MSFT, TSLA), Índices (S&P 500, Ibovespa)

• **Timeframes Flexíveis** - Visualize em 1 minuto, 15 minutos, 1 hora, 4 horas ou 1 dia

• **Análise Técnica** - Indicadores, padrões gráficos e ferramentas profissionais

• **Watchlist** - Lista personalizada de ativos para acompanhamento

• **Atualização Automática** - Dados atualizados a cada 12 segundos

Use os gráficos TradingView para análises profissionais e tomada de decisões informadas.`,
      priority: 7,
    },
    {
      keywords: [
        "analise",
        "analises",
        "tecnica",
        "indicador",
        "indicadores",
        "padrao",
        "sinal",
      ],
      patterns: [
        /(analise|analises|tecnica|indicador|indicadores|padrao|sinal)/i,
      ],
      response: `As **Análises Técnicas** são fundamentais para traders e investidores.

**Ferramentas disponíveis:**

• **Indicadores Técnicos** - RSI, MACD, Médias Móveis, Bollinger Bands e muito mais

• **Padrões de Gráfico** - Identificação automática de padrões de reversão e continuação

• **Sinais de Compra e Venda** - Alertas baseados em análise técnica

• **Análise de Tendências** - Identificação de tendências de alta, baixa e lateralização

• **Suporte e Resistência** - Níveis importantes para tomada de decisão

• **Volume e Liquidez** - Análise de volume para confirmação de movimentos

Tudo integrado com os gráficos TradingView para máxima precisão.`,
      priority: 7,
    },
    {
      keywords: [
        "portfolio",
        "investimento",
        "investimentos",
        "ativos",
        "gestao",
        "carteira",
      ],
      patterns: [
        /(portfolio|investimento|investimentos|ativos|gestao|carteira)/i,
      ],
      response: `O **Portfolio** permite gestão completa dos seus investimentos.

**Funcionalidades:**

• **Adicionar Ativos** - Registre seus investimentos em criptomoedas, ações e outros ativos

• **Acompanhamento em Tempo Real** - Visualize ganhos, perdas e performance atualizada

• **Métricas Detalhadas** - Rentabilidade, valor total, distribuição de ativos

• **Histórico de Performance** - Acompanhe a evolução dos seus investimentos

• **Organização** - Categorize seus ativos por tipo, setor ou estratégia

• **Cálculos Automáticos** - Cálculo automático de rentabilidade e variação percentual

Tenha controle total sobre seus investimentos em uma única interface.`,
      priority: 7,
    },
    {
      keywords: [
        "noticia",
        "noticias",
        "news",
        "feed",
        "atualizacao",
        "informacao",
      ],
      patterns: [
        /(noticia|noticias|news|feed|atualizacao|informacao)/i,
      ],
      response: `O feed de **Notícias** mantém você informado sobre o mercado.

**Características:**

• **Fontes Confiáveis** - InfoMoney, Valor Econômico, Exame, Reuters e outras fontes renomadas

• **Atualização Automática** - Notícias atualizadas a cada 75 segundos

• **Interface Profissional** - Layout estilo TradingView, compacto e eficiente

• **Filtros Inteligentes** - Organize notícias por fonte, categoria ou relevância

• **Notícias em Português** - Conteúdo focado no mercado brasileiro e internacional

• **Links Diretos** - Acesso rápido às notícias completas nas fontes originais

Fique sempre por dentro das movimentações do mercado financeiro.`,
      priority: 7,
    },
    {
      keywords: [
        "trading",
        "trade",
        "operar",
        "grafico trading",
        "watchlist",
        "timeframe",
      ],
      patterns: [
        /(trading|trade|operar|grafico trading|watchlist|timeframe)/i,
      ],
      response: `A interface de **Trading** oferece experiência profissional completa.

**Recursos avançados:**

• **Gráficos TradingView** - Tecnologia profissional utilizada por traders globais

• **Watchlist Completa** - Lista pré-configurada com principais ativos (BTC, ETH, SOL, AAPL, MSFT, etc.)

• **Múltiplos Timeframes** - 1 minuto, 5 minutos, 15 minutos, 1 hora, 4 horas, 1 dia

• **Atualização Automática** - Gráficos atualizados a cada 12 segundos

• **Painel de Informações** - Dados detalhados do ativo (preço, variação, volume, market cap)

• **Layout Responsivo** - Interface adaptável para desktop e mobile

• **Seleção Rápida de Ativos** - Troque entre ativos com um clique na watchlist

A melhor experiência de trading em uma única plataforma, totalmente gratuita.`,
      priority: 7,
    },
    {
      keywords: [
        "preco",
        "custo",
        "valor",
        "pago",
        "gratuito",
        "gratis",
        "free",
        "pago",
        "assinatura",
      ],
      patterns: [
        /(preco|custo|valor|pago|gratuito|gratis|free|assinatura)/i,
      ],
      response: `O QuantEdge Pro é **100% gratuito**!

**Sem custos ocultos:**

✅ Acesso completo a todas as funcionalidades
✅ Dashboard profissional
✅ Cotações em tempo real
✅ Análises técnicas avançadas
✅ Gestão de portfolio
✅ Feed de notícias atualizado
✅ Interface de trading completa
✅ Gráficos TradingView profissionais

**Sem necessidade de:**
• Cartão de crédito
• Assinatura
• Pagamento
• Trial ou período de teste

Cadastre-se agora e comece a usar imediatamente. Tudo gratuito, sem pegadinhas!`,
      priority: 8,
    },
    {
      keywords: [
        "ajuda",
        "suporte",
        "help",
        "problema",
        "duvida",
        "dificuldade",
        "erro",
      ],
      patterns: [
        /(ajuda|suporte|help|problema|duvida|dificuldade|erro)/i,
      ],
      response: `Estou aqui para ajudar você!

**Posso esclarecer sobre:**

• Funcionalidades da plataforma
• Como usar cada seção
• Benefícios e diferenciais
• Como começar a usar
• Recursos específicos (Dashboard, Cotações, Trading, etc.)

**Dicas para melhores respostas:**

• Seja específico na sua pergunta
• Mencione a funcionalidade que tem dúvida
• Pergunte sobre recursos específicos

Ou explore o site diretamente e descubra todas as funcionalidades disponíveis na prática!`,
      priority: 6,
    },
    {
      keywords: [
        "tchau",
        "ate",
        "obrigado",
        "obrigada",
        "valeu",
        "bye",
        "sair",
        "encerrar",
      ],
      patterns: [
        /(tchau|ate|obrigado|obrigada|valeu|bye|sair|encerrar)/i,
      ],
      response: `Foi um prazer ajudar você!

Se tiver mais dúvidas, é só chamar. Estou sempre disponível.

Boa sorte com seus investimentos e análises no QuantEdge Pro!

Lembre-se: estamos aqui para apoiar sua jornada no mercado financeiro.`,
      priority: 5,
    },
  ];

  /**
   * Processa a mensagem do usuário e encontra a melhor resposta
   */
  const getResponse = (userMessage: string): string => {
    const normalized = normalizeText(userMessage);
    const words = normalized.split(/\s+/);

    // Sistema de pontuação
    let bestMatch: Intent | null = null;
    let bestScore = 0;

    for (const intent of intents) {
      let score = 0;

      // Verifica padrões regex
      for (const pattern of intent.patterns) {
        if (pattern.test(userMessage)) {
          score += intent.priority * 2;
          break;
        }
      }

      // Verifica palavras-chave
      for (const keyword of intent.keywords) {
        const normalizedKeyword = normalizeText(keyword);
        if (normalized.includes(normalizedKeyword)) {
          score += intent.priority;
        }
        // Verifica similaridade
        for (const word of words) {
          const similarity = calculateSimilarity(word, normalizedKeyword);
          if (similarity > 0.7) {
            score += intent.priority * similarity;
          }
        }
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = intent;
      }
    }

    // Retorna a melhor resposta ou resposta padrão
    if (bestMatch && bestScore > 2) {
      return bestMatch.response;
    }

    // Resposta padrão mais útil
    return `Entendo sua pergunta. Deixe-me ajudar você da melhor forma.

**Posso esclarecer sobre:**

• **Funcionalidades** - O que a plataforma oferece
• **Como começar** - Passo a passo para usar
• **Benefícios** - Por que escolher o QuantEdge Pro
• **Recursos específicos** - Dashboard, Cotações, Trading, Portfolio, Notícias
• **Preços** - Informações sobre custos (é gratuito!)

Tente reformular sua pergunta ou pergunte sobre algum tópico específico. Por exemplo:
• "O que o site oferece?"
• "Como faço para começar?"
• "Quais são os benefícios?"
• "Como funciona o trading?"`;
  };

  /**
   * Envia uma mensagem do usuário
   */
  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simula delay da resposta do bot (mais realista)
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(userMessage.text),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 800 + Math.random() * 400); // 800-1200ms
  };

  /**
   * Envia mensagem ao pressionar Enter
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-br from-dark-accent to-dark-info
          shadow-2xl shadow-dark-accent/50
          flex items-center justify-center
          transition-all duration-300
          hover:scale-110 hover:shadow-dark-accent/70
          active:scale-95
          ${isOpen ? "rotate-90" : ""}
        `}
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 text-dark-bg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-dark-bg"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* Janela do Chat */}
      {isOpen && (
        <div
          className={`
            fixed bottom-24 right-6 z-50
            w-96 h-[600px] max-h-[calc(100vh-7rem)]
            bg-dark-card border border-dark-border rounded-3xl
            shadow-2xl shadow-dark-accent/20
            flex flex-col
            animate-slide-up
          `}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-dark-border bg-gradient-to-r from-dark-card to-dark-card-hover rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dark-accent to-dark-info flex items-center justify-center shadow-lg">
                  <span className="text-lg">🤖</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-dark-text-primary">
                    Assistente QuantEdge Pro
                  </h3>
                  <p className="text-xs text-dark-text-secondary">Online agora</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-dark-text-secondary">Live</span>
              </div>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-bg scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-transparent">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[85%] rounded-2xl px-4 py-2.5
                    ${
                      message.isUser
                        ? "bg-gradient-to-br from-dark-accent to-dark-info text-dark-bg font-medium"
                        : "bg-dark-card border border-dark-border text-dark-text-primary"
                    }
                    animate-fade-in
                    shadow-sm
                  `}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {message.text}
                  </p>
                  <p
                    className={`text-xs mt-1.5 ${
                      message.isUser ? "opacity-80" : "opacity-60"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Indicador de digitação */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-dark-card border border-dark-border rounded-2xl px-4 py-2.5">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-dark-text-secondary rounded-full animate-bounce"></span>
                    <span
                      className="w-2 h-2 bg-dark-text-secondary rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></span>
                    <span
                      className="w-2 h-2 bg-dark-text-secondary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-4 border-t border-dark-border bg-dark-card rounded-b-3xl">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={isTyping}
                className="
                  flex-1 px-4 py-2.5
                  bg-dark-bg border border-dark-border rounded-2xl
                  text-sm text-dark-text-primary
                  placeholder:text-dark-text-secondary
                  focus:outline-none focus:border-dark-accent focus:ring-1 focus:ring-dark-accent/50
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="
                  w-10 h-10 rounded-full
                  bg-gradient-to-br from-dark-accent to-dark-info
                  flex items-center justify-center
                  disabled:opacity-50 disabled:cursor-not-allowed
                  hover:scale-110 active:scale-95
                  transition-transform duration-200
                  shadow-lg
                "
                aria-label="Enviar mensagem"
              >
                <svg
                  className="w-5 h-5 text-dark-bg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-dark-text-secondary mt-2 text-center">
              Pressione Enter para enviar
            </p>
          </div>
        </div>
      )}
    </>
  );
}
