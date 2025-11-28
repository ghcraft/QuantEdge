import type { Metadata } from "next";
import "./globals.css";

// Metadados da aplicação
export const metadata: Metadata = {
  title: "QuantEdge Pro - Análise de Mercado em Tempo Real",
  description: "Plataforma completa de informações financeiras com gráficos, cotações, análises e notícias em tempo real",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

/**
 * Layout principal da aplicação
 * Define a estrutura HTML base e aplica os estilos globais
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-dark-bg" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
