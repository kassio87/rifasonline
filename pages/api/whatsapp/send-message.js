import { sendWhatsappMessage, getWhatsappSession, updateNumberList } from '../../../lib/whatsapp'
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
  
  if (req.method === 'POST') {
    const { phone, message, sendNumberList } = req.body
    
    if (!phone) {
      return res.status(400).json({ error: 'Telefone é obrigatório' })
    }
    
    try {
      if (sendNumberList) {
        const raffle = await prisma.raffle.findFirst({
          where: { clientAdminId, status: 'active' }
        })
        
        if (raffle) {
          const list = await updateNumberList(clientAdminId, raffle.id)
          if (list) {
            await sendWhatsappMessage(clientAdminId, phone, list)
          }
        }
      }
      
      if (message) {
        await sendWhatsappMessage(clientAdminId, phone, message)
      }
      
      return res.status(200).json({ message: 'Mensagem enviada com sucesso' })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      return res.status(500).json({ error: 'Erro ao enviar mensagem' })
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' })
}
