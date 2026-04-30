import { prisma } from '../../lib/prisma'
import bcrypt from 'bcryptjs'

// Cria o admin do sistema e finaliza instalação
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, password, systemName, primaryColor, secondaryColor } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Dados obrigatórios faltando' })
  }

  try {
    // Verifica se já existe um admin
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'SYSTEM_ADMIN' }
    })

    if (existingAdmin) {
      return res.status(400).json({ error: 'Sistema já foi instalado' })
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Cria o admin do sistema
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'SYSTEM_ADMIN'
      }
    })

    // Salva configurações do sistema
    const configs = [
      { key: 'system_name', value: systemName || 'RifasOnline', description: 'Nome do sistema' },
      { key: 'primary_color', value: primaryColor || '#000000', description: 'Cor primária' },
      { key: 'secondary_color', value: secondaryColor || '#ffffff', description: 'Cor secundária' },
      { key: 'installed', value: 'true', description: 'Sistema instalado' },
      { key: 'install_date', value: new Date().toISOString(), description: 'Data de instalação' }
    ]

    for (const config of configs) {
      await prisma.systemConfig.create({ data: config })
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Instalação concluída com sucesso',
      admin: { id: admin.id, name: admin.name, email: admin.email }
    })
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      error: 'Erro na instalação: ' + error.message 
    })
  }
}
