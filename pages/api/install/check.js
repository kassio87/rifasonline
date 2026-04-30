import { prisma } from '../../lib/prisma'

// Verifica se o sistema já foi instalado
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Verifica se existe algum admin do sistema
    const systemAdmin = await prisma.user.findFirst({
      where: { role: 'SYSTEM_ADMIN' }
    })

    // Verifica se existem configurações do sistema
    const configs = await prisma.systemConfig.findMany({
      where: { key: 'installed' }
    })

    const isInstalled = systemAdmin !== null && configs.length > 0

    return res.status(200).json({
      installed: isInstalled,
      hasAdmin: systemAdmin !== null
    })
  } catch (error) {
    // Se o banco não existe ou tabelas não foram criadas
    return res.status(200).json({
      installed: false,
      hasAdmin: false,
      dbConnected: false
    })
  }
}
