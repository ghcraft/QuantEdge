import { NextRequest, NextResponse } from "next/server";
import { AuthServiceServer } from "@/lib/auth-server";
import { logger } from "@/lib/logger";

/**
 * POST /api/auth/register
 * Registra um novo usuário
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Preencha todos os campos" },
        { status: 400 }
      );
    }

    const result = await AuthServiceServer.register(email, password, name);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
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
    logger.error("Erro ao processar registro", error as Error);
    return NextResponse.json(
      { error: "Erro ao processar registro" },
      { status: 500 }
    );
  }
}

