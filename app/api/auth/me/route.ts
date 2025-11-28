import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware/auth";

/**
 * GET /api/auth/me
 * Retorna informações do usuário autenticado
 */
export async function GET(request: NextRequest) {
  const authResult = await authenticateRequest(request);

  if (!authResult.authenticated || !authResult.user) {
    return authResult.response || NextResponse.json(
      { error: "Não autenticado" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      id: authResult.user.id,
      email: authResult.user.email,
      name: authResult.user.name,
    },
  });
}

