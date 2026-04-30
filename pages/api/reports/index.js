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
    if (user.role !== 'SYSTEM_ADMIN') {
      return res.status(403).json({ error: 'Acesso negado' })
    }

    const { startDate, endDate } = req.query

    let dateFilter = {}
    if (startDate) {
      dateFilter.gte = new Date(startDate)
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate)
    }

    const totalClients = await prisma.clientAdmin.count()
    
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: 'ACTIVE' }
    })

    const totalRaffles = await prisma.raffle.count()
    
    const totalSales = await prisma.sale.count({
      where: dateFilter.createdAt ? { createdAt: dateFilter } : {}
    })

    const salesAmount = await prisma.sale.aggregate({
      where: {
        status: 'PAID',
        ...(dateFilter.createdAt ? { paidAt: dateFilter } : {})
      },
      _sum: { totalAmount: true }
    })

    const totalNumbers = await prisma.raffleNumber.count({
      where: { status: 'PAID' }
    })

    const recentSales = await prisma.sale.findMany({
      where: dateFilter.createdAt ? { createdAt: dateFilter } : {},
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        raffle: true,
        customer: { include: { user: true } }
      }
    })

    return res.status(200).json({
      overview: {
        totalClients,
        activeSubscriptions,
        totalRaffles,
        totalSales,
        totalSalesAmount: salesAmount._sum.totalAmount || 0,
        totalNumbersSold: totalNumbers
      },
      recentSales
    })
  } catch (error) {
    console.error('Erro ao gerar relatório geral:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
