import { hashPassword } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { token, newPassword } = req.body

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token e nova senha são obrigatórios' })
    }

    const user = await prisma.user.findFirst({
      where: { whatsappId: token }
    })

    if (!user) {
      return res.status(400).json({ error: 'Token inválido ou expirado' })
    }

    const hashedPassword = await hashPassword(newPassword)

    await prisma.user.update({
      where: { id: user.id },
      data: { 
        password: hashedPassword,
        whatsappId: null
      }
    })

    return res.status(200).json({ message: 'Senha redefinida com sucesso' })
  } catch (error) {
    console.error('Erro ao redefinir senha:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
