import { getWhatsappSession, getWhatsappQR, resetWhatsappConnection, deleteWhatsappConnection, listWhatsappGroups } from '../../../lib/whatsapp'
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
      const session = await prisma.whatsappSession.findUnique({
        where: { clientAdminId }
      })
      
      return res.status(200).json({
        status: session?.status || 'disconnected',
        qrCode: session?.qrCode || null
      })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar sessão' })
    }
  }
  
  if (req.method === 'POST') {
    const { action } = req.body
    
    try {
      if (action === 'connect') {
        await getWhatsappSession(clientAdminId)
        const qr = await getWhatsappQR(clientAdminId)
        return res.status(200).json({ message: 'Conectando...', qrCode: qr })
      }
      
      if (action === 'disconnect') {
        await resetWhatsappConnection(clientAdminId)
        return res.status(200).json({ message: 'Desconectado com sucesso' })
      }
      
      if (action === 'delete') {
        await deleteWhatsappConnection(clientAdminId)
        return res.status(200).json({ message: 'Conexão excluída com sucesso' })
      }
      
      if (action === 'groups') {
        const groups = await listWhatsappGroups(clientAdminId)
        return res.status(200).json({ groups })
      }
      
      return res.status(400).json({ error: 'Ação inválida' })
    } catch (error) {
      console.error('Erro na sessão WhatsApp:', error)
      return res.status(500).json({ error: 'Erro interno' })
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' })
}
