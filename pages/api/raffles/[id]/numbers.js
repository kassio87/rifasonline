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
      const raffle = await prisma.raffle.findUnique({
        where: { id: parseInt(id) }
      })

      if (!raffle) {
        return res.status(404).json({ error: 'Rifa não encontrada' })
      }

      const { status, customerId } = req.query

      let where = { raffleId: parseInt(id) }
      
      if (status) {
        where.status = status
      }
      
      if (customerId) {
        where.customerId = parseInt(customerId)
      }

      const numbers = await prisma.raffleNumber.findMany({
        where,
        orderBy: { number: 'asc' },
        include: {
          customer: { include: { user: true } }
        }
      })

      return res.status(200).json(numbers)
    } catch (error) {
      console.error('Erro ao buscar números:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { numbers, customerId, action } = req.body

      if (!numbers || !Array.isArray(numbers) || numbers.length === 0) {
        return res.status(400).json({ error: 'Números são obrigatórios' })
      }

      const raffle = await prisma.raffle.findUnique({
        where: { id: parseInt(id) }
      })

      if (!raffle) {
        return res.status(404).json({ error: 'Rifa não encontrada' })
      }

      if (action === 'reserve') {
        const existingNumbers = await prisma.raffleNumber.findMany({
          where: {
            raffleId: parseInt(id),
            number: { in: numbers },
            status: { in: ['RESERVED', 'PAID'] }
          }
        })

        if (existingNumbers.length > 0) {
          return res.status(400).json({
            error: 'Alguns números já estão reservados ou pagos',
            numbers: existingNumbers.map(n => n.number)
          })
        }

        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

        await prisma.raffleNumber.updateMany({
          where: {
            raffleId: parseInt(id),
            status: 'RESERVED',
            reservedAt: { lt: fiveMinutesAgo }
          },
          data: {
            status: 'AVAILABLE',
            customerId: null,
            reservedAt: null
          }
        })

        await prisma.raffleNumber.updateMany({
          where: {
            raffleId: parseInt(id),
            number: { in: numbers }
          },
          data: {
            status: 'RESERVED',
            customerId: customerId ? parseInt(customerId) : null,
            reservedAt: new Date()
          }
        })

        setTimeout(async () => {
          await prisma.raffleNumber.updateMany({
            where: {
              raffleId: parseInt(id),
              number: { in: numbers },
              status: 'RESERVED'
            },
            data: {
              status: 'AVAILABLE',
              customerId: null,
              reservedAt: null
            }
          })
        }, 5 * 60 * 1000)

        return res.status(200).json({ message: 'Números reservados com sucesso' })
      }

      if (action === 'mark_paid') {
        if (user.role !== 'CLIENT_ADMIN') {
          return res.status(403).json({ error: 'Acesso negado' })
        }

        const clientAdmin = await prisma.clientAdmin.findUnique({
          where: { userId: user.id }
        })

        if (!clientAdmin || clientAdmin.id !== raffle.clientAdminId) {
          return res.status(403).json({ error: 'Acesso negado' })
        }

        for (const number of numbers) {
          await prisma.raffleNumber.updateMany({
            where: {
              raffleId: parseInt(id),
              number: number
            },
            data: {
              status: 'PAID',
              paidAt: new Date()
            }
          })
        }

        await prisma.sale.create({
          data: {
            raffleId: parseInt(id),
            customerId: customerId ? parseInt(customerId) : null,
            userId: user.id,
            numbers: numbers,
            totalAmount: numbers.length * raffle.pricePerNumber,
            paymentMethod: 'PIX',
            status: 'PAID',
            paidAt: new Date()
          }
        })

        await incrementSalesCount(clientAdmin.id)

        return res.status(200).json({ message: 'Números marcados como pagos' })
      }

      return res.status(400).json({ error: 'Ação inválida' })
    } catch (error) {
      console.error('Erro ao processar números:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}

async function incrementSalesCount(clientAdminId) {
  const subscription = await prisma.subscription.findFirst({
    where: { clientAdminId }
  })

  if (!subscription) return

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { salesCount: subscription.salesCount + 1 }
  })
}
