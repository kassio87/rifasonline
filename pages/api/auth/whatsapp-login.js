import { loginWithWhatsapp, generateToken } from '../../../lib/auth'
import { sendWhatsappMessage } from '../../../lib/whatsapp'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { phone, code } = req.body

    if (!phone) {
      return res.status(400).json({ error: 'Telefone é obrigatório' })
    }

    if (code) {
      const user = await loginWithWhatsapp(phone, code)

      if (!user) {
        return res.status(401).json({ error: 'Código inválido' })
      }

      const token = generateToken(user)

      return res.status(200).json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      })
    } else {
      const user = await prisma.user.findUnique({
        where: { phone }
      })

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' })
      }

      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString()
      
      await prisma.user.update({
        where: { id: user.id },
        data: { whatsappId: generatedCode }
      })

      await sendWhatsappMessage(null, phone, `Seu código de login é: ${generatedCode}`)

      return res.status(200).json({ message: 'Código enviado via WhatsApp' })
    }
  } catch (error) {
    console.error('Erro no login WhatsApp:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
