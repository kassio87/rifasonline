import { prisma } from '../../../lib/prisma'
import { sendEmail } from '../../../lib/email'
import { sendPasswordRecoveryWhatsapp } from '../../../lib/whatsapp'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { email, phone } = req.body

    if (!email && !phone) {
      return res.status(400).json({ error: 'Informe e-mail ou telefone' })
    }

    if (email) {
      const sent = await sendPasswordRecoveryEmail(email)
      if (!sent) {
        return res.status(404).json({ error: 'E-mail não encontrado' })
      }
      return res.status(200).json({ message: 'E-mail de recuperação enviado' })
    }

    if (phone) {
      const sent = await sendPasswordRecoveryWhatsapp(phone)
      if (!sent) {
        return res.status(404).json({ error: 'Telefone não encontrado' })
      }
      return res.status(200).json({ message: 'Código enviado via WhatsApp' })
    }
  } catch (error) {
    console.error('Erro na recuperação de senha:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}

async function sendPasswordRecoveryEmail(email) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return false

  const crypto = await import('crypto')
  const token = crypto.randomBytes(32).toString('hex')
  
  await prisma.user.update({
    where: { id: user.id },
    data: { whatsappId: token }
  })

  const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`
  
  await sendEmail(
    email,
    'Recuperação de Senha - RifasOnline',
    `<p>Olá ${user.name},</p>
     <p>Clique no link abaixo para redefinir sua senha:</p>
     <a href="${resetLink}">${resetLink}</a>
     <p>Este link expira em 1 hora.</p>`
  )

  return true
}
