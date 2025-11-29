import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token não fornecido' },
        { status: 401 }
      );
    }

    // Verifica token JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Token inválido' },
        { status: 401 }
      );
    }

    // Busca sessão no banco
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      // Remove sessão expirada
      if (session) {
        await prisma.session.delete({ where: { id: session.id } });
      }
      return NextResponse.json(
        { success: false, error: 'Sessão expirada' },
        { status: 401 }
      );
    }

    // Retorna usuário sem senha
    const { password: _, ...userWithoutPassword } = session.user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      session: {
        token: session.token,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    console.error('Erro ao verificar sessão:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao verificar sessão' },
      { status: 500 }
    );
  }
}

