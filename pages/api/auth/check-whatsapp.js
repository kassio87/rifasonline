import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { whatsapp } = req.body

    if (!whatsapp) {
      return res.status(400).json({ error: 'WhatsApp é obrigatório' })
    }

    const user = await prisma.user.findUnique({
      where: { phone: whatsapp },
      include: {
        clientAdmin: true,
        customer: true
      }
    })

    if (user) {
      return res.status(200).json({
        exists: true,
        hasPassword: !!user.password,
        name: user.name,
        role: user.role
      })
    }

    return res.status(200).json({ exists: false })
  } catch (error) {
    console.error('Erro ao verificar WhatsApp:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
