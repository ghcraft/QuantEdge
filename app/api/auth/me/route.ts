import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/middleware/auth";

// Force dynamic rendering to avoid Prisma issues during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

