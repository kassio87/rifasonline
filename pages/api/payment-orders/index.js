import { prisma } from '../../../lib/prisma'
import { getUserFromToken } from '../../../lib/auth'

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
          where.clientAdminId = clientAdmin.id
        }
      }

      const { status, startDate, endDate } = req.query

      if (status) {
        where.status = status
      }
      if (startDate) {
        where.createdAt = { gte: new Date(startDate) }
      }
      if (endDate) {
        where.createdAt = { ...where.createdAt, lte: new Date(endDate) }
      }

      const paymentOrders = await prisma.paymentOrder.findMany({
        where,
        include: {
          clientAdmin: { include: { user: true } }
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.status(200).json(paymentOrders)
    } catch (error) {
      console.error('Erro ao buscar pedidos de pagamento:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'POST') {
    try {
      if (user.role !== 'SYSTEM_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' })
      }

      const { clientAdminId, amount, description, dueDate } = req.body

      if (!clientAdminId || !amount) {
        return res.status(400).json({ error: 'clientAdminId e amount são obrigatórios' })
      }

      const paymentOrder = await prisma.paymentOrder.create({
        data: {
          clientAdminId: parseInt(clientAdminId),
          amount: parseFloat(amount),
          description,
          dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        },
        include: {
          clientAdmin: { include: { user: true } }
        }
      })

      return res.status(201).json(paymentOrder)
    } catch (error) {
      console.error('Erro ao criar pedido de pagamento:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
