import { prisma } from '../../../lib/prisma'
import { getUserFromToken } from '../../../lib/auth'
import { getTenantByHost } from '../../../lib/tenant'

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

      if (user.role === 'CUSTOMER') {
        return res.status(403).json({ error: 'Acesso negado' })
      }

      const raffles = await prisma.raffle.findMany({
        where,
        include: {
          numbers: true,
          sales: true,
          clientAdmin: { include: { user: true } }
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.status(200).json(raffles)
    } catch (error) {
      console.error('Erro ao buscar rifas:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'POST') {
    try {
      if (user.role !== 'CLIENT_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' })
      }

      const clientAdmin = await prisma.clientAdmin.findUnique({
        where: { userId: user.id }
      })

      if (!clientAdmin) {
        return res.status(404).json({ error: 'Cliente admin não encontrado' })
      }

      const subscription = await prisma.subscription.findUnique({
        where: { clientAdminId: clientAdmin.id }
      })

      if (!subscription || subscription.status !== 'ACTIVE') {
        return res.status(403).json({ error: 'Assinatura inativa' })
      }

      const {
        title,
        description,
        totalNumbers,
        pricePerNumber,
        drawDate,
        pagseguroToken,
        pixKey,
        pixCopyPaste
      } = req.body

      if (!title || !totalNumbers || !pricePerNumber) {
        return res.status(400).json({ error: 'Dados obrigatórios faltando' })
      }

      const raffle = await prisma.raffle.create({
        data: {
          clientAdminId: clientAdmin.id,
          title,
          description,
          totalNumbers: parseInt(totalNumbers),
          pricePerNumber: parseFloat(pricePerNumber),
          drawDate: drawDate ? new Date(drawDate) : null,
          pagseguroToken,
          pixKey,
          pixCopyPaste
        }
      })

      const numbers = []
      for (let i = 1; i <= totalNumbers; i++) {
        numbers.push({
          raffleId: raffle.id,
          number: i,
          status: 'AVAILABLE'
        })
      }

      await prisma.raffleNumber.createMany({
        data: numbers
      })

      const createdRaffle = await prisma.raffle.findUnique({
        where: { id: raffle.id },
        include: { numbers: true }
      })

      return res.status(201).json(createdRaffle)
    } catch (error) {
      console.error('Erro ao criar rifa:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
