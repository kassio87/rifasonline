import { prisma } from '../../../lib/prisma'
import { getUserFromToken } from '../../../lib/auth'
import { hashPassword } from '../../../lib/auth'

export default async function handler(req, res) {
  const user = await getUserFromToken(req)
  
  if (!user) {
    return res.status(401).json({ error: 'Não autorizado' })
  }

  if (req.method === 'GET') {
    try {
      let where = {}

      if (user.role === 'CLIENT_ADMIN') {
        const clientAdmin = await prisma.clientAdmin.findUnique({
          where: { userId: user.id }
        })
        if (clientAdmin) {
          const sales = await prisma.sale.findMany({
            where: {
              raffle: { clientAdminId: clientAdmin.id }
            },
            select: { customerId: true }
          })
          const customerIds = [...new Set(sales.map(s => s.customerId))]
          where.id = { in: customerIds }
        }
      }

      const customers = await prisma.customer.findMany({
        where,
        include: {
          user: true,
          sales: {
            include: { raffle: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return res.status(200).json(customers)
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  if (req.method === 'POST') {
    try {
      const { name, email, phone, cpf, password } = req.body

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

      const hashedPassword = password ? await hashPassword(password) : await hashPassword('123456')

      const userCreated = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          role: 'CUSTOMER'
        }
      })

      const customer = await prisma.customer.create({
        data: {
          userId: userCreated.id,
          cpf
        },
        include: {
          user: true
        }
      })

      return res.status(201).json(customer)
    } catch (error) {
      console.error('Erro ao criar cliente:', error)
      return res.status(500).json({ error: 'Erro interno do servidor' })
    }
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
