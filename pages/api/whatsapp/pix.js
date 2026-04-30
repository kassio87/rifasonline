import { generatePixPayment } from '../../../lib/whatsapp'
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
      const clientAdmin = await prisma.clientAdmin.findUnique({
        where: { id: clientAdminId },
        include: { raffles: { where: { status: 'active' }, take: 1 } }
      })
      
      return res.status(200).json({
        pixKey: clientAdmin.pixKey || null,
        pixCopyPaste: clientAdmin.pixCopyPaste || null,
        raffle: clientAdmin.raffles[0] || null
      })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar configurações PIX' })
    }
  }
  
  if (req.method === 'POST') {
    const { pixKey, pixCopyPaste } = req.body
    
    try {
      await prisma.clientAdmin.update({
        where: { id: clientAdminId },
        data: { pixKey, pixCopyPaste }
      })
      
      return res.status(200).json({ message: 'Configurações PIX salvas com sucesso' })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao salvar configurações PIX' })
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' })
}
