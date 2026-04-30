import { prisma } from './prisma'

// Busca tenant pelo subdomínio ou URL customizada
export async function getTenantByHost(host) {
  try {
    // Remove porta se houver
    const hostname = host.split(':')[0]
    
    // Tenta encontrar pelo subdomínio
    const subdomain = hostname.split('.')[0]
    
    const clientAdmin = await prisma.clientAdmin.findFirst({
      where: {
        OR: [
          { subdomain: subdomain },
          { customUrl: hostname },
          { customUrl: { contains: hostname } }
        ]
      },
      include: {
        user: true,
        subscription: {
          include: {
            plan: true
          }
        }
      }
    })
    
    return clientAdmin
  } catch (error) {
    console.error('Erro ao buscar tenant:', error)
    return null
  }
}

// Verifica se o tenant está ativo e com assinatura válida
export function isTenantActive(tenant) {
  if (!tenant) return false
  if (!tenant.subscription) return false
  
  const now = new Date()
  const isActive = tenant.subscription.status === 'ACTIVE' &&
                  (!tenant.subscription.endDate || tenant.subscription.endDate > now)
  
  return isActive
}
