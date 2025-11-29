import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Força renderização dinâmica
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Preencha todos os campos' },
        { status: 400 }
      );
    }

    // Busca usuário
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Email ou senha incorretos' },
        { status: 401 }
      );
    }

    // Verifica senha
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Email ou senha incorretos' },
        { status: 401 }
      );
    }

    // Atualiza último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Gera token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Cria sessão (com tratamento de erro caso já exista)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 dias

    try {
      // Remove sessões antigas do mesmo usuário antes de criar nova
      await prisma.session.deleteMany({
        where: {
          userId: user.id,
          expiresAt: {
            lt: new Date(), // Remove sessões expiradas
          },
        },
      });

      await prisma.session.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });
    } catch (sessionError: any) {
      // Se falhar ao criar sessão, ainda retorna sucesso (sessão pode ser opcional)
      console.warn('Erro ao criar sessão (não crítico):', sessionError);
      // Continua e retorna o token mesmo sem salvar sessão
    }

    // Retorna resposta sem a senha
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
    });
  } catch (error: any) {
    console.error('Erro ao fazer login:', error);
    
    // Retorna mensagem de erro mais específica
    let errorMessage = 'Erro ao fazer login. Tente novamente.';
    
    // Verifica se é erro de conexão com banco de dados
    if (error?.code === 'P1001' || error?.message?.includes('connect')) {
      errorMessage = 'Erro ao conectar com o banco de dados. Verifique a configuração.';
    } else if (error?.code === 'P2002') {
      errorMessage = 'Erro de duplicação no banco de dados.';
    } else if (error?.message) {
      // Em desenvolvimento, retorna mensagem de erro mais detalhada
      if (process.env.NODE_ENV === 'development') {
        errorMessage = `Erro: ${error.message}`;
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        ...(process.env.NODE_ENV === 'development' && { details: error?.message })
      },
      { status: 500 }
    );
  }
}
