import { getUserFromToken } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  const user = await getUserFromToken(req)
  
  if (!user || user.role !== 'CLIENT_ADMIN') {
    return res.status(401).json({ error: 'Não autorizado' })
  }
  
  const clientAdminId = user.clientAdmin?.id
  
  if (!clientAdminId) {
    return res.status(400).json({ error: 'Admin client não encontrado' })
  }
  
  if (req.method === 'GET') {
    try {
      const raffles = await prisma.raffle.findMany({
        where: { clientAdminId },
        select: { id: true, title: true, pagseguroToken: true }
      })
      
      return res.status(200).json({ raffles })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar tokens PagSeguro' })
    }
  }
  
  if (req.method === 'POST') {
    const { raffleId, pagseguroToken } = req.body
    
    if (!raffleId || !pagseguroToken) {
      return res.status(400).json({ error: 'Dados obrigatórios faltando' })
    }
    
    try {
      await prisma.raffle.update({
        where: { id: raffleId, clientAdminId },
        data: { pagseguroToken }
      })
      
      return res.status(200).json({ message: 'Token PagSeguro salvo com sucesso' })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao salvar token PagSeguro' })
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' })
}
