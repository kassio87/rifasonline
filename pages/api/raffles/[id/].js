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
        where: { id: parseInt(id) },
        include: {
          numbers: {
            orderBy: { number: 'asc' }
          },
          sales: {
            include: {
              customer: { include: { user: true } }
            }
          },
          clientAdmin: { include: { user: true } }
        }
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

      return res.status(200).json(raffle)
    } catch (error) {
      console.error('Erro ao buscar rifa:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'PUT') {
    try {
      if (user.role !== 'CLIENT_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' })
      }

      const raffle = await prisma.raffle.findUnique({
        where: { id: parseInt(id) }
      })

      if (!raffle) {
        return res.status(404).json({ error: 'Rifa não encontrada' })
      }

      const clientAdmin = await prisma.clientAdmin.findUnique({
        where: { userId: user.id }
      })

      if (!clientAdmin || clientAdmin.id !== raffle.clientAdminId) {
        return res.status(403).json({ error: 'Acesso negado' })
      }

      const {
        title,
        description,
        drawDate,
        status,
        pagseguroToken,
        pixKey,
        pixCopyPaste
      } = req.body

      const updatedRaffle = await prisma.raffle.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          drawDate: drawDate ? new Date(drawDate) : undefined,
          status,
          pagseguroToken,
          pixKey,
          pixCopyPaste
        }
      })

      return res.status(200).json(updatedRaffle)
    } catch (error) {
      console.error('Erro ao atualizar rifa:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'DELETE') {
    try {
      if (user.role !== 'CLIENT_ADMIN') {
        return res.status(403).json({ error: 'Acesso negado' })
      }

      const raffle = await prisma.raffle.findUnique({
        where: { id: parseInt(id) }
      })

      if (!raffle) {
        return res.status(404).json({ error: 'Rifa não encontrada' })
      }

      const clientAdmin = await prisma.clientAdmin.findUnique({
        where: { userId: user.id }
      })

      if (!clientAdmin || clientAdmin.id !== raffle.clientAdminId) {
        return res.status(403).json({ error: 'Acesso negado' })
      }

      await prisma.raffleNumber.deleteMany({
        where: { raffleId: parseInt(id) }
      })

      await prisma.sale.deleteMany({
        where: { raffleId: parseInt(id) }
      })

      await prisma.raffle.delete({
        where: { id: parseInt(id) }
      })

      return res.status(200).json({ message: 'Rifa deletada com sucesso' })
    } catch (error) {
      console.error('Erro ao deletar rifa:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
