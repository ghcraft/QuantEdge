import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/auth/logout
 * Faz logout do usuário (remove cookie)
 */
export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  // Remove cookie de autenticação
  response.cookies.delete("auth_token");

  return response;
}

