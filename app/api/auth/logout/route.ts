import { NextRequest, NextResponse } from "next/server";

// Force dynamic rendering to avoid Prisma issues during build
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

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

