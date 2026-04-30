import { prisma } from '../../../lib/prisma'
import { getUserFromToken } from '../../../lib/auth'

export default async function handler(req, res) {
  const user = await getUserFromToken(req)
  
  if (!user || user.role !== 'SYSTEM_ADMIN') {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  if (req.method === 'GET') {
    try {
      const plans = await prisma.plan.findMany({
        include: { limits: true },
        orderBy: { createdAt: 'desc' }
      })
      return res.status(200).json(plans)
    } catch (error) {
      console.error('Erro ao buscar planos:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, type, fixedPrice, description, limits } = req.body

      if (!name || !type) {
        return res.status(400).json({ error: 'Nome e tipo são obrigatórios' })
      }

      const plan = await prisma.plan.create({
        data: {
          name,
          type,
          fixedPrice: type === 'FIXED' ? parseFloat(fixedPrice) : null,
          description,
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

      return res.status(201).json(plan)
    } catch (error) {
      console.error('Erro ao criar plano:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
