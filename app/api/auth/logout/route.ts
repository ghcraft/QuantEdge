import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Força renderização dinâmica
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (token) {
      // Remove sessão do banco
      await prisma.session.deleteMany({
        where: { token },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao fazer logout' },
      { status: 500 }
    );
  }
}
