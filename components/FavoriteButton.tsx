"use client";

import { useState, useEffect } from "react";
import { FavoritesService, FavoriteAsset } from "@/lib/favorites";

interface FavoriteButtonProps {
  asset: Omit<FavoriteAsset, "addedAt">;
  size?: "sm" | "md" | "lg";
}

/**
 * Botão de Favoritar Ativo
 * Permite favoritar ações, índices e criptomoedas
 */
export default function FavoriteButton({ asset, size = "md" }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(FavoritesService.isFavorite(asset.id));
  }, [asset.id]);

  const handleToggle = () => {
    const newState = FavoritesService.toggle(asset);
    setIsFavorite(newState);
  };

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        ${sizeClasses[size]} flex items-center justify-center
        rounded-lg border transition-all duration-300
        ${
          isFavorite
            ? "bg-dark-accent/20 border-dark-accent text-dark-accent"
            : "bg-dark-card border-dark-border text-dark-text-muted hover:border-dark-accent hover:text-dark-accent"
        }
        hover:scale-110 active:scale-95
      `}
      title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
    >
      <svg
        className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    </button>
  );
}

