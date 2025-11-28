/**
 * Sistema de Logging
 * Centraliza logs da aplicação com níveis e formatação
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  metadata?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, metadata, error } = entry;
    const metaStr = metadata ? ` ${JSON.stringify(metadata)}` : "";
    const errorStr = error ? `\n${error.stack}` : "";
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}${errorStr}`;
  }

  private log(level: LogLevel, message: string, metadata?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      error,
    };

    const formatted = this.formatMessage(entry);

    switch (level) {
      case "error":
        console.error(formatted);
        // Em produção, enviar para serviço de monitoramento (Sentry, LogRocket, etc.)
        break;
      case "warn":
        console.warn(formatted);
        break;
      case "debug":
        if (this.isDevelopment) {
          console.debug(formatted);
        }
        break;
      default:
        console.log(formatted);
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log("info", message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log("warn", message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    this.log("error", message, metadata, error);
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log("debug", message, metadata);
  }
}

export const logger = new Logger();

