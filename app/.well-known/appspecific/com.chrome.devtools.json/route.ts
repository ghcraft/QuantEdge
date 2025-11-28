import { NextResponse } from "next/server";

/**
 * Rota para Chrome DevTools
 * Resolve o erro 404 do Chrome DevTools ao buscar configuração
 */
export async function GET() {
  // Retorna um objeto vazio para o Chrome DevTools
  return NextResponse.json({}, { status: 200 });
}

