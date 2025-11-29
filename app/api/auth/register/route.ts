import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Força renderização dinâmica
export const dynamic = 'force-dynamic';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    // Verifica se Prisma está disponível
    if (!prisma) {
      console.error('Prisma Client não está disponível');
      return NextResponse.json(
        { success: false, error: 'Erro de configuração do servidor' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { email, password, name } = body;

    // Validações
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, error: 'Preencha todos os campos' },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email inválido' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Senha deve ter no mínimo 8 caracteres' },
        { status: 400 }
      );
    }

    // Valida força da senha
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      return NextResponse.json(
        { success: false, error: 'Senha deve conter letras maiúsculas, minúsculas e números' },
        { status: 400 }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Nome deve ter no mínimo 2 caracteres' },
        { status: 400 }
      );
    }

    // Verifica se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email já cadastrado' },
        { status: 400 }
      );
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria usuário
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        password: hashedPassword,
      },
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
    console.error('Erro ao registrar usuário:', error);
    
    // Retorna mensagem de erro mais específica
    let errorMessage = 'Erro ao criar conta. Tente novamente.';
    
    // Verifica se é erro de conexão com banco de dados
    if (error?.code === 'P1001' || error?.message?.includes('connect')) {
      errorMessage = 'Erro ao conectar com o banco de dados. Verifique a configuração.';
    } else if (error?.code === 'P2002') {
      // Erro de duplicação (email já existe)
      if (error?.meta?.target?.includes('email')) {
        errorMessage = 'Email já cadastrado.';
      } else {
        errorMessage = 'Erro de duplicação no banco de dados.';
      }
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
