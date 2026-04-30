import { prisma } from '../../../lib/prisma'
import { confirmPayment, getWhatsappSession, updateNumberList } from '../../../lib/whatsapp'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { reference, status, customer: customerData, amount } = req.body

    if (status !== 'PAID' && status !== 'CONFIRMED') {
      return res.status(200).json({ message: 'Pagamento não confirmado' })
    }

    const [raffleId, customerId] = reference.split('-').map(Number)

    if (!raffleId || !customerId) {
      return res.status(400).json({ error: 'Referência inválida' })
    }

    const raffle = await prisma.raffle.findUnique({
      where: { id: raffleId },
      include: {
        numbers: {
          where: {
            customerId: customerId,
            status: 'RESERVED'
          }
        }
      }
    })

    if (!raffle) {
      return res.status(404).json({ error: 'Rifa não encontrada' })
    }

    const numbers = raffle.numbers.map(n => n.number)

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
      `✅ Pagamento confirmado!\n` +
      `Números: ${numbers.join(', ')}\n` +
      `Valor: R$ ${amount}\n\n` +
      `Obrigado por participar!`
    )

    if (list) await session.sendMessage(phone, list)

    return res.status(200).json({ message: 'Pagamento confirmado' })
  } catch (error) {
    console.error('Erro no webhook PagSeguro:', error)
    return res.status(500).json({ error: 'Erro interno' })
  }
}
