"use client";

import { useState } from "react";
import FinancialChart from "@/components/FinancialChart";
import Providers from "../providers";

// Força renderização dinâmica (usa Context e hooks do cliente)
export const dynamic = 'force-dynamic';

interface TechnicalIndicator {
  name: string;
  value: string;
  signal: "buy" | "sell" | "neutral";
  description: string;
}

interface Analysis {
  id: string;
  title: string;
  asset: string;
  assetName: string;
  type: "bullish" | "bearish" | "neutral";
  summary: string;
  technicalIndicators: TechnicalIndicator[];
  support?: string;
  resistance?: string;
  recommendation: string;
  riskLevel: "baixo" | "médio" | "alto";
  targetPrice?: string;
  stopLoss?: string;
  date: string;
  patterns: string[];
  trend: "alta" | "baixa" | "lateral";
}

const ANALYSES: Analysis[] = [
  {
    id: "1",
    title: "Ibovespa em Alta - Formação de Fundo Duplo",
    asset: "INDEX:IBOV",
    assetName: "Ibovespa",
    type: "bullish",
    summary: "O índice brasileiro apresenta sinais de continuidade da tendência de alta, com formação de fundo duplo confirmada. O rompimento da resistência em 130.000 pontos abre espaço para movimento até 135.000 pontos. Volume crescente confirma o movimento de alta.",
    technicalIndicators: [
      { name: "RSI (14)", value: "58", signal: "buy", description: "RSI em zona neutra-alta, indicando força compradora" },
      { name: "MACD", value: "Positivo", signal: "buy", description: "MACD acima da linha de sinal, momentum positivo" },
      { name: "Médias Móveis", value: "50 > 200", signal: "buy", description: "Cruzamento de ouro confirmado, tendência de alta" },
      { name: "Volume", value: "Alto", signal: "buy", description: "Volume acima da média confirma movimento" },
    ],
    support: "125.000",
    resistance: "135.000",
    recommendation: "Mantém posição comprada com stop em 123.000. Alvo em 135.000 pontos.",
    riskLevel: "médio",
    targetPrice: "135.000",
    stopLoss: "123.000",
    date: "2024-01-15",
    patterns: ["Fundo Duplo", "Rompimento de Resistência"],
    trend: "alta",
  },
  {
    id: "2",
    title: "Bitcoin em Consolidação - Formação de Triângulo",
    asset: "BINANCE:BTCUSDT",
    assetName: "Bitcoin",
    type: "neutral",
    summary: "Criptomoeda mantém força acima de $40.000, formando padrão de triângulo simétrico. Volume em queda sugere consolidação antes de próximo movimento. Aguardar rompimento para definir direção.",
    technicalIndicators: [
      { name: "RSI (14)", value: "52", signal: "neutral", description: "RSI em zona neutra, sem divergências" },
      { name: "MACD", value: "Neutro", signal: "neutral", description: "MACD próximo à linha zero, sem direção definida" },
      { name: "Bollinger Bands", value: "Contração", signal: "neutral", description: "Bandas se contraindo, indicando consolidação" },
      { name: "Volume", value: "Baixo", signal: "neutral", description: "Volume abaixo da média, aguardando confirmação" },
    ],
    support: "$40.000",
    resistance: "$45.000",
    recommendation: "Aguardar rompimento de $45.000 para entrada comprada ou queda abaixo de $40.000 para venda.",
    riskLevel: "alto",
    targetPrice: "$45.000 ou $38.000",
    stopLoss: "$39.000 ou $46.000",
    date: "2024-01-15",
    patterns: ["Triângulo Simétrico", "Consolidação"],
    trend: "lateral",
  },
  {
    id: "3",
    title: "Vale com Potencial de Alta - Fundo Duplo Confirmado",
    asset: "BMFBOVESPA:VALE3",
    assetName: "Vale S.A.",
    type: "bullish",
    summary: "Ação apresenta formação de fundo duplo e rompimento de linha de tendência de baixa. Volume crescente confirma movimento. Indicadores técnicos apontam para continuação da alta.",
    technicalIndicators: [
      { name: "RSI (14)", value: "62", signal: "buy", description: "RSI acima de 50, força compradora" },
      { name: "MACD", value: "Positivo", signal: "buy", description: "MACD cruzou linha de sinal para cima" },
      { name: "Médias Móveis", value: "20 > 50", signal: "buy", description: "Curto prazo acima de médio prazo" },
      { name: "Volume", value: "Muito Alto", signal: "buy", description: "Volume 2x acima da média" },
    ],
    support: "R$ 68,00",
    resistance: "R$ 75,00",
    recommendation: "Entrada em pullback com stop em R$ 67,00. Alvo em R$ 75,00.",
    riskLevel: "médio",
    targetPrice: "R$ 75,00",
    stopLoss: "R$ 67,00",
    date: "2024-01-14",
    patterns: ["Fundo Duplo", "Rompimento de Tendência"],
    trend: "alta",
  },
  {
    id: "4",
    title: "Petrobras em Correção - Teste de Suporte",
    asset: "BMFBOVESPA:PETR4",
    assetName: "Petrobras",
    type: "bearish",
    summary: "Ação apresenta correção após alta recente. Testando suporte importante em R$ 32,00. Indicadores mostram enfraquecimento do momentum. Aguardar confirmação de reversão ou continuação da correção.",
    technicalIndicators: [
      { name: "RSI (14)", value: "45", signal: "sell", description: "RSI abaixo de 50, perda de força" },
      { name: "MACD", value: "Negativo", signal: "sell", description: "MACD abaixo da linha de sinal" },
      { name: "Médias Móveis", value: "20 < 50", signal: "sell", description: "Curto prazo abaixo de médio prazo" },
      { name: "Volume", value: "Médio", signal: "neutral", description: "Volume normal, sem confirmação" },
    ],
    support: "R$ 32,00",
    resistance: "R$ 36,00",
    recommendation: "Aguardar teste de suporte em R$ 32,00. Se romper, alvo em R$ 30,00. Se segurar, entrada comprada.",
    riskLevel: "alto",
    targetPrice: "R$ 30,00 ou R$ 36,00",
    stopLoss: "R$ 33,00 ou R$ 35,00",
    date: "2024-01-14",
    patterns: ["Correção", "Teste de Suporte"],
    trend: "baixa",
  },
  {
    id: "5",
    title: "Apple com Momentum Positivo - Rompimento Histórico",
    asset: "NASDAQ:AAPL",
    assetName: "Apple Inc.",
    type: "bullish",
    summary: "Ação mantém tendência de alta com rompimento de resistência histórica em $195. Volume acima da média confirma movimento. Todos os indicadores técnicos apontam para continuação da alta.",
    technicalIndicators: [
      { name: "RSI (14)", value: "68", signal: "buy", description: "RSI forte, mas não sobrecomprado" },
      { name: "MACD", value: "Muito Positivo", signal: "buy", description: "MACD em máxima histórica" },
      { name: "Médias Móveis", value: "Todas Alinhadas", signal: "buy", description: "Todas as médias em alta" },
      { name: "Volume", value: "Alto", signal: "buy", description: "Volume 1.5x acima da média" },
    ],
    support: "$180",
    resistance: "$200",
    recommendation: "Manter posição com trailing stop. Alvo em $200. Stop dinâmico em $190.",
    riskLevel: "baixo",
    targetPrice: "$200",
    stopLoss: "$190",
    date: "2024-01-13",
    patterns: ["Rompimento Histórico", "Tendência de Alta"],
    trend: "alta",
  },
  {
    id: "6",
    title: "Ethereum em Formação de Topo Duplo",
    asset: "BINANCE:ETHUSDT",
    assetName: "Ethereum",
    type: "bearish",
    summary: "Criptomoeda apresenta divergência de momentum com formação de topo duplo. RSI mostra divergência negativa. Volume em queda confirma enfraquecimento. Possível correção para $2.400.",
    technicalIndicators: [
      { name: "RSI (14)", value: "58", signal: "sell", description: "Divergência negativa, perda de força" },
      { name: "MACD", value: "Negativo", signal: "sell", description: "MACD cruzou para baixo" },
      { name: "Médias Móveis", value: "20 < 50", signal: "sell", description: "Curto prazo abaixo de médio prazo" },
      { name: "Volume", value: "Baixo", signal: "sell", description: "Volume em queda, confirma topo" },
    ],
    support: "$2.400",
    resistance: "$2.800",
    recommendation: "Considerar proteção de lucros. Se romper $2.400, alvo em $2.200. Stop em $2.850.",
    riskLevel: "alto",
    targetPrice: "$2.200",
    stopLoss: "$2.850",
    date: "2024-01-13",
    patterns: ["Topo Duplo", "Divergência Negativa"],
    trend: "baixa",
  },
];

/**
 * Página de Análises
 * Análises técnicas detalhadas com indicadores e recomendações
 */
export default function AnalisesPage() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(ANALYSES[0]);
  const [filterType, setFilterType] = useState<"all" | "bullish" | "bearish" | "neutral">("all");
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleString("pt-BR"));

  const filteredAnalyses = ANALYSES.filter(
    (analysis) => filterType === "all" || analysis.type === filterType
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bullish":
        return "text-dark-success border-dark-success/30 bg-dark-success/10";
      case "bearish":
        return "text-dark-danger border-dark-danger/30 bg-dark-danger/10";
      default:
        return "text-dark-warning border-dark-warning/30 bg-dark-warning/10";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "bullish":
        return "Alta";
      case "bearish":
        return "Baixa";
      default:
        return "Neutro";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "baixo":
        return "text-dark-success bg-dark-success/10 border-dark-success/30";
      case "médio":
        return "text-dark-warning bg-dark-warning/10 border-dark-warning/30";
      default:
        return "text-dark-danger bg-dark-danger/10 border-dark-danger/30";
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "alta":
        return "text-dark-success";
      case "baixa":
        return "text-dark-danger";
      default:
        return "text-dark-warning";
    }
  };

  return (
    <Providers>
      <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-dark-bg">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-dark-border">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-green-400 to-transparent"></div>
                <h1 className="text-4xl md:text-6xl font-extralight tracking-tight">
                  <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                    Análises Técnicas
                  </span>
                </h1>
              </div>
              <p className="text-lg text-dark-text-muted/80 font-light max-w-2xl mx-auto">
                Análises profissionais com indicadores técnicos, padrões gráficos e recomendações de investimento
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Filtros */}
          <section className="mb-8">
            <div className="flex gap-3 flex-wrap">
              {(["all", "bullish", "bearish", "neutral"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-light transition-all ${
                    filterType === type
                      ? "bg-dark-accent/20 text-dark-accent border border-dark-accent/50"
                      : "bg-dark-bg-secondary text-dark-text-muted hover:text-dark-text-primary border border-dark-border hover:border-dark-accent/30"
                  }`}
                >
                  {type === "all" ? "Todas" : type === "bullish" ? "Alta" : type === "bearish" ? "Baixa" : "Neutro"}
                </button>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de Análises */}
            <div className="lg:col-span-2 space-y-4">
              {filteredAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className={`bg-dark-card/40 backdrop-blur-xl border rounded-3xl p-6 transition-all cursor-pointer ${
                    selectedAnalysis?.id === analysis.id
                      ? "border-dark-accent/50 bg-dark-accent/5"
                      : "border-dark-border/50 hover:border-dark-accent/30"
                  }`}
                  onClick={() => setSelectedAnalysis(analysis)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-light text-dark-text-primary mb-2">
                        {analysis.title}
                      </h3>
                      <div className="flex items-center gap-3 mb-3">
                        <p className="text-sm text-dark-text-muted font-mono">
                          {analysis.asset}
                        </p>
                        <span className={`px-2 py-1 rounded-lg text-xs font-light border ${getTypeColor(analysis.type)}`}>
                          {getTypeLabel(analysis.type)}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-light border ${getRiskColor(analysis.riskLevel)}`}>
                          Risco {analysis.riskLevel}
                        </span>
                        <span className={`text-xs font-light ${getTrendColor(analysis.trend)}`}>
                          Tendência: {analysis.trend}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-dark-text-muted/80 font-light mb-4 line-clamp-2">
                    {analysis.summary}
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    {analysis.patterns.map((pattern, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-dark-bg-secondary/50 text-dark-text-muted rounded-lg border border-dark-border/30">
                        {pattern}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Painel de Análise Detalhada */}
            <div className="lg:col-span-1">
              {selectedAnalysis ? (
                <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 sticky top-24 space-y-6">
                  {/* Header */}
                  <div>
                    <h3 className="text-xl font-light text-dark-text-primary mb-2">
                      {selectedAnalysis.title}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap mb-4">
                      <p className="text-sm text-dark-text-muted font-mono">
                        {selectedAnalysis.asset}
                      </p>
                      <span className={`px-2 py-1 rounded-lg text-xs font-light border ${getTypeColor(selectedAnalysis.type)}`}>
                        {getTypeLabel(selectedAnalysis.type)}
                      </span>
                    </div>
                  </div>

                  {/* Resumo */}
                  <div>
                    <h4 className="text-sm font-light text-dark-text-primary mb-3">Resumo da Análise</h4>
                    <p className="text-sm text-dark-text-muted/80 font-light leading-relaxed">
                      {selectedAnalysis.summary}
                    </p>
                  </div>

                  {/* Indicadores Técnicos */}
                  <div>
                    <h4 className="text-sm font-light text-dark-text-primary mb-3">Indicadores Técnicos</h4>
                    <div className="space-y-2">
                      {selectedAnalysis.technicalIndicators.map((indicator, idx) => (
                        <div key={idx} className="p-3 bg-dark-bg-secondary/50 rounded-2xl border border-dark-border/30">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-light text-dark-text-primary">{indicator.name}</span>
                            <span className={`text-xs px-2 py-1 rounded-lg ${
                              indicator.signal === "buy" ? "text-dark-success bg-dark-success/10" :
                              indicator.signal === "sell" ? "text-dark-danger bg-dark-danger/10" :
                              "text-dark-warning bg-dark-warning/10"
                            }`}>
                              {indicator.value}
                            </span>
                          </div>
                          <p className="text-xs text-dark-text-muted font-light">{indicator.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Níveis Técnicos */}
                  {(selectedAnalysis.support || selectedAnalysis.resistance) && (
                    <div className="p-4 bg-dark-bg-secondary/50 rounded-2xl border border-dark-border/30">
                      <h4 className="text-sm font-light text-dark-text-primary mb-3">Níveis Técnicos</h4>
                      <div className="space-y-2 text-sm">
                        {selectedAnalysis.support && (
                          <div className="flex justify-between">
                            <span className="text-dark-text-muted">Suporte:</span>
                            <span className="text-dark-success font-light">{selectedAnalysis.support}</span>
                          </div>
                        )}
                        {selectedAnalysis.resistance && (
                          <div className="flex justify-between">
                            <span className="text-dark-text-muted">Resistência:</span>
                            <span className="text-dark-danger font-light">{selectedAnalysis.resistance}</span>
                          </div>
                        )}
                        {selectedAnalysis.targetPrice && (
                          <div className="flex justify-between">
                            <span className="text-dark-text-muted">Alvo:</span>
                            <span className="text-dark-accent font-light">{selectedAnalysis.targetPrice}</span>
                          </div>
                        )}
                        {selectedAnalysis.stopLoss && (
                          <div className="flex justify-between">
                            <span className="text-dark-text-muted">Stop Loss:</span>
                            <span className="text-dark-danger font-light">{selectedAnalysis.stopLoss}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Recomendação */}
                  <div>
                    <h4 className="text-sm font-light text-dark-text-primary mb-3">Recomendação</h4>
                    <p className="text-sm text-dark-accent font-light bg-dark-accent/10 border border-dark-accent/30 rounded-2xl p-3">
                      {selectedAnalysis.recommendation}
                    </p>
                  </div>

                  {/* Gráfico */}
                  <div>
                    <FinancialChart
                      symbol={selectedAnalysis.asset}
                      height={300}
                      interval="15"
                      hideTopToolbar={true}
                      hideSideToolbar={true}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs text-dark-text-muted">
                    <p>Análise de {new Date(selectedAnalysis.date).toLocaleDateString("pt-BR")}</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-dark-accent rounded-full animate-pulse"></div>
                      <p>Dados em tempo real</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 text-center">
                  <p className="text-sm text-dark-text-muted font-light">
                    Selecione uma análise para ver detalhes
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Providers>
  );
}
