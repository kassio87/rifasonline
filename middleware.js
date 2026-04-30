import { NextResponse } from 'next/server'

// Middleware para Multi-Tenancy
// Identifica subdomínio ou URL customizada e carrega dados do cliente
export function middleware(request) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Ignora localhost e domínios do sistema
  const isSystemDomain = hostname.includes('localhost') || 
                         hostname.includes('rifasonline.') ||
                         hostname.startsWith('admin.')
  
  if (!isSystemDomain) {
    // Extrai o subdomínio
    const subdomain = hostname.split('.')[0]
    
    // Adiciona o subdomínio nos headers para uso nas páginas da API
    const response = NextResponse.next()
    response.headers.set('x-tenant-subdomain', subdomain)
    response.headers.set('x-tenant-host', hostname)
    
    return response
  }
  
  return NextResponse.next()
}

// Configuração de paths que devem passar pelo middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
