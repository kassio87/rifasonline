import { prisma } from '../../../lib/prisma'
import { getUserFromToken } from '../../../lib/auth'
import { incrementSalesCount } from '../../../lib/billing'

export default async function handler(req, res) {
  const user = await getUserFromToken(req)
  
  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  if (req.method === 'GET') {
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

      const sales = await prisma.sale.findMany({
        where,
        include: {
          raffle: true,
          customer: { include: { user: true } },
          user: true
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.status(200).json(sales)
    } catch (error) {
      console.error('Erro ao buscar vendas:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { raffleId, customerId, numbers, paymentMethod, totalAmount } = req.body

      if (!raffleId || !customerId || !numbers || numbers.length === 0) {
        return res.status(400).json({ error: 'Dados obrigatórios faltando' })
      }

      const raffle = await prisma.raffle.findUnique({
        where: { id: parseInt(raffleId) }
      })

      if (!raffle) {
        return res.status(404).json({ error: 'Rifa não encontrada' })
      }

      if (user.role === 'CLIENT_ADMIN') {
        const clientAdmin = await prisma.clientAdmin.findUnique({
          where: { userId: user.id }
        })
        if (!clientAdmin || clientAdmin.id !== raffle.clientAdminId) {
          return res.status(403).json({ error: 'Acesso negado' })
        }
      }

      const existingNumbers = await prisma.raffleNumber.findMany({
        where: {
          raffleId: parseInt(raffleId),
          number: { in: numbers.map(n => parseInt(n)) },
          status: 'PAID'
        }
      })

      if (existingNumbers.length > 0) {
        return res.status(400).json({
          error: 'Alguns números já estão pagos',
          numbers: existingNumbers.map(n => n.number)
        })
      }

      const sale = await prisma.sale.create({
        data: {
          raffleId: parseInt(raffleId),
          customerId: parseInt(customerId),
          userId: user.id,
          numbers: numbers.map(n => parseInt(n)),
          totalAmount: parseFloat(totalAmount) || (numbers.length * raffle.pricePerNumber),
          paymentMethod: paymentMethod || 'PIX',
          status: 'PAID',
          paidAt: new Date()
        },
        include: {
          raffle: true,
          customer: { include: { user: true } }
        }
      })

      await prisma.raffleNumber.updateMany({
        where: {
          raffleId: parseInt(raffleId),
          number: { in: numbers.map(n => parseInt(n)) }
        },
        data: {
          status: 'PAID',
          customerId: parseInt(customerId),
          paidAt: new Date(),
          saleId: sale.id
        }
      })

      if (user.role === 'CLIENT_ADMIN') {
        const clientAdmin = await prisma.clientAdmin.findUnique({
          where: { userId: user.id }
        })
        if (clientAdmin) {
          await incrementSalesCount(clientAdmin.id)
        }
      }

      return res.status(201).json(sale)
    } catch (error) {
      console.error('Erro ao criar venda:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
