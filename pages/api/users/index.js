import { prisma } from '../../../lib/prisma'
import { getUserFromToken } from '../../../lib/auth'
import { hashPassword } from '../../../lib/auth'

export default async function handler(req, res) {
  const user = await getUserFromToken(req)

  if (!user || user.role !== 'SYSTEM_ADMIN') {
    return res.status(403).json({ error: 'Acesso negado' })
  }

  if (req.method === 'GET') {
    try {
      const clientAdmins = await prisma.user.findMany({
        where: { role: 'CLIENT_ADMIN' },
        include: {
          clientAdmin: true
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.status(200).json(clientAdmins)
    } catch (error) {
      console.error('Erro ao buscar admins cliente:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, phone, companyName } = req.body

      if (!name || (!email && !phone)) {
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

      const tempPassword = Math.random().toString(36).slice(-8)
      const hashedPassword = await hashPassword(tempPassword)

      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role: 'CLIENT_ADMIN'
        }
      })

      const clientAdmin = await prisma.clientAdmin.create({
        data: {
          userId: newUser.id,
          companyName: companyName || name,
          subdomain: companyName ? companyName.toLowerCase().replace(/\s+/g, '-') : `cliente-${newUser.id}`
        },
        include: {
          user: true
        }
      })

      return res.status(201).json({
        ...clientAdmin,
        tempPassword
      })
    } catch (error) {
      console.error('Erro ao criar admin cliente:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
