import { prisma } from '../../../lib/prisma'
import { getUserFromToken } from '../../../lib/auth'

export default async function handler(req, res) {
  const user = await getUserFromToken(req)
  
  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    let where = {}

    if (user.role === 'CLIENT_ADMIN') {
      const clientAdmin = await prisma.clientAdmin.findUnique({
        where: { userId: user.id }
      })
      if (clientAdmin) {
        const raffles = await prisma.raffle.findMany({
          where: { clientAdminId: clientAdmin.id },
          select: { id: true }
        })
        where.raffleId = { in: raffles.map(r => r.id) }
      }
    }

    if (user.role === 'CUSTOMER') {
      const customer = await prisma.customer.findUnique({
        where: { userId: user.id }
      })
      if (customer) {
        where.customerId = customer.id
      }
    }

    const { startDate, endDate, status, raffleId } = req.query

    if (startDate) {
      where.createdAt = { gte: new Date(startDate) }
    }
    if (endDate) {
      where.createdAt = { ...where.createdAt, lte: new Date(endDate) }
    }
    if (status) {
      where.status = status
    }
    if (raffleId) {
      where.raffleId = parseInt(raffleId)
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        raffle: true,
        customer: { include: { user: true } },
        user: true
      },
      orderBy: { createdAt: 'desc' }
    })

    const totalAmount = sales.reduce((sum, sale) => sum + sale.totalAmount, 0)
    const totalSales = sales.length

    return res.status(200).json({
      sales,
      summary: {
        totalSales,
        totalAmount,
        averageTicket: totalSales > 0 ? totalAmount / totalSales : 0
      }
    })
  } catch (error) {
    console.error('Erro ao gerar relatório de vendas:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
