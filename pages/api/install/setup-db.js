import { PrismaClient } from '@prisma/client'

// Testa e configura a conexão com o MySQL
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { host, port, user, password, database } = req.body

  if (!host || !port || !user || !database) {
    return res.status(400).json({ error: 'Parâmetros incompletos' })
  }

  const testUrl = `mysql://${user}:${password}@${host}:${port}/${database}`

  try {
    // Tenta conectar com as credenciais fornecidas
    const testPrisma = new PrismaClient({
      datasources: {
        db: { url: testUrl }
      }
    })

    await testPrisma.$connect()
    await testPrisma.$disconnect()

    return res.status(200).json({ 
      success: true, 
      message: 'Conexão estabelecida com sucesso' 
    })
  } catch (error) {
    return res.status(400).json({ 
      success: false, 
      error: 'Falha na conexão: ' + error.message 
    })
  }
}
