import { hashPassword, generateToken } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' })
  }

  try {
    const { name, email, phone, password, role = 'CUSTOMER' } = req.body

    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({ error: 'Dados obrigatórios faltando' })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email || '' },
          { phone: phone || '' }
        ]
      }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'E-mail ou telefone já cadastrado' })
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role
      },
      include: {
        clientAdmin: true,
        customer: true
      }
    })

    const token = generateToken(user)

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Erro no registro:', error)
    return res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
