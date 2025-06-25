import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;

  // Se user nao estiver logado, redirecionar para login
  if (!authToken && !request.nextUrl.pathname.startsWith('/login')) {
    // 3. Redirecione-o para a página de login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se user logado e acessar tela de login, redirecionar para home
  if (authToken && request.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/home', request.url));
  }
}

// O middleware protege rotas de users nao logados
// Rotas nao protegidas pelo middleware
/*
* - api (API routes)
* - _next/static
* - _next/image
* - favicon.ico
* - Imagens na pasta public
*/
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$).*)',
  ],
}