import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/tasks', '/groups', '/settings'];
const publicRoutes = ['/login', '/register'];
const authRoutes = ['/loading', '/'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('authToken')?.value;
  const pathname = request.nextUrl.pathname;

  // Dev bypass: requer que a flag de ambiente `DEV_AUTH_BYPASS` esteja ativa
  // e que exista cookie `devBypass=1` ou query param `?skipAuth=1`.
  // Isto evita esquecer que o bypass está disponível: define `DEV_AUTH_BYPASS=1`
  // em `.env.local` ou no ambiente de execução para ativar.
  const devBypassEnabled =
    process.env.DEV_AUTH_BYPASS === '1' || process.env.DEV_AUTH_BYPASS === 'true';
  const hasDevCookie = request.cookies.get('devBypass')?.value === '1';
  const skipParam = request.nextUrl.searchParams.get('skipAuth') === '1';

  if (devBypassEnabled && (hasDevCookie || skipParam)) {
    return NextResponse.next();
  }
  //Ignorar o que está acima 

  // Se tem token e tenta aceder a login/register → redireciona para dashboard
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Se não tem token e tenta aceder a rota protegida → redireciona para login
  if (!token && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
