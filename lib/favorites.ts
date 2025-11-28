/**
 * Sistema de Favoritos
 * Gerencia favoritos usando localStorage
 */

export interface FavoriteAsset {
  id: string;
  symbol: string;
  name: string;
  type: "stock" | "index" | "crypto";
  addedAt: string;
}

export interface FavoriteSource {
  id: string;
  name: string;
  addedAt: string;
}

/**
 * Favoritos de Ativos (Ações, Índices, Criptomoedas)
 */
export const FavoritesService = {
  // Obter todos os favoritos
  getAll(): FavoriteAsset[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("favoriteAssets");
    return stored ? JSON.parse(stored) : [];
  },

  // Adicionar favorito
  add(asset: Omit<FavoriteAsset, "addedAt">): void {
    if (typeof window === "undefined") return;
    const favorites = this.getAll();
    if (!favorites.find((f) => f.id === asset.id)) {
      favorites.push({ ...asset, addedAt: new Date().toISOString() });
      localStorage.setItem("favoriteAssets", JSON.stringify(favorites));
    }
  },

  // Remover favorito
  remove(id: string): void {
    if (typeof window === "undefined") return;
    const favorites = this.getAll().filter((f) => f.id !== id);
    localStorage.setItem("favoriteAssets", JSON.stringify(favorites));
  },

  // Verificar se está favoritado
  isFavorite(id: string): boolean {
    return this.getAll().some((f) => f.id === id);
  },

  // Toggle favorito
  toggle(asset: Omit<FavoriteAsset, "addedAt">): boolean {
    if (this.isFavorite(asset.id)) {
      this.remove(asset.id);
      return false;
    } else {
      this.add(asset);
      return true;
    }
  },
};

/**
 * Favoritos de Fontes de Notícias
 */
export const SourcesService = {
  // Obter todas as fontes seguidas
  getAll(): FavoriteSource[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("favoriteSources");
    return stored ? JSON.parse(stored) : [];
  },

  // Seguir fonte
  follow(source: Omit<FavoriteSource, "addedAt">): void {
    if (typeof window === "undefined") return;
    const sources = this.getAll();
    if (!sources.find((s) => s.id === source.id)) {
      sources.push({ ...source, addedAt: new Date().toISOString() });
      localStorage.setItem("favoriteSources", JSON.stringify(sources));
    }
  },

  // Deixar de seguir
  unfollow(id: string): void {
    if (typeof window === "undefined") return;
    const sources = this.getAll().filter((s) => s.id !== id);
    localStorage.setItem("favoriteSources", JSON.stringify(sources));
  },

  // Verificar se está seguindo
  isFollowing(id: string): boolean {
    return this.getAll().some((s) => s.id === id);
  },

  // Toggle seguir
  toggle(source: Omit<FavoriteSource, "addedAt">): boolean {
    if (this.isFollowing(source.id)) {
      this.unfollow(source.id);
      return false;
    } else {
      this.follow(source);
      return true;
    }
  },
};

