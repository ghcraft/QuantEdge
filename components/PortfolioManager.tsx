"use client";

import { useState, useEffect, useCallback } from "react";
import FinancialChart from "./FinancialChart";
import { PortfolioService, TransactionService, PortfolioAsset } from "@/lib/portfolio";
import PortfolioSearch from "./PortfolioSearch";
import { updatePortfolioPrices } from "@/lib/price-updater";

/**
 * Componente PortfolioManager
 * Gerencia portfolio completo com funcionalidades avançadas
 */
export default function PortfolioManager() {
  const [portfolio, setPortfolio] = useState<PortfolioAsset[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAsset, setEditingAsset] = useState<PortfolioAsset | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);

  // Formulário para adicionar/editar
  const [formData, setFormData] = useState({
    symbol: "",
    name: "",
    type: "stock" as "stock" | "index" | "crypto",
    quantity: "",
    avgPrice: "",
    exchange: "",
  });

  useEffect(() => {
    loadPortfolio();
    updatePrices();
    
    // Atualiza quando o localStorage muda
    const portfolioInterval = setInterval(loadPortfolio, 2000);
    // Atualiza preços a cada 30 segundos
    const priceInterval = setInterval(updatePrices, 30000);
    
    return () => {
      clearInterval(portfolioInterval);
      clearInterval(priceInterval);
    };
  }, []);

  const loadPortfolio = () => {
    setPortfolio(PortfolioService.getAll());
  };

  const updatePrices = useCallback(async () => {
    const assets = PortfolioService.getAll();
    if (assets.length === 0) return;

    try {
      const priceMap = await updatePortfolioPrices(assets);
      
      // Atualiza preços no portfólio
      priceMap.forEach((priceData, assetId) => {
        PortfolioService.update(assetId, {
          currentPrice: priceData.price,
        } as Partial<PortfolioAsset>);
      });

      // Recarrega portfólio com preços atualizados
      loadPortfolio();
    } catch (error) {
      console.error("Erro ao atualizar preços:", error);
    }
  }, []);

  const handleAddAsset = () => {
    if (!formData.symbol || !formData.name || !formData.quantity || !formData.avgPrice) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const assetId = formData.exchange 
      ? `${formData.exchange}:${formData.symbol}`
      : formData.symbol;

    const success = PortfolioService.add({
      id: assetId,
      symbol: formData.symbol,
      name: formData.name,
      type: formData.type,
      exchange: formData.exchange || undefined,
      quantity: parseFloat(formData.quantity),
      avgPrice: parseFloat(formData.avgPrice),
    });

    if (!success) {
      alert("Erro ao adicionar ativo. Verifique os dados informados.");
      return;
    }

    // Adiciona transação
    TransactionService.add({
      assetId,
      type: "buy",
      quantity: parseFloat(formData.quantity),
      price: parseFloat(formData.avgPrice),
      date: new Date().toISOString(),
    });

    // Limpa formulário
    setFormData({
      symbol: "",
      name: "",
      type: "stock",
      quantity: "",
      avgPrice: "",
      exchange: "",
    });
    setShowAddModal(false);
    loadPortfolio();
  };

  const handleEditAsset = (asset: PortfolioAsset) => {
    setEditingAsset(asset);
    setFormData({
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      quantity: asset.quantity.toString(),
      avgPrice: asset.avgPrice.toString(),
      exchange: asset.exchange || "",
    });
    setShowAddModal(true);
  };

  const handleUpdateAsset = () => {
    if (!editingAsset || !formData.quantity || !formData.avgPrice) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    const success = PortfolioService.update(editingAsset.id, {
      quantity: parseFloat(formData.quantity),
      avgPrice: parseFloat(formData.avgPrice),
    });

    if (!success) {
      alert("Erro ao atualizar ativo. Verifique os dados informados.");
      return;
    }

    setEditingAsset(null);
    setShowAddModal(false);
    setFormData({
      symbol: "",
      name: "",
      type: "stock",
      quantity: "",
      avgPrice: "",
      exchange: "",
    });
    loadPortfolio();
  };

  const handleRemoveAsset = (id: string) => {
    if (confirm("Tem certeza que deseja remover este ativo do portfólio?")) {
      const success = PortfolioService.remove(id);
      if (!success) {
        alert("Erro ao remover ativo.");
        return;
      }
      loadPortfolio();
    }
  };

  const handleAssetFromSearch = (asset: { id: string; symbol: string; name: string; type: "stock" | "index" | "crypto"; exchange?: string }) => {
    setFormData({
      symbol: asset.symbol,
      name: asset.name,
      type: asset.type,
      quantity: "",
      avgPrice: "",
      exchange: asset.exchange || "",
    });
    setShowAddModal(true);
  };

  // Cálculos do portfólio
  const totalValue = portfolio.reduce((sum, item) => {
    const currentPrice = item.currentPrice || item.avgPrice;
    return sum + (currentPrice * item.quantity);
  }, 0);

  const totalCost = portfolio.reduce((sum, item) => sum + (item.avgPrice * item.quantity), 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? ((totalGain / totalCost) * 100) : 0;

  // Estatísticas adicionais
  const assetsByType = portfolio.reduce((acc, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const valueByType = portfolio.reduce((acc, item) => {
    const currentPrice = item.currentPrice || item.avgPrice;
    const value = currentPrice * item.quantity;
    acc[item.type] = (acc[item.type] || 0) + value;
    return acc;
  }, {} as Record<string, number>);

  // Melhor e pior ativo
  const assetsWithGain = portfolio.map((asset) => {
    const currentPrice = asset.currentPrice || asset.avgPrice;
    const value = currentPrice * asset.quantity;
    const cost = asset.avgPrice * asset.quantity;
    const gain = value - cost;
    const gainPercent = cost > 0 ? ((gain / cost) * 100) : 0;
    return { ...asset, gain, gainPercent, value };
  });

  const bestAsset = assetsWithGain.length > 0 
    ? assetsWithGain.reduce((best, current) => 
        current.gainPercent > best.gainPercent ? current : best
      )
    : null;

  const worstAsset = assetsWithGain.length > 0 
    ? assetsWithGain.reduce((worst, current) => 
        current.gainPercent < worst.gainPercent ? current : worst
      )
    : null;

  // Maior posição
  const largestPosition = assetsWithGain.length > 0
    ? assetsWithGain.reduce((largest, current) =>
        current.value > largest.value ? current : largest
      )
    : null;

  const getSymbolForChart = (asset: PortfolioAsset): string => {
    if (asset.exchange) {
      return asset.exchange.includes("BINANCE") 
        ? `BINANCE:${asset.symbol}USDT`
        : `${asset.exchange}:${asset.symbol}`;
    }
    if (asset.type === "crypto") {
      return `BINANCE:${asset.symbol}USDT`;
    } else if (asset.type === "index") {
      return `INDEX:${asset.symbol}`;
    } else {
      return `NASDAQ:${asset.symbol}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Resumo do Portfolio - Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-dark-card/40 to-dark-card-hover/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-accent/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-light text-dark-text-muted uppercase tracking-wider">Valor Total</span>
            <svg className="w-4 h-4 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl font-extralight text-dark-text-primary mb-1">
            R$ {totalValue.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-dark-text-muted font-light">Investido: R$ {totalCost.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <div className="bg-gradient-to-br from-dark-card/40 to-dark-card-hover/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-accent/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-light text-dark-text-muted uppercase tracking-wider">Ganho/Perda</span>
            <svg className={`w-4 h-4 ${totalGain >= 0 ? "text-dark-success" : "text-dark-danger"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {totalGain >= 0 ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              )}
            </svg>
          </div>
          <p className={`text-3xl font-extralight mb-1 ${totalGain >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
            {totalGain >= 0 ? "+" : ""}R$ {totalGain.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className={`text-xs font-light ${totalGain >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
            {totalGainPercent >= 0 ? "+" : ""}{totalGainPercent.toFixed(2)}%
          </p>
        </div>

        <div className="bg-gradient-to-br from-dark-card/40 to-dark-card-hover/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-accent/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-light text-dark-text-muted uppercase tracking-wider">Ativos</span>
            <svg className="w-4 h-4 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-3xl font-extralight text-dark-text-primary mb-1">{portfolio.length}</p>
          <p className="text-xs text-dark-text-muted font-light">Posições abertas</p>
        </div>

        <div className="bg-gradient-to-br from-dark-card/40 to-dark-card-hover/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6 hover:border-dark-accent/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-light text-dark-text-muted uppercase tracking-wider">Maior Posição</span>
            <svg className="w-4 h-4 text-dark-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          {largestPosition ? (
            <>
              <p className="text-lg font-extralight text-dark-text-primary mb-1 truncate">{largestPosition.name}</p>
              <p className="text-xs text-dark-text-muted font-light">
                R$ {largestPosition.value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </>
          ) : (
            <p className="text-sm text-dark-text-muted font-light">-</p>
          )}
        </div>
      </div>

      {/* Estatísticas Adicionais */}
      {portfolio.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Distribuição por Tipo */}
          <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6">
            <h3 className="text-sm font-light text-dark-text-muted uppercase tracking-wider mb-4">Distribuição</h3>
            <div className="space-y-3">
              {Object.entries(assetsByType).map(([type, count]) => {
                const typeLabel = type === "stock" ? "Ações" : type === "crypto" ? "Crypto" : "Índices";
                const percentage = portfolio.length > 0 ? ((count / portfolio.length) * 100).toFixed(0) : 0;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-light text-dark-text-primary">{typeLabel}</span>
                      <span className="text-xs font-light text-dark-text-muted">{count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-dark-bg-secondary rounded-full h-2">
                      <div
                        className="bg-dark-accent h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Melhor Ativo */}
          {bestAsset && (
            <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6">
              <h3 className="text-sm font-light text-dark-text-muted uppercase tracking-wider mb-4">Melhor Performance</h3>
              <div className="space-y-2">
                <p className="text-lg font-light text-dark-text-primary truncate">{bestAsset.name}</p>
                <p className="text-xs text-dark-text-muted font-mono">{bestAsset.symbol}</p>
                <p className={`text-2xl font-extralight ${bestAsset.gainPercent >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
                  {bestAsset.gainPercent >= 0 ? "+" : ""}{bestAsset.gainPercent.toFixed(2)}%
                </p>
                <p className={`text-xs font-light ${bestAsset.gain >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
                  {bestAsset.gain >= 0 ? "+" : ""}R$ {bestAsset.gain.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}

          {/* Pior Ativo */}
          {worstAsset && (
            <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6">
              <h3 className="text-sm font-light text-dark-text-muted uppercase tracking-wider mb-4">Pior Performance</h3>
              <div className="space-y-2">
                <p className="text-lg font-light text-dark-text-primary truncate">{worstAsset.name}</p>
                <p className="text-xs text-dark-text-muted font-mono">{worstAsset.symbol}</p>
                <p className={`text-2xl font-extralight ${worstAsset.gainPercent >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
                  {worstAsset.gainPercent >= 0 ? "+" : ""}{worstAsset.gainPercent.toFixed(2)}%
                </p>
                <p className={`text-xs font-light ${worstAsset.gain >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
                  {worstAsset.gain >= 0 ? "+" : ""}R$ {worstAsset.gain.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          )}

          {/* Valor por Tipo */}
          <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl p-6">
            <h3 className="text-sm font-light text-dark-text-muted uppercase tracking-wider mb-4">Valor por Tipo</h3>
            <div className="space-y-3">
              {Object.entries(valueByType).map(([type, value]) => {
                const typeLabel = type === "stock" ? "Ações" : type === "crypto" ? "Crypto" : "Índices";
                const percentage = totalValue > 0 ? ((value / totalValue) * 100).toFixed(0) : 0;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-light text-dark-text-primary">{typeLabel}</span>
                      <span className="text-xs font-light text-dark-text-muted">{percentage}%</span>
                    </div>
                    <p className="text-sm font-light text-dark-text-primary">
                      R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Botão Adicionar Ativo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extralight text-dark-text-primary mb-1">Meus Ativos</h2>
          <p className="text-sm text-dark-text-muted font-light">Gerencie suas posições e acompanhe a performance</p>
        </div>
        <button
          onClick={() => {
            setEditingAsset(null);
            setFormData({
              symbol: "",
              name: "",
              type: "stock",
              quantity: "",
              avgPrice: "",
              exchange: "",
            });
            setShowAddModal(true);
          }}
          className="px-6 py-3 bg-dark-accent/20 hover:bg-dark-accent/30 text-dark-accent border border-dark-accent/50 rounded-2xl font-light transition-all duration-300 hover:border-dark-accent flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Adicionar Ativo</span>
        </button>
      </div>

      {/* Lista de Ativos */}
      {portfolio.length === 0 ? (
        <div className="bg-dark-card border border-dark-border rounded-3xl p-12 text-center">
          <p className="text-dark-text-muted text-lg font-light mb-4">Seu portfólio está vazio</p>
          <p className="text-dark-text-secondary text-sm font-light mb-6">Adicione ativos para começar a acompanhar seus investimentos</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-dark-accent/20 hover:bg-dark-accent/30 text-dark-accent border border-dark-accent/50 rounded-lg font-light transition-all duration-300"
          >
            Adicionar Primeiro Ativo
          </button>
        </div>
      ) : (
        <div className="bg-dark-card/40 backdrop-blur-xl border border-dark-border/50 rounded-3xl overflow-hidden">
          <div className="divide-y divide-dark-border/30">
            {portfolio.map((asset) => {
              const currentPrice = asset.currentPrice || asset.avgPrice;
              const value = currentPrice * asset.quantity;
              const cost = asset.avgPrice * asset.quantity;
              const gain = value - cost;
              const gainPercent = cost > 0 ? ((gain / cost) * 100) : 0;
              const weight = totalValue > 0 ? ((value / totalValue) * 100) : 0;

              return (
                <div
                  key={asset.id}
                  className="p-6 hover:bg-dark-card-hover/30 transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-dark-accent/20 to-dark-info/20 rounded-2xl flex items-center justify-center border border-dark-border/50">
                          <span className="text-lg font-extralight text-dark-accent">{asset.symbol}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-1">
                            <h4 className="font-light text-lg text-dark-text-primary">{asset.name}</h4>
                            <span className="text-xs px-2 py-1 bg-dark-bg-secondary/50 text-dark-text-muted rounded-lg border border-dark-border/30">
                              {asset.type === "stock" ? "Ação" : asset.type === "crypto" ? "Crypto" : "Índice"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className="text-xs text-dark-text-muted font-light">
                              {asset.type === "crypto" ? `${asset.quantity} ${asset.symbol}` : `${asset.quantity} ações`}
                            </span>
                            {asset.exchange && (
                              <span className="text-xs text-dark-text-secondary font-light">• {asset.exchange}</span>
                            )}
                            <span className="text-xs text-dark-text-muted font-light">
                              • {weight.toFixed(1)}% do portfólio
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-dark-text-muted mb-1 font-light uppercase tracking-wider">Preço Médio</p>
                          <p className="font-light text-dark-text-primary">
                            R$ {asset.avgPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-dark-text-muted mb-1 font-light uppercase tracking-wider">Preço Atual</p>
                          <p className="font-light text-dark-text-primary">
                            R$ {currentPrice.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-dark-text-muted mb-1 font-light uppercase tracking-wider">Valor Total</p>
                          <p className="font-light text-dark-text-primary">
                            R$ {value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-dark-text-muted mb-1 font-light uppercase tracking-wider">Ganho/Perda</p>
                          <p className={`font-light ${gain >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
                            {gain >= 0 ? "+" : ""}R$ {gain.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-dark-text-muted mb-1 font-light uppercase tracking-wider">% Variação</p>
                          <p className={`font-light text-lg ${gainPercent >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
                            {gainPercent >= 0 ? "+" : ""}{gainPercent.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6 text-right">
                      <p className={`text-3xl font-extralight mb-2 ${gainPercent >= 0 ? "text-dark-success" : "text-dark-danger"}`}>
                        {gainPercent >= 0 ? "+" : ""}{gainPercent.toFixed(2)}%
                      </p>
                      <div className="flex items-center justify-end space-x-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            setSelectedAsset(selectedAsset === asset.id ? null : asset.id);
                          }}
                          className="px-3 py-1.5 text-xs bg-dark-card-hover hover:bg-dark-info/20 text-dark-text-muted hover:text-dark-info border border-dark-border rounded-xl transition-all"
                          title="Ver gráfico"
                        >
                          {selectedAsset === asset.id ? "Ocultar" : "Gráfico"}
                        </button>
                        <button
                          onClick={() => handleEditAsset(asset)}
                          className="px-3 py-1.5 text-xs bg-dark-card-hover hover:bg-dark-warning/20 text-dark-text-muted hover:text-dark-warning border border-dark-border rounded-xl transition-all"
                          title="Editar ativo"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleRemoveAsset(asset.id)}
                          className="px-3 py-1.5 text-xs bg-dark-card-hover hover:bg-dark-danger/20 text-dark-text-muted hover:text-dark-danger border border-dark-border rounded-xl transition-all"
                          title="Remover ativo"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Gráfico do Ativo */}
                  {selectedAsset === asset.id && (
                    <div className="mt-6 pt-6 border-t border-dark-border/30 animate-fade-in">
                      <FinancialChart
                        symbol={getSymbolForChart(asset)}
                        height={400}
                        interval="15"
                        hideTopToolbar={false}
                        hideSideToolbar={false}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Adicionar/Editar Ativo */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-dark-card border-2 border-dark-border rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-extralight text-dark-text-primary">
                {editingAsset ? "Editar Ativo" : "Adicionar Ativo"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAsset(null);
                }}
                className="text-dark-text-muted hover:text-dark-text-primary transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!editingAsset && (
              <div className="mb-6">
                <label className="block text-sm font-light text-dark-text-muted mb-2">Buscar Ativo</label>
                <PortfolioSearch
                  onSelect={(asset) => {
                    setFormData({
                      symbol: asset.symbol,
                      name: asset.name,
                      type: asset.type,
                      quantity: "",
                      avgPrice: "",
                      exchange: asset.exchange || "",
                    });
                  }}
                />
                <p className="text-xs text-dark-text-secondary mt-2 font-light">
                  Ou preencha manualmente os campos abaixo
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-light text-dark-text-muted mb-2">Símbolo *</label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
                  placeholder="Ex: AAPL, BTC, VALE3"
                  className="w-full px-4 py-2.5 bg-dark-bg-secondary border border-dark-border rounded-2xl text-dark-text-primary font-light focus:border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent/20 transition-all"
                  disabled={!!editingAsset}
                />
              </div>

              <div>
                <label className="block text-sm font-light text-dark-text-muted mb-2">Nome *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Apple Inc."
                  className="w-full px-4 py-2.5 bg-dark-bg-secondary border border-dark-border rounded-2xl text-dark-text-primary font-light focus:border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent/20 transition-all"
                  disabled={!!editingAsset}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-light text-dark-text-muted mb-2">Quantidade *</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    placeholder="Ex: 10"
                    className="w-full px-4 py-2.5 bg-dark-bg-secondary border border-dark-border rounded-2xl text-dark-text-primary font-light focus:border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-dark-text-muted mb-2">Preço Médio *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.avgPrice}
                    onChange={(e) => setFormData({ ...formData, avgPrice: e.target.value })}
                    placeholder="Ex: 175.50"
                    className="w-full px-4 py-2.5 bg-dark-bg-secondary border border-dark-border rounded-2xl text-dark-text-primary font-light focus:border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-light text-dark-text-muted mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "stock" | "index" | "crypto" })}
                  className="w-full px-4 py-2.5 bg-dark-bg-secondary border border-dark-border rounded-2xl text-dark-text-primary font-light focus:border-dark-accent focus:outline-none focus:ring-2 focus:ring-dark-accent/20 transition-all"
                  disabled={!!editingAsset}
                >
                  <option value="stock">Ação</option>
                  <option value="index">Índice</option>
                  <option value="crypto">Criptomoeda</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAsset(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-dark-bg-secondary hover:bg-dark-card-hover text-dark-text-primary border border-dark-border rounded-2xl font-light transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={editingAsset ? handleUpdateAsset : handleAddAsset}
                  className="flex-1 px-4 py-2.5 bg-dark-accent/20 hover:bg-dark-accent/30 text-dark-accent border border-dark-accent/50 rounded-2xl font-light transition-all"
                >
                  {editingAsset ? "Atualizar" : "Adicionar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
