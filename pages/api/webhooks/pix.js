import { prisma } from '../../../lib/prisma'
import { confirmPayment, getWhatsappSession, updateNumberList } from '../../../lib/whatsapp'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }
  
  try {
    const { pixKey, endToEndId, amount, customerPhone, raffleId } = req.body
    
    const raffle = await prisma.raffle.findFirst({
      where: { 
        id: raffleId,
        OR: [{ pixKey }, { pixCopyPaste: { contains: pixKey } }]
      },
      include: { 
        numbers: { 
          where: { status: 'RESERVED' },
          include: { customer: { include: { user: true } } }
        }
      }
    })
    
    if (!raffle) {
      return res.status(404).json({ error: 'Rifa não encontrada ou PIX não confere' })
    }
    
    const reservedNumbers = raffle.numbers
    const customerId = reservedNumbers[0]?.customerId
    
    if (!customerId) {
      return res.status(400).json({ error: 'Nenhum número reservado' })
    }
    
    const numbers = reservedNumbers.map(n => n.number)
    await confirmPayment(raffleId, customerId, numbers)
    
    const clientAdminId = raffle.clientAdminId
    const session = await getWhatsappSession(clientAdminId)
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: { user: true }
    })
    
    const phone = customer.user.phone + '@s.whatsapp.net'
    const list = await updateNumberList(clientAdminId, raffleId)
    
    await session.sendMessage(phone,
      `✅ PIX Confirmado!\n` +
      `ID: ${endToEndId}\n` +
      `Valor: R$ ${amount}\n` +
      `Números: ${numbers.join(', ')}\n\n` +
      `Pagamento confirmado com sucesso! 💰`
    )
    
    if (list) await session.sendMessage(phone, list)
    
    return res.status(200).json({ message: 'PIX confirmado com sucesso' })
  } catch (error) {
    console.error('Erro no webhook PIX:', error)
    return res.status(500).json({ error: 'Erro interno' })
  }
}
