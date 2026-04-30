import { prisma } from '../../../lib/prisma'
import { getUserFromToken } from '../../../lib/auth'

export default async function handler(req, res) {
  const user = await getUserFromToken(req)
  
  if (!user || user.role !== 'SYSTEM_ADMIN') {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const plan = await prisma.plan.findUnique({
        where: { id: parseInt(id) },
        include: { limits: true }
      })

      if (!plan) {
        return res.status(404).json({ error: 'Plano não encontrado' })
      }

      return res.status(200).json(plan)
    } catch (error) {
      console.error('Erro ao buscar plano:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const { name, type, fixedPrice, description, active, limits } = req.body

      const existingPlan = await prisma.plan.findUnique({
        where: { id: parseInt(id) },
        include: { limits: true }
      })

      if (!existingPlan) {
        return res.status(404).json({ error: 'Plano não encontrado' })
      }

      if (limits && limits.length > 0) {
        await prisma.planLimit.deleteMany({
          where: { planId: parseInt(id) }
        })
      }

      const plan = await prisma.plan.update({
        where: { id: parseInt(id) },
        data: {
          name,
          type,
          fixedPrice: type === 'FIXED' ? parseFloat(fixedPrice) : null,
          description,
          active,
          limits: limits && limits.length > 0 ? {
            create: limits.map(limit => ({
              minSales: parseInt(limit.minSales),
              maxSales: parseInt(limit.maxSales),
              percentage: parseFloat(limit.percentage)
            }))
          } : undefined
        },
        include: { limits: true }
      })

      return res.status(200).json(plan)
    } catch (error) {
      console.error('Erro ao atualizar plano:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      const subscriptions = await prisma.subscription.findMany({
        where: { planId: parseInt(id) }
      })

      if (subscriptions.length > 0) {
        return res.status(400).json({ error: 'Não é possível deletar plano com assinaturas ativas' })
      }

      await prisma.planLimit.deleteMany({
        where: { planId: parseInt(id) }
      })

      await prisma.plan.delete({
        where: { id: parseInt(id) }
      })

      return res.status(200).json({ message: 'Plano deletado com sucesso' })
    } catch (error) {
      console.error('Erro ao deletar plano:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
