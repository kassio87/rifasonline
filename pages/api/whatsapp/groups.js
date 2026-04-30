import { getWhatsappSession } from '../../../lib/whatsapp'
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
      const session = await getWhatsappSession(clientAdminId)
      const chats = await session.getChats()
      const groups = chats
        .filter(c => c.isGroup)
        .map(g => ({
          id: g.id._serialized,
          name: g.name,
          participants: g.participants?.length || 0
        }))
      
      return res.status(200).json({ groups })
    } catch (error) {
      console.error('Erro ao listar grupos:', error)
      return res.status(500).json({ error: 'Erro ao listar grupos' })
    }
  }
  
  if (req.method === 'POST') {
    const { groupId } = req.body
    
    if (!groupId) {
      return res.status(400).json({ error: 'ID do grupo é obrigatório' })
    }
    
    try {
      await prisma.clientAdmin.update({
        where: { id: clientAdminId },
        data: { whatsappGroup: groupId }
      })
      
      return res.status(200).json({ message: 'Grupo selecionado com sucesso' })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao salvar grupo' })
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' })
}
