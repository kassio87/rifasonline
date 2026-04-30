import { getWhatsappQR } from '../../../lib/whatsapp'
import { getUserFromToken } from '../../../lib/auth'

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
      const qr = await getWhatsappQR(clientAdminId)
      
      if (!qr) {
        return res.status(404).json({ error: 'QR Code não disponível' })
      }
      
      return res.status(200).json({ qrCode: qr })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao gerar QR Code' })
    }
  }
  
  return res.status(405).json({ error: 'Método não permitido' })
}
