/**
 * Sistema de Portfólio
 * Gerencia portfólio de investimentos usando localStorage
 * COM VALIDAÇÃO E SANITIZAÇÃO DE SEGURANÇA
 */

import { validatePortfolioAsset, validateAssetId, validateQuantity, validatePrice } from "@/lib/security";

export interface PortfolioAsset {
  id: string;
  symbol: string;
  name: string;
  type: "stock" | "index" | "crypto";
  exchange?: string;
  quantity: number;
  avgPrice: number;
  currentPrice?: number;
  addedAt: string;
  updatedAt: string;
}

export interface PortfolioTransaction {
  id: string;
  assetId: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  date: string;
  notes?: string;
}

/**
 * Serviço de Portfólio
 */
export const PortfolioService = {
  // Obter todos os ativos do portfólio
  getAll(): PortfolioAsset[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("portfolioAssets");
    return stored ? JSON.parse(stored) : [];
  },

  // Atualiza preço atual de um ativo
  updatePrice(id: string, currentPrice: number): boolean {
    if (typeof window === "undefined") return false;
    
    const validatedId = validateAssetId(id);
    if (!validatedId) {
      return false;
    }

    const validatedPrice = validatePrice(currentPrice);
    if (validatedPrice === null) {
      return false;
    }

    const portfolio = this.getAll();
    const index = portfolio.findIndex((a) => a.id === validatedId);
    
    if (index < 0) {
      return false;
    }

    portfolio[index] = {
      ...portfolio[index],
      currentPrice: validatedPrice,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("portfolioAssets", JSON.stringify(portfolio));
      return true;
    } catch (error) {
      console.error("Erro ao atualizar preço no localStorage:", error);
      return false;
    }
  },

  // Adicionar ativo ao portfólio (COM VALIDAÇÃO DE SEGURANÇA)
  add(asset: Omit<PortfolioAsset, "addedAt" | "updatedAt">): boolean {
    if (typeof window === "undefined") return false;
    
    // Valida e sanitiza dados antes de adicionar
    const validation = validatePortfolioAsset(asset);
    if (!validation.valid || !validation.sanitized) {
      console.error("Tentativa de adicionar ativo inválido:", validation.errors);
      return false;
    }

    // TypeScript type guard - sanitized está garantido aqui
    const sanitized = validation.sanitized;
    const portfolio = this.getAll();
    const existingIndex = portfolio.findIndex((a) => a.id === sanitized.id);
    
    const now = new Date().toISOString();
    
    if (existingIndex >= 0) {
      // Atualiza ativo existente (média ponderada)
      const existing = portfolio[existingIndex];
      const totalQuantity = existing.quantity + sanitized.quantity;
      const totalCost = (existing.avgPrice * existing.quantity) + (sanitized.avgPrice * sanitized.quantity);
      const newAvgPrice = totalCost / totalQuantity;
      
      portfolio[existingIndex] = {
        ...existing,
        quantity: totalQuantity,
        avgPrice: newAvgPrice,
        updatedAt: now,
      };
    } else {
      // Adiciona novo ativo com dados sanitizados
      portfolio.push({
        ...sanitized,
        addedAt: now,
        updatedAt: now,
      });
    }
    
    try {
      localStorage.setItem("portfolioAssets", JSON.stringify(portfolio));
      return true;
    } catch (error) {
      console.error("Erro ao salvar no localStorage:", error);
      return false;
    }
  },

  // Remover ativo do portfólio (COM VALIDAÇÃO)
  remove(id: string): boolean {
    if (typeof window === "undefined") return false;
    
    // Valida ID
    const validatedId = validateAssetId(id);
    if (!validatedId) {
      console.error("ID inválido para remoção:", id);
      return false;
    }

    try {
      const portfolio = this.getAll().filter((a) => a.id !== validatedId);
      localStorage.setItem("portfolioAssets", JSON.stringify(portfolio));
      return true;
    } catch (error) {
      console.error("Erro ao remover do localStorage:", error);
      return false;
    }
  },

  // Atualizar ativo (COM VALIDAÇÃO DE SEGURANÇA)
  update(id: string, updates: Partial<PortfolioAsset>): boolean {
    if (typeof window === "undefined") return false;
    
    // Valida ID
    const validatedId = validateAssetId(id);
    if (!validatedId) {
      console.error("ID inválido para atualização:", id);
      return false;
    }

    const portfolio = this.getAll();
    const index = portfolio.findIndex((a) => a.id === validatedId);
    
    if (index < 0) {
      return false;
    }

    // Valida e sanitiza atualizações
    const existing = portfolio[index];
    const updatedAsset = { ...existing, ...updates };

    // Valida quantidade se fornecida
    if (updates.quantity !== undefined) {
      const validatedQuantity = validateQuantity(updates.quantity);
      if (validatedQuantity === null) {
        console.error("Quantidade inválida:", updates.quantity);
        return false;
      }
      updatedAsset.quantity = validatedQuantity;
    }

    // Valida preço se fornecido
    if (updates.avgPrice !== undefined) {
      const validatedPrice = validatePrice(updates.avgPrice);
      if (validatedPrice === null) {
        console.error("Preço inválido:", updates.avgPrice);
        return false;
      }
      updatedAsset.avgPrice = validatedPrice;
    }

    portfolio[index] = {
      ...updatedAsset,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("portfolioAssets", JSON.stringify(portfolio));
      return true;
    } catch (error) {
      console.error("Erro ao atualizar no localStorage:", error);
      return false;
    }
  },

  // Obter ativo específico
  get(id: string): PortfolioAsset | undefined {
    return this.getAll().find((a) => a.id === id);
  },

  // Verificar se ativo está no portfólio
  has(id: string): boolean {
    return this.getAll().some((a) => a.id === id);
  },
};

/**
 * Serviço de Transações
 */
export const TransactionService = {
  // Obter todas as transações
  getAll(): PortfolioTransaction[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("portfolioTransactions");
    return stored ? JSON.parse(stored) : [];
  },

  // Adicionar transação
  add(transaction: Omit<PortfolioTransaction, "id">): void {
    if (typeof window === "undefined") return;
    const transactions = this.getAll();
    const newTransaction: PortfolioTransaction = {
      ...transaction,
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    transactions.push(newTransaction);
    localStorage.setItem("portfolioTransactions", JSON.stringify(transactions));
  },

  // Remover transação
  remove(id: string): void {
    if (typeof window === "undefined") return;
    const transactions = this.getAll().filter((t) => t.id !== id);
    localStorage.setItem("portfolioTransactions", JSON.stringify(transactions));
  },

  // Obter transações de um ativo
  getByAsset(assetId: string): PortfolioTransaction[] {
    return this.getAll().filter((t) => t.assetId === assetId);
  },
};

