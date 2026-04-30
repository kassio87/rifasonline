import { prisma } from '../../../lib/prisma'
import { getUserFromToken } from '../../../lib/auth'

export default async function handler(req, res) {
  const user = await getUserFromToken(req)
  
  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id: parseInt(id) },
        include: {
          clientAdmin: { include: { user: true } },
          plan: { include: { limits: true } }
        }
      })

      if (!subscription) {
        return res.status(404).json({ error: 'Assinatura não encontrada' })
      }

      if (user.role === 'CLIENT_ADMIN') {
        const clientAdmin = await prisma.clientAdmin.findUnique({
          where: { userId: user.id }
        })
        if (!clientAdmin || clientAdmin.id !== subscription.clientAdminId) {
          return res.status(403).json({ error: 'Acesso negado' })
        }
      }

      return res.status(200).json(subscription)
    } catch (error) {
      console.error('Erro ao buscar assinatura:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'PUT') {
    try {
      if (user.role !== 'SYSTEM_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' })
      }

      const { planId, status, endDate } = req.body

      const subscription = await prisma.subscription.update({
        where: { id: parseInt(id) },
        data: {
          planId: planId ? parseInt(planId) : undefined,
          status,
          endDate: endDate ? new Date(endDate) : undefined
        },
        include: {
          clientAdmin: { include: { user: true } },
          plan: { include: { limits: true } }
        }
      })

      return res.status(200).json(subscription)
    } catch (error) {
      console.error('Erro ao atualizar assinatura:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (user.role !== 'SYSTEM_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' })
      }

      await prisma.subscription.delete({
        where: { id: parseInt(id) }
      })

      return res.status(200).json({ message: 'Assinatura deletada com sucesso' })
    } catch (error) {
      console.error('Erro ao deletar assinatura:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
