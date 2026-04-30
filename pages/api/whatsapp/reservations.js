import { getUserFromToken } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const user = await getUserFromToken(req)
  
  if (!user || user.role !== 'CLIENT_ADMIN') {
    return res.status(401).json({ error: 'Não autorizado' })
  }
  
  const clientAdminId = user.clientAdmin?.id
  
  if (!clientAdminId) {
    return res.status(400).json({ error: 'Admin client não encontrado' })
  }
  
  if (req.method === 'GET') {
    try {
      const raffle = await prisma.raffle.findFirst({
        where: { clientAdminId, status: 'active' },
        include: {
          numbers: {
            where: { status: { in: ['RESERVED', 'PAID'] } },
            include: { customer: { include: { user: true } } },
            orderBy: { number: 'asc' }
          }
        }
      })
      
      if (!raffle) {
        return res.status(404).json({ error: 'Nenhuma rifa ativa' })
      }
      
      const reservations = raffle.numbers.map(num => ({
        number: num.number,
        status: num.status,
        customerName: num.customer?.user?.name || 'N/A',
        customerPhone: num.customer?.user?.phone || 'N/A',
        reservedAt: num.reservedAt,
        paidAt: num.paidAt
      }))
      
      return res.status(200).json({ 
        raffle: { id: raffle.id, title: raffle.title },
        reservations 
      })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar reservas' })
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' })
}
