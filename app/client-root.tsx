"use client";

import Providers from "./providers";

/**
 * Client Root Component
 * Este componente é importado no layout e renderiza os providers
 */
export default function ClientRoot({ children }: { children: React.ReactNode }) {
  return <Providers>{children}</Providers>;
}

