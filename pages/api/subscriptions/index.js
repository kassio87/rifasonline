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

      const subscriptions = await prisma.subscription.findMany({
        where,
        include: {
          clientAdmin: { include: { user: true } },
          plan: { include: { limits: true } }
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.status(200).json(subscriptions)
    } catch (error) {
      console.error('Erro ao buscar assinaturas:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'POST') {
    try {
      if (user.role !== 'SYSTEM_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' })
      }

      const { clientAdminId, planId } = req.body

      if (!clientAdminId || !planId) {
        return res.status(400).json({ error: 'clientAdminId e planId são obrigatórios' })
      }

      const existing = await prisma.subscription.findUnique({
        where: { clientAdminId: parseInt(clientAdminId) }
      })

      if (existing) {
        return res.status(400).json({ error: 'Cliente já possui uma assinatura' })
      }

      const subscription = await prisma.subscription.create({
        data: {
          clientAdminId: parseInt(clientAdminId),
          planId: parseInt(planId),
          status: 'ACTIVE',
          startDate: new Date(),
          lastBilling: new Date()
        },
        include: {
          clientAdmin: { include: { user: true } },
          plan: { include: { limits: true } }
        }
      })

      return res.status(201).json(subscription)
    } catch (error) {
      console.error('Erro ao criar assinatura:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
