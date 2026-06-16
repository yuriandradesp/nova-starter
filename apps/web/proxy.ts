import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Lendo o cookie que definimos no AuthContext
  const token = request.cookies.get('nova_token')?.value;

  // Verificando os caminhos da URL atual
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/register');
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');

  // Se for uma rota protegida e o usuário não estiver logado (sem token), manda pro login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se for uma rota de auth (login/register) e o usuário já tiver o token, manda direto pro dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Caso contrário, apenas continua a requisição normalmente
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * O matcher garante que o middleware só será executado em páginas.
     * Ignora rotas da API, arquivos estáticos e de imagens internos do Next.js
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
