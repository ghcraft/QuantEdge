/**
 * Middleware de Autenticação
 * Verifica token JWT em requisições
 */

import { NextRequest, NextResponse } from "next/server";
import { extractTokenFromHeader, verifyToken } from "@/lib/security/jwt";
import { AuthServiceServer } from "@/lib/auth-server";
import { logger } from "@/lib/logger";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * Middleware para verificar autenticação
 * Adiciona user ao request se token válido
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ authenticated: boolean; user?: any; response?: NextResponse }> {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      // Tenta buscar token do cookie (para compatibilidade com cliente)
      const cookieToken = request.cookies.get("auth_token")?.value;
      if (cookieToken) {
        const user = await AuthServiceServer.verifyToken(cookieToken);
        if (user) {
          return { authenticated: true, user };
        }
      }

      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Não autenticado" },
          { status: 401 }
        ),
      };
    }

    const user = await AuthServiceServer.verifyToken(token);
    if (!user) {
      return {
        authenticated: false,
        response: NextResponse.json(
          { error: "Token inválido ou expirado" },
          { status: 401 }
        ),
      };
    }

    return { authenticated: true, user };
  } catch (error) {
    logger.error("Erro na autenticação", error as Error);
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: "Erro na autenticação" },
        { status: 500 }
      ),
    };
  }
}

/**
 * Helper para proteger rotas API
 */
export function requireAuth(
  handler: (request: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest) => {
    const authResult = await authenticateRequest(request);

    if (!authResult.authenticated) {
      return authResult.response || NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = authResult.user;

    return handler(authenticatedRequest);
  };
}

