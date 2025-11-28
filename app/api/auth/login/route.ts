import { NextRequest, NextResponse } from "next/server";
import { AuthServiceServer } from "@/lib/auth-server";
import { logger } from "@/lib/logger";

// Force dynamic rendering to avoid Prisma issues during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/auth/login
 * Faz login do usuário
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Preencha todos os campos" },
        { status: 400 }
      );
    }

    const result = await AuthServiceServer.login(email, password);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    // Retorna token em cookie e no body
    const response = NextResponse.json({
      success: true,
      user: {
        id: result.user?.id,
        email: result.user?.email,
        name: result.user?.name,
      },
      token: result.token,
    });

    // Define cookie HTTP-only para segurança
    if (result.token) {
      response.cookies.set("auth_token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: "/",
      });
    }

    return response;
  } catch (error) {
    logger.error("Erro ao processar login", error as Error);
    return NextResponse.json(
      { error: "Erro ao processar login" },
      { status: 500 }
    );
  }
}

