"use client";

import { useState, useEffect } from "react";
import { SourcesService, FavoriteSource } from "@/lib/favorites";

interface FollowSourceButtonProps {
  source: Omit<FavoriteSource, "addedAt">;
}

/**
 * Botão de Seguir Fonte de Notícias
 * Permite seguir fontes específicas de notícias
 */
export default function FollowSourceButton({ source }: FollowSourceButtonProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    setIsFollowing(SourcesService.isFollowing(source.id));
  }, [source.id]);

  const handleToggle = () => {
    const newState = SourcesService.toggle(source);
    setIsFollowing(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        px-3 py-1.5 text-xs font-semibold rounded-lg
        transition-all duration-300
        ${
          isFollowing
            ? "bg-dark-accent/20 border border-dark-accent text-dark-accent"
            : "bg-dark-card border border-dark-border text-dark-text-muted hover:border-dark-accent hover:text-dark-accent"
        }
        hover:scale-105 active:scale-95
      `}
    >
      {isFollowing ? "Seguindo" : "Seguir"}
    </button>
  );
}

