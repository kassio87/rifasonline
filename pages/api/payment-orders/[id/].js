import { prisma } from '../../../../lib/prisma'
import { getUserFromToken } from '../../../../lib/auth'

export default async function handler(req, res) {
  const user = await getUserFromToken(req)
  
  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const paymentOrder = await prisma.paymentOrder.findUnique({
        where: { id: parseInt(id) },
        include: {
          clientAdmin: { include: { user: true } }
        }
      })

      if (!paymentOrder) {
        return res.status(404).json({ error: 'Pedido de pagamento não encontrado' })
      }

      if (user.role === 'CLIENT_ADMIN') {
        const clientAdmin = await prisma.clientAdmin.findUnique({
          where: { userId: user.id }
        })
        if (!clientAdmin || clientAdmin.id !== paymentOrder.clientAdminId) {
          return res.status(403).json({ error: 'Acesso negado' })
        }
      }

      return res.status(200).json(paymentOrder)
    } catch (error) {
      console.error('Erro ao buscar pedido de pagamento:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const paymentOrder = await prisma.paymentOrder.findUnique({
        where: { id: parseInt(id) }
      })

      if (!paymentOrder) {
        return res.status(404).json({ error: 'Pedido de pagamento não encontrado' })
      }

      if (user.role === 'CLIENT_ADMIN') {
        const clientAdmin = await prisma.clientAdmin.findUnique({
          where: { userId: user.id }
        })
        if (!clientAdmin || clientAdmin.id !== paymentOrder.clientAdminId) {
          return res.status(403).json({ error: 'Acesso negado' })
        }
      }

      const { status } = req.body

      const updateData = {}
      if (status) {
        updateData.status = status
        if (status === 'PAID' && !paymentOrder.paidAt) {
          updateData.paidAt = new Date()
        }
      }

      const updatedOrder = await prisma.paymentOrder.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          clientAdmin: { include: { user: true } }
        }
      })

      return res.status(200).json(updatedOrder)
    } catch (error) {
      console.error('Erro ao atualizar pedido de pagamento:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
