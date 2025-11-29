/**
 * Sistema de Autenticação Server-Side
 * Usa banco de dados e JWT para autenticação segura
 */

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword, validatePasswordStrength } from "@/lib/security/password";
import { generateToken, verifyToken } from "@/lib/security/jwt";
import { logger } from "@/lib/logger";

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  lastLogin?: Date | null;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
  token?: string;
}

/**
 * Serviço de Autenticação Server-Side
 */
export const AuthServiceServer = {
  /**
   * Registra um novo usuário
   */
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResult> {
    try {
      // Validações básicas
      if (!email || !password || !name) {
        return { success: false, error: "Preencha todos os campos" };
      }

      // Valida email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { success: false, error: "Email inválido" };
      }

      // Valida força da senha
      const passwordValidation = validatePasswordStrength(password);
      if (!passwordValidation.valid) {
        return {
          success: false,
          error: passwordValidation.errors.join(", "),
        };
      }

      // Valida nome
      if (name.length < 2) {
        return { success: false, error: "Nome deve ter no mínimo 2 caracteres" };
      }

      // Verifica se usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (existingUser) {
        return { success: false, error: "Email já cadastrado" };
      }

      // Gera hash da senha
      const passwordHash = await hashPassword(password);

      // Cria usuário
      const user = await prisma.user.create({
        data: {
          email: email.toLowerCase().trim(),
          name: name.trim(),
          password: passwordHash,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          lastLogin: true,
        },
      });

      // Gera token JWT
      const token = generateToken(user.id, user.email);

      logger.info("Novo usuário registrado", { userId: user.id, email: user.email });

      return {
        success: true,
        user: {
          ...user,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin || undefined,
        },
        token,
      };
    } catch (error) {
      logger.error("Erro ao registrar usuário", error as Error, { email });
      return { success: false, error: "Erro ao criar conta. Tente novamente." };
    }
  },

  /**
   * Faz login do usuário
   */
  async login(email: string, password: string): Promise<AuthResult> {
    try {
      if (!email || !password) {
        return { success: false, error: "Preencha todos os campos" };
      }

      // Busca usuário
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
      });

      if (!user) {
        return { success: false, error: "Email ou senha incorretos" };
      }

      // Verifica senha
      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        logger.warn("Tentativa de login com senha incorreta", { email });
        return { success: false, error: "Email ou senha incorretos" };
      }

      // Atualiza último login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Gera token JWT
      const token = generateToken(user.id, user.email);

      logger.info("Login realizado com sucesso", { userId: user.id, email: user.email });

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          lastLogin: new Date(),
        },
        token,
      };
    } catch (error) {
      logger.error("Erro ao fazer login", error as Error, { email });
      return { success: false, error: "Erro ao fazer login. Tente novamente." };
    }
  },

  /**
   * Verifica token JWT e retorna usuário
   */
  async verifyToken(token: string): Promise<User | null> {
    try {
      const payload = verifyToken(token);
      if (!payload) {
        return null;
      }

      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          lastLogin: true,
        },
      });

      if (!user) {
        return null;
      }

      return {
        ...user,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin || undefined,
      };
    } catch (error) {
      logger.error("Erro ao verificar token", error as Error);
      return null;
    }
  },

  /**
   * Obtém usuário por ID
   */
  async getUserById(userId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
          lastLogin: true,
        },
      });

      if (!user) {
        return null;
      }

      return {
        ...user,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin || undefined,
      };
    } catch (error) {
      logger.error("Erro ao buscar usuário", error as Error, { userId });
      return null;
    }
  },
};

